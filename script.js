import { items } from './data.js';
import { calculateCost } from './calculator.js';
import { domElements } from './dom.js'; // Import DOM elements
import { populateTargetItemSelect, updateResultDisplay } from './ui.js';
import { loadPrices, exportPricesToFile, importPricesFromFile, populateItemPriceInputs, getCurrentPrices, updatePriceInputStyles, savePricesToLocalStorage } from './prices.js';
import { displayBreakdown, clearBreakdownDisplay, toggleBreakdownVisibility, showToggleButton, hideToggleButton, hideBreakdownContainer } from './breakdown.js';
import { setLanguage, toggleLanguage, getCurrentLang, getTranslation, LOCAL_STORAGE_LANG_KEY, translations } from './i18n.js';
import { formatNumber, getItemName } from './utils.js';

let lastCalculationResult = null; // Store the result of the last calculation
let involvedItemCosts = {}; // Store costs of items involved in last calculation for styling
let saveTimeout = null; // Timeout for debouncing price saves

const DEBOUNCE_DELAY = 500; // ms delay before saving after price input change

const debouncedSavePrices = () => {
    clearTimeout(saveTimeout); // Clear any existing timeout
    saveTimeout = setTimeout(() => {
        const currentPrices = getCurrentPrices();
        savePricesToLocalStorage(currentPrices);
        console.log("Prices auto-saved to localStorage.");
    }, DEBOUNCE_DELAY);
};

// --- Event Listeners ---

if (domElements.calculateButton) {
    domElements.calculateButton.addEventListener('click', () => {
        triggerCalculation();
        savePricesToLocalStorage(getCurrentPrices()); // Save on manual calc
    });
} else {
    console.error("Calculate button not found");
}

if (domElements.targetQuantityInput) {
    domElements.targetQuantityInput.addEventListener('change', () => {
        if (lastCalculationResult) {
            triggerCalculation('quantity');
            // No need to save here, 'change' event on price inputs handles saving
            // And debounced save handles keyup/continuous changes
        }
    });
    domElements.targetQuantityInput.addEventListener('keyup', (event) => {
        // Only recalculate and trigger debounce if it's a relevant key press
        if (event.key >= 0 && event.key <= 9 || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(event.key)) {
            if (lastCalculationResult) {
                triggerCalculation('quantity');
                debouncedSavePrices(); // Save after a short delay
            }
        }
    });
} else {
    console.error("Target quantity input not found");
}

if (domElements.targetItemSelect) {
    domElements.targetItemSelect.addEventListener('change', () => {
        triggerCalculation('item');
        // Price saving handled by input listeners
    });
} else {
    console.error("Target item select not found");
}

if (domElements.savePricesButton) {
    // The main purpose is export now, save happens automatically
    domElements.savePricesButton.addEventListener('click', exportPricesToFile);
} else {
    console.error("Save prices button (Export) not found");
}

if (domElements.loadPricesButton) {
    domElements.loadPricesButton.addEventListener('click', () => {
        importPricesFromFile(triggerCalculation); // Trigger recalc after import
    });
} else {
    console.error("Load prices button (Import) not found");
}

if (domElements.toggleBreakdownButton) {
    domElements.toggleBreakdownButton.addEventListener('click', toggleBreakdownVisibility);
} else {
    console.error("Toggle breakdown button not found");
}

if (domElements.langToggleButton) {
    domElements.langToggleButton.addEventListener('click', () => {
        // Save prices *before* changing language/UI updates
        savePricesToLocalStorage(getCurrentPrices());
        toggleLanguage({
            populateTargetItemSelect,
            populateItemPriceInputs,
            updateResultDisplay,
            clearBreakdownDisplay,
            hideBreakdownContainer,
            hideToggleButton,
        }, triggerCalculation);
    });
} else {
    console.error("Language toggle button not found");
}

// Listener for soup buttons
if (domElements.soupButtonContainer) {
    domElements.soupButtonContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.soup-button');
        if (button && button.dataset.itemid) {
            const itemId = button.dataset.itemid;
            if (domElements.targetItemSelect) {
                domElements.targetItemSelect.value = itemId;
                domElements.targetQuantityInput.value = 1; // Reset quantity to 1
                triggerCalculation('item'); // Trigger calculation after setting item
                // Remove scrolling behavior
                // const calcSection = document.querySelector('.calculation-section');
                // if (calcSection) {
                //     calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // } else {
                //     window.scrollTo({ top: 0, behavior: 'smooth' });
                // }
            }
        }
    });
} else {
     console.error("Soup button container not found.");
}

// Listener for price inputs (delegated)
if (domElements.resourcePricesContainer) {
    // Debounced save on 'input' for responsiveness
    domElements.resourcePricesContainer.addEventListener('input', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.id.startsWith('price-')) {
            // Update styles immediately if needed (only happens if there's a result)
            if (lastCalculationResult) {
                updatePriceInputStyles(involvedItemCosts);
            }
            debouncedSavePrices(); // Save after a short delay
        }
    });
    // Recalculate on 'change' (when focus is lost or Enter is pressed)
    domElements.resourcePricesContainer.addEventListener('change', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.id.startsWith('price-')) {
            clearTimeout(saveTimeout); // Clear any pending debounced save
            savePricesToLocalStorage(getCurrentPrices()); // Save immediately on change
            console.log("Prices saved to localStorage on input change.");

            // Trigger recalculation if an item is selected
            if (lastCalculationResult) {
                triggerCalculation('prices');
            }
        }
    });
} else {
    console.error("Resource prices container not found.");
}

// Listener for breakdown item buttons (delegated)
if (domElements.craftedItemsList) {
    domElements.craftedItemsList.addEventListener('click', (event) => {
        const button = event.target.closest('button.breakdown-item-button');
        if (button && button.dataset.itemid && domElements.targetItemSelect && domElements.targetQuantityInput) {
            const itemId = button.dataset.itemid;
            console.log(`Breakdown button clicked for: ${itemId}`);

            const optionExists = Array.from(domElements.targetItemSelect.options).some(opt => opt.value === itemId);

            if (optionExists) {
                domElements.targetItemSelect.value = itemId;
                domElements.targetQuantityInput.value = 1; // Reset quantity
                triggerCalculation('item'); // Trigger calculation
                // Remove scrolling behavior
                // const calcSection = document.querySelector('.calculation-section');
                // if (calcSection) {
                //     calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // } else {
                //     window.scrollTo({ top: 0, behavior: 'smooth' });
                // }
            } else {
                console.warn(`Item ID ${itemId} from breakdown button not found in target select.`);
            }
        }
    });
} else {
    console.error("Crafted items list element not found for breakdown button listener.");
}


// --- Calculation Logic ---

const triggerCalculation = (source = 'button') => {
    // ... (rest of the triggerCalculation function remains the same) ...
    if (!domElements.targetItemSelect || !domElements.targetQuantityInput) {
        console.error("Missing target item select or quantity input for calculation.");
        return;
    }
    const targetItemId = domElements.targetItemSelect.value;
    const targetQuantity = parseInt(domElements.targetQuantityInput.value, 10) || 1;

    if (!targetItemId || !items[targetItemId]) {
        updateResultDisplay(0, targetQuantity, getTranslation('selectValidItemError'));
        clearBreakdownDisplay();
        hideToggleButton();
        lastCalculationResult = null;
        involvedItemCosts = {};
        updatePriceInputStyles({});
        return;
    }

    updateResultDisplay(0, targetQuantity, getTranslation('calculating'));
    clearBreakdownDisplay();
    hideToggleButton();

    // Use setTimeout to allow UI to update before potentially blocking calculation
    setTimeout(() => {
        const currentPrices = getCurrentPrices();
        const calculationStartTime = performance.now();

        try {
            lastCalculationResult = calculateCost(targetItemId, targetQuantity, currentPrices, new Set());
            const calculationEndTime = performance.now();
            console.log(`Calculation for ${targetQuantity}x ${targetItemId} took ${(calculationEndTime - calculationStartTime).toFixed(2)} ms`);

            if (lastCalculationResult && lastCalculationResult.breakdown && lastCalculationResult.breakdown.isError) {
                console.error("Calculation Error:", lastCalculationResult.breakdown.error);
                const errorMessage = lastCalculationResult.breakdown.error || getTranslation('error');
                updateResultDisplay(0, targetQuantity, errorMessage);
                clearBreakdownDisplay();
                hideToggleButton();
                involvedItemCosts = {}; // Clear involved costs on error
                updatePriceInputStyles({}); // Clear styles on error
            } else if (lastCalculationResult && isFinite(lastCalculationResult.totalCost)) {
                updateResultDisplay(lastCalculationResult.totalCost, targetQuantity);

                // Reset and populate involvedItemCosts for styling
                involvedItemCosts = {};
                const flatBreakdown = flattenBreakdown(lastCalculationResult.breakdown);

                // Function to recursively extract purely calculated costs for involved items
                function extractCalculatedCosts(breakdownNode) {
                    if (!breakdownNode || !breakdownNode.itemId) return;
                    // Store the purely calculated cost per unit if it's available and valid
                    if (breakdownNode.calculatedCostPerUnit !== null && isFinite(breakdownNode.calculatedCostPerUnit)) {
                        // Only store if not already present (avoid overwriting from deeper recursion if structure allows)
                        if (!involvedItemCosts.hasOwnProperty(breakdownNode.itemId)) {
                            involvedItemCosts[breakdownNode.itemId] = breakdownNode.calculatedCostPerUnit;
                        }
                    }
                    // Recurse into ingredients
                    if (breakdownNode.ingredients) {
                        Object.values(breakdownNode.ingredients).forEach(extractCalculatedCosts);
                    }
                }

                // Start extraction from the top-level item
                extractCalculatedCosts(lastCalculationResult.breakdown);
                // Ensure the top-level item itself is included if it was craftable and calculated
                 if (lastCalculationResult.breakdown.calculatedCostPerUnit !== null && isFinite(lastCalculationResult.breakdown.calculatedCostPerUnit) && !involvedItemCosts.hasOwnProperty(targetItemId)) {
                    involvedItemCosts[targetItemId] = lastCalculationResult.breakdown.calculatedCostPerUnit;
                 }

                // Remove the target item itself from the *displayed* crafted list
                if (flatBreakdown.crafted.hasOwnProperty(targetItemId)) {
                    delete flatBreakdown.crafted[targetItemId];
                }

                displayBreakdown(flatBreakdown.crafted, flatBreakdown.base);
                showToggleButton(); // Show breakdown toggle
                updatePriceInputStyles(involvedItemCosts); // Update input styles based on calculation
            } else {
                // Handle cases where calculation might result in Infinity/NaN without an explicit error flag
                console.error("Calculation resulted in non-finite cost:", lastCalculationResult);
                updateResultDisplay(0, targetQuantity, getTranslation('infiniteCalcError'));
                clearBreakdownDisplay();
                hideToggleButton();
                involvedItemCosts = {}; // Clear involved costs
                updatePriceInputStyles({}); // Clear styles
            }
        } catch (error) {
            // Catch unexpected errors during the calculateCost call
            console.error("Unhandled error during calculation:", error);
            updateResultDisplay(0, targetQuantity, getTranslation('error'));
            clearBreakdownDisplay();
            hideToggleButton();
            lastCalculationResult = null; // Reset last result on error
            involvedItemCosts = {}; // Clear involved costs
            updatePriceInputStyles({}); // Clear styles
        }
    }, 10); // Small delay for UI update
};


// --- Breakdown Flattening ---

const flattenBreakdown = (breakdownNode, craftedItems = {}, baseItems = {}) => {
    if (!breakdownNode || !breakdownNode.itemId || breakdownNode.quantity <= 0) {
        return { crafted: craftedItems, base: baseItems };
    }

    const itemId = breakdownNode.itemId;

    // Determine target list (base or crafted)
    const targetList = breakdownNode.isBase ? baseItems : craftedItems;

    // Initialize item entry if it doesn't exist
    if (!targetList[itemId]) {
        targetList[itemId] = {
            quantity: 0,
            cost: 0,
            name_ru: breakdownNode.name_ru,
            name_uk: breakdownNode.name_uk,
            name_en: breakdownNode.name_en,
            error: null, // Initialize error state
            isError: false,
            ...(breakdownNode.isBase ? {} : { craftDetails: null }) // Add craftDetails only for crafted items
        };
    }

    // Aggregate data, prioritizing error state
    if (breakdownNode.isError) {
        // If the current node has an error, mark the aggregated item as errored
        if (targetList[itemId].error === null) { // Only set the first error encountered
             targetList[itemId].error = breakdownNode.error || getTranslation('error');
        }
        targetList[itemId].isError = true;
        targetList[itemId].cost = Infinity; // Ensure cost reflects error
        // Don't add quantity or cost if this specific node errored
    } else if (!targetList[itemId].isError) {
        // Only aggregate quantity and cost if the aggregated item isn't already marked as errored
        targetList[itemId].quantity += breakdownNode.quantity;
        targetList[itemId].cost += breakdownNode.cost;

        // Aggregate craft details for crafted items
        if (!breakdownNode.isBase && breakdownNode.craftDetails) {
             if (!targetList[itemId].craftDetails) {
                 targetList[itemId].craftDetails = { ...breakdownNode.craftDetails };
             } else {
                 // Check if craft details exist before trying to add to them
                 if (targetList[itemId].craftDetails.craftsNeeded !== undefined) {
                    targetList[itemId].craftDetails.craftsNeeded += breakdownNode.craftDetails.craftsNeeded;
                    targetList[itemId].craftDetails.actualYield += breakdownNode.craftDetails.actualYield;
                    targetList[itemId].craftDetails.totalCraftCost += breakdownNode.craftDetails.totalCraftCost;
                    targetList[itemId].craftDetails.ingredientsCost += breakdownNode.craftDetails.ingredientsCost;
                    targetList[itemId].craftDetails.energyCost += breakdownNode.craftDetails.energyCost;
                 } else {
                    // This case shouldn't happen if initialized correctly, but handle defensively
                     targetList[itemId].craftDetails = { ...breakdownNode.craftDetails };
                 }
             }
        }
    }

    // Recurse into ingredients only for non-base items
    if (!breakdownNode.isBase && breakdownNode.ingredients) {
        for (const ingredientId in breakdownNode.ingredients) {
            flattenBreakdown(breakdownNode.ingredients[ingredientId], craftedItems, baseItems);
        }
    }

    return { crafted: craftedItems, base: baseItems };
};

// --- Initialization ---

const initializeApp = () => {
    const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    const initialLang = translations && translations[savedLang] ? savedLang : 'ru';

    // Set language, populate UI elements (dropdown, price inputs)
    setLanguage(initialLang, {
        populateTargetItemSelect,
        populateItemPriceInputs,
        updateResultDisplay,
        clearBreakdownDisplay,
        hideBreakdownContainer,
        hideToggleButton,
    }, triggerCalculation); // Pass triggerCalculation for language change updates

    // Initial check after UI is populated
    setTimeout(() => {
        // Check if an item is selected initially (could be from previous session)
        if (domElements.targetItemSelect?.value && items[domElements.targetItemSelect.value]) {
            // Optional: Trigger initial calculation if an item is pre-selected
             // triggerCalculation('init');
        } else {
            // If no item is selected, ensure breakdown is hidden and styles are clear
            hideBreakdownContainer();
            hideToggleButton();
            updatePriceInputStyles({});
        }
        // Ensure prices are saved on load if they were loaded from storage
        savePricesToLocalStorage(getCurrentPrices());
    }, 100); // Delay slightly to ensure DOM is fully ready
};

// --- Start the application ---
initializeApp();