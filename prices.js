import { domElements } from './dom.js';
import { items } from './data.js';
import { getCurrentLang, getTranslation } from './i18n.js';
import { getItemName } from './utils.js';

// --- Constants ---
const LOCAL_STORAGE_PRICES_KEY = 'stalcraftCalculatorPrices';
const PRICE_INPUT_PREFIX = 'price-';

// --- Price Management ---

/**
 * Sets temporary feedback text and style on a button.
 * @param {HTMLElement} buttonElement - The button element.
 * @param {string} messageKey - The translation key for the message.
 * @param {string} styleClass - The class to add ('success' or 'error').
 * @param {number} duration - How long to show the feedback in ms.
 */
const showTemporaryFeedback = (buttonElement, messageKey, styleClass, duration = 2000) => {
    if (!buttonElement) return;
    const originalTextKey = buttonElement.dataset.langKey || ''; // Assuming lang key reflects original text
    const originalText = originalTextKey ? getTranslation(originalTextKey) : buttonElement.textContent; // Fallback
    const messageText = getTranslation(messageKey);

    buttonElement.textContent = messageText;
    buttonElement.classList.remove('success', 'error'); // Clear previous styles
    buttonElement.classList.add(styleClass);

    setTimeout(() => {
        // Only revert if the button still shows the feedback message and has the class
        if (buttonElement.textContent === messageText && buttonElement.classList.contains(styleClass)) {
            buttonElement.textContent = originalText;
            buttonElement.classList.remove(styleClass);
        }
    }, duration);
};

/**
 * Saves the provided prices object to localStorage.
 * @param {object} prices - The prices object to save.
 * @returns {boolean} True if save was successful, false otherwise.
 */
export const savePricesToLocalStorage = (prices) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(prices));
        // Optionally provide feedback on the SAVE button even when loading,
        // indicating that the loaded prices are now persisted.
        showTemporaryFeedback(domElements.savePricesButton, 'pricesSavedSuccess', 'success');
        return true;
    } catch (e) {
        console.error("Error saving prices to localStorage:", e);
        showTemporaryFeedback(domElements.savePricesButton, 'pricesSavedError', 'error');
        alert(getTranslation('saveErrorAlert'));
        return false;
    }
};

/**
 * Loads saved prices from localStorage.
 * @returns {object} An object containing the saved prices keyed by itemId.
 */
export const loadPrices = () => {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error("Error loading prices from localStorage:", e);
        return {};
    }
};

/**
 * Exports the current prices from input fields to a text file.
 */
export const exportPricesToFile = () => {
    const prices = getCurrentPrices(); // Get prices from input fields
    const jsonString = JSON.stringify(prices, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    // Suggest a filename (users can change it)
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    a.download = `stalcraft-prices-${timestamp}.json`;
    document.body.appendChild(a); // Required for Firefox
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Provide feedback on the save button
    showTemporaryFeedback(domElements.savePricesButton, 'pricesSavedSuccess', 'success');
};

/**
 * Imports prices from a user-selected text/JSON file.
 * Updates UI inputs and saves to localStorage on success.
 * @param {function} [onLoadCallback] - Optional callback function to run after prices are loaded and UI is updated.
 */
export const importPricesFromFile = (onLoadCallback) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json, .txt, application/json, text/plain'; // Accept JSON or plain text

    input.onchange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            showTemporaryFeedback(domElements.loadPricesButton, 'pricesLoadFileError', 'error');
            return;
        }

        const reader = new FileReader();

        reader.onload = (readEvent) => {
            try {
                const content = readEvent.target?.result;
                if (typeof content !== 'string') {
                    throw new Error("File content is not a string.");
                }
                const loadedPrices = JSON.parse(content);

                // Basic validation: check if it's an object
                if (typeof loadedPrices !== 'object' || loadedPrices === null || Array.isArray(loadedPrices)) {
                    throw new Error("Invalid file format: Not a JSON object.");
                }

                // More specific validation (optional but recommended)
                let validPrices = {};
                let invalidEntries = 0;
                for (const itemId in loadedPrices) {
                    // Check if itemId exists in our known items (optional, depends if you want strict loading)
                    // if (!items[itemId]) {
                    //     console.warn(`Loaded price for unknown item ID: ${itemId}. Skipping.`);
                    //     invalidEntries++;
                    //     continue;
                    // }
                    const price = loadedPrices[itemId];
                    // Check if price is a non-negative number
                    if (typeof price === 'number' && isFinite(price) && price >= 0) {
                        validPrices[itemId] = price;
                    } else {
                        console.warn(`Invalid price value for item ID ${itemId}: ${price}. Setting to 0.`);
                        validPrices[itemId] = 0; // Default to 0 if invalid
                        invalidEntries++;
                    }
                }

                // Update UI input fields
                if (!domElements.resourcePricesContainer) return;
                const inputs = domElements.resourcePricesContainer.querySelectorAll(`input[id^="${PRICE_INPUT_PREFIX}"]`);
                inputs.forEach(inputElement => {
                    const itemId = inputElement.id.substring(PRICE_INPUT_PREFIX.length);
                    const newPrice = validPrices[itemId]; // Use validated price
                    if (newPrice !== undefined) {
                        // Set input value: empty string for 0, otherwise the number
                        inputElement.value = (newPrice === 0) ? '' : newPrice;
                    } else {
                        // If price wasn't in the loaded file, clear the input (or keep existing?)
                        // Let's clear it to reflect the loaded file accurately.
                        inputElement.value = '';
                    }
                });

                // Save the successfully loaded and validated prices to localStorage
                savePricesToLocalStorage(validPrices);

                showTemporaryFeedback(domElements.loadPricesButton, 'pricesLoadedSuccess', 'success');

                // Run the callback if provided (e.g., trigger recalculation)
                if (typeof onLoadCallback === 'function') {
                    onLoadCallback('prices_import');
                }

            } catch (error) {
                console.error("Error parsing or processing loaded prices file:", error);
                showTemporaryFeedback(domElements.loadPricesButton, 'pricesLoadedError', 'error');
                alert(`${getTranslation('pricesLoadedError')}: ${error.message}`);
            } finally {
                 // Clean up the file input element - remove this if input is permanent
                 // input.remove(); // Or clear value: input.value = '';
            }
        };

        reader.onerror = () => {
            console.error("Error reading file:", reader.error);
            showTemporaryFeedback(domElements.loadPricesButton, 'pricesLoadFileError', 'error');
            // input.remove(); // Or clear value: input.value = '';
        };

        reader.readAsText(file);
    };

    // Trigger the file selection dialog
    input.click();
};

/**
 * Gets the current prices from the input fields.
 * Treats empty inputs as 0.
 * @returns {object} An object containing the current prices keyed by itemId.
 */
export const getCurrentPrices = () => {
    const prices = {};
    if (!domElements.resourcePricesContainer) return {};

    const inputs = domElements.resourcePricesContainer.querySelectorAll(`input[id^="${PRICE_INPUT_PREFIX}"]`);
    inputs.forEach(input => {
        const itemId = input.id.substring(PRICE_INPUT_PREFIX.length);
        // Use parseFloat, treat empty or invalid as 0, ensure non-negative
        const rawValue = input.value.trim();
        const price = rawValue === '' ? 0 : parseFloat(rawValue);
        prices[itemId] = isNaN(price) ? 0 : Math.max(0, price); // Ensure price is not negative and handle potential NaN
    });
    return prices;
};

/**
 * Populates the resource price input fields into two columns: non-craftable (base) and craftable.
 * Loads saved prices and sets input values. Empty string for 0.
 */
export const populateItemPriceInputs = () => {
    if (!domElements.resourcePricesContainer || !items) return;
    const currentLang = getCurrentLang();
    const savedPrices = loadPrices();

    const sortedItems = Object.entries(items).sort(([, itemA], [, itemB]) => {
        const nameA = getItemName(itemA, null, currentLang).toLowerCase();
        const nameB = getItemName(itemB, null, currentLang).toLowerCase();
        return nameA.localeCompare(nameB, currentLang);
    });

    domElements.resourcePricesContainer.innerHTML = ''; // Clear existing inputs

    // Create wrapper divs for each column with its title
    const baseColumnWrapper = document.createElement('div');
    baseColumnWrapper.className = 'price-column-wrapper';
    const craftableColumnWrapper = document.createElement('div');
    craftableColumnWrapper.className = 'price-column-wrapper';

    // Create titles
    const baseTitle = document.createElement('h3'); // Using H3 for semantic hierarchy within the section
    baseTitle.className = 'price-column-title';
    baseTitle.dataset.langKey = 'baseResourcesColumnTitle';
    baseTitle.textContent = getTranslation('baseResourcesColumnTitle'); // Set initial text

    const craftableTitle = document.createElement('h3');
    craftableTitle.className = 'price-column-title';
    craftableTitle.dataset.langKey = 'craftableResourcesColumnTitle';
    craftableTitle.textContent = getTranslation('craftableResourcesColumnTitle'); // Set initial text

    // Create the columns themselves
    const baseColumn = document.createElement('div');
    baseColumn.className = 'price-column non-craftable-column';
    const craftableColumn = document.createElement('div');
    craftableColumn.className = 'price-column craftable-column';

    // Append titles and columns to wrappers
    baseColumnWrapper.appendChild(baseTitle);
    baseColumnWrapper.appendChild(baseColumn);
    craftableColumnWrapper.appendChild(craftableTitle);
    craftableColumnWrapper.appendChild(craftableColumn);

    // Append wrappers to the main container
    domElements.resourcePricesContainer.appendChild(baseColumnWrapper);
    domElements.resourcePricesContainer.appendChild(craftableColumnWrapper);

    // Define items to exclude from the price list
    const excludedItemIds = ['чесночный_суп', 'гороховый_суп', 'солянка'];

    sortedItems.forEach(([itemId, item]) => {
        // --- Skip excluded items ---
        if (excludedItemIds.includes(itemId)) {
            return;
        }
        // --- End Skip ---

        // Default price logic
        let defaultPrice = 0;
        if (savedPrices[itemId] !== undefined && savedPrices[itemId] > 0) {
            defaultPrice = savedPrices[itemId];
        } else if (savedPrices[itemId] === undefined && !item.craftable) {
            defaultPrice = item.avgPrice || 0;
        }

        const group = document.createElement('div');
        group.className = 'price-input-group';
        if (!item.craftable) {
            group.classList.add('non-craftable');
        }

        const label = document.createElement('label');
        label.htmlFor = `${PRICE_INPUT_PREFIX}${itemId}`;
        label.textContent = getItemName(item, itemId, currentLang);
        label.title = getItemName(item, itemId, currentLang);

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `${PRICE_INPUT_PREFIX}${itemId}`;
        input.value = defaultPrice === 0 ? '' : defaultPrice;
        input.min = "0";
        input.step = "0.01";
        input.placeholder = getTranslation('priceInputPlaceholder');

        group.appendChild(label);
        group.appendChild(input);

        // Append to the correct column (Base first, then Craftable)
        if (item.craftable) {
            craftableColumn.appendChild(group);
        } else {
            baseColumn.appendChild(group); // Base items go in the first column
        }
    });
};

/**
 * Updates the visual style of price input fields based on calculated crafting costs vs. entered prices.
 * - Base items: Red border if price is missing (0 or empty).
 * - Craftable items: Red border if entered price is CHEAPER than crafting. Green border if entered price is MORE EXPENSIVE than crafting.
 */
export const updatePriceInputStyles = (involvedItemCosts) => {
    if (!domElements.resourcePricesContainer || !items) return;

    const priceGroups = domElements.resourcePricesContainer.querySelectorAll('.price-input-group');
    const tolerance = 0.001; // Tolerance for floating point comparison

    priceGroups.forEach(priceGroup => {
        const input = priceGroup.querySelector(`input[id^="${PRICE_INPUT_PREFIX}"]`);
        if (!input) return;

        const itemId = input.id.substring(PRICE_INPUT_PREFIX.length);
        const item = items[itemId];

        if (!item) return; // Skip if item not found

        // Remove existing comparison classes first
        priceGroup.classList.remove('cheaper-to-buy', 'cheaper-to-craft', 'missing-price');

        const enteredValue = input.value.trim();
        const enteredPrice = enteredValue === '' ? 0 : parseFloat(enteredValue);
        const isValidEnteredPrice = !isNaN(enteredPrice) && enteredPrice > 0;

        if (item.craftable) {
            // --- Craftable Item Logic ---
            // Check if we have a valid calculated cost for this item from the last calculation
            if (involvedItemCosts.hasOwnProperty(itemId) && involvedItemCosts[itemId] !== null && isFinite(involvedItemCosts[itemId])) {
                const calculatedCost = involvedItemCosts[itemId];

                // Only apply styles if the user has entered a valid, positive price
                if (isValidEnteredPrice) {
                    // Calculated < Entered => Cheaper to CRAFT => Green ('cheaper-to-craft')
                    if (calculatedCost < enteredPrice - tolerance) {
                        // Only mark green if calculated cost is actually positive
                        if (calculatedCost > tolerance) {
                             priceGroup.classList.add('cheaper-to-craft');
                        }
                    }
                    // Calculated > Entered => Cheaper to BUY => Red ('cheaper-to-buy')
                    else if (calculatedCost > enteredPrice + tolerance) {
                         priceGroup.classList.add('cheaper-to-buy');
                    }
                    // If within tolerance, or calculated cost is zero/negative, no specific class (neutral)
                }
                // If entered price is 0, empty, or invalid, don't apply red/green border
            }
            // If the item is craftable but wasn't involved OR calculation was invalid (Infinity/null), no comparison class.
        } else {
            // --- Base Item Logic ---
            // Highlight red only if the price is missing (empty or 0)
            if (!isValidEnteredPrice) {
                priceGroup.classList.add('missing-price');
            }
        }
    });
};