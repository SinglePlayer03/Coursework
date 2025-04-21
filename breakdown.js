import { domElements } from './dom.js';
import { getCurrentLang, getTranslation, translations } from './i18n.js';
import { formatNumber, getItemName } from './utils.js'; // Import getItemName from utils.js

/**
 * Creates a list item element for the breakdown display.
 * For crafted items, includes a button to select that item.
 * @param {string} itemId - The ID of the item.
 * @param {object} itemData - Data for the item (quantity, cost, names).
 * @param {boolean} isCrafted - Whether the item is an intermediate craft.
 * @returns {HTMLElement} The created list item element.
 */
const createBreakdownListItem = (itemId, itemData, isCrafted = false) => {
    const currentLang = getCurrentLang();
    const li = document.createElement('li');
    const itemName = getItemName(itemData, itemId, currentLang);

    const quantity = itemData.quantity || 0;
    const totalCost = itemData.cost || 0;
    const isError = itemData.isError || itemData.error || !isFinite(totalCost);

    if (isCrafted) {
        // --- Crafted Item: Create Button + Details ---
        const button = document.createElement('button');
        button.className = 'breakdown-item-button';
        button.dataset.itemid = itemId;
        button.textContent = itemName;
        li.appendChild(button);

        const detailsSpan = document.createElement('span');
        detailsSpan.className = 'breakdown-item-details';

        if (isError) {
            const errorMsg = itemData.error || getTranslation('error');
            detailsSpan.textContent = ` : ${errorMsg}`; // Add space before colon
            detailsSpan.style.color = '#e06c75'; // Use theme error color
        } else {
            const costPer = quantity > 0 && isFinite(totalCost) ? totalCost / quantity : 0;
            const formattedCost = formatNumber(totalCost);
            const formattedCostPer = formatNumber(costPer);
            // Add space before colon in the template lookup if needed, or here:
            detailsSpan.textContent = ` : ${getTranslation('breakdownDetailTemplate')
                                        .replace('{quantity}', quantity.toLocaleString())
                                        .replace('{totalCost}', formattedCost)
                                        .replace('{costPer}', formattedCostPer)}`;
        }
        li.appendChild(detailsSpan);
        li.title = `${itemName}${detailsSpan.textContent.replace(' : ', ': ')}`; // Tooltip for the whole line

    } else {
        // --- Base Item: Just Text ---
        li.classList.add('base-item'); // Add class for potential specific styling
        if (isError) {
            const errorMsg = itemData.error || getTranslation('error');
            const textContent = `${itemName}: ${errorMsg}`;
            li.style.color = '#e06c75'; // Use theme error color
            li.textContent = textContent;
            li.title = textContent;
        } else {
            const costPer = quantity > 0 && isFinite(totalCost) ? totalCost / quantity : 0;
            const formattedCost = formatNumber(totalCost);
            const formattedCostPer = formatNumber(costPer);
            let textContent = `${itemName}: `;
            textContent += getTranslation('breakdownDetailTemplate')
                           .replace('{quantity}', quantity.toLocaleString())
                           .replace('{totalCost}', formattedCost)
                           .replace('{costPer}', formattedCostPer);
            li.textContent = textContent;
            li.title = textContent;
        }
    }

    return li;
};

/**
 * Displays the flattened breakdown lists in the UI.
 * @param {object} craftedItems - Aggregated data for crafted intermediates.
 * @param {object} baseItems - Aggregated data for base resources.
 */
export const displayBreakdown = (craftedItems, baseItems) => {
    const currentLang = getCurrentLang();
    if (!domElements.craftedItemsList || !domElements.baseItemsList || !domElements.craftedItemsTitleElement || !domElements.baseItemsTitleElement) {
        console.error("Breakdown list elements or titles not found.");
        return;
    }

    // Update titles with current language
    domElements.craftedItemsTitleElement.textContent = getTranslation('craftedItemsTitle');
    domElements.baseItemsTitleElement.textContent = getTranslation('baseItemsTitle');

    domElements.craftedItemsList.innerHTML = ''; // Clear previous content
    domElements.baseItemsList.innerHTML = '';

    // Sort items by name within each category
    const sortedCrafted = Object.entries(craftedItems)
        .filter(([itemId, data]) => data && (data.name_ru || data.name_uk || data.name_en)) // Ensure valid data before sorting
        .sort(([, itemA], [, itemB]) => getItemName(itemA, null, currentLang).localeCompare(getItemName(itemB, null, currentLang), currentLang));
    const sortedBase = Object.entries(baseItems)
         .filter(([itemId, data]) => data && (data.name_ru || data.name_uk || data.name_en || data.isError)) // Ensure valid data (or error) before sorting
         .sort(([, itemA], [, itemB]) => getItemName(itemA, null, currentLang).localeCompare(getItemName(itemB, null, currentLang), currentLang));

    // Populate Crafted Items List
    if (sortedCrafted.length > 0) {
        sortedCrafted.forEach(([itemId, data]) => {
            domElements.craftedItemsList.appendChild(createBreakdownListItem(itemId, data, true));
        });
    } else {
        const li = document.createElement('li');
        li.textContent = getTranslation('noCraftedItems');
        li.style.fontStyle = 'italic';
        domElements.craftedItemsList.appendChild(li);
    }

    // Populate Base Items List
    if (sortedBase.length > 0) {
        sortedBase.forEach(([itemId, data]) => {
             domElements.baseItemsList.appendChild(createBreakdownListItem(itemId, data, false));
        });
    } else {
        const li = document.createElement('li');
        li.textContent = getTranslation('noBaseItems');
        li.style.fontStyle = 'italic';
        domElements.baseItemsList.appendChild(li);
    }
};

/**
 * Clears the content of the breakdown lists.
 */
export const clearBreakdownDisplay = () => {
    if (domElements.craftedItemsList) domElements.craftedItemsList.innerHTML = '';
    if (domElements.baseItemsList) domElements.baseItemsList.innerHTML = '';
    if (domElements.craftedItemsTitleElement) domElements.craftedItemsTitleElement.textContent = getTranslation('craftedItemsTitle');
    if (domElements.baseItemsTitleElement) domElements.baseItemsTitleElement.textContent = getTranslation('baseItemsTitle');
};

/**
 * Toggles the visibility of the breakdown container.
 */
export const toggleBreakdownVisibility = () => {
    if (!domElements.breakdownContainer) return;
    const isHidden = domElements.breakdownContainer.style.display === 'none';
    domElements.breakdownContainer.style.display = isHidden ? 'block' : 'none';
    // Update button text based on state? Optional.
    // if (domElements.toggleBreakdownButton) {
    //     domElements.toggleBreakdownButton.textContent = getTranslation(isHidden ? 'toggleBreakdownButton' : 'toggleBreakdownButton'); // Assuming same key hides/shows
    // }
};

/**
 * Shows the breakdown container.
 * NOTE: This function primarily manages the *container* visibility.
 *       Use showToggleButton/hideToggleButton for the button itself.
 */
export const showBreakdownContainer = () => {
    if (domElements.breakdownContainer) {
        domElements.breakdownContainer.style.display = 'block';
    }
    // Logic to show/hide the button itself is moved to separate functions
};

/**
 * Hides the breakdown container.
 */
export const hideBreakdownContainer = () => {
    if (domElements.breakdownContainer) {
        domElements.breakdownContainer.style.display = 'none';
    }
};

/**
 * Shows the toggle breakdown button.
 * Call this when a valid calculation result is available.
 */
export const showToggleButton = () => {
    if (domElements.toggleBreakdownButton) {
        domElements.toggleBreakdownButton.style.display = 'inline-block';
        // Ensure the button text is updated to the current language's default
        domElements.toggleBreakdownButton.textContent = getTranslation('toggleBreakdownButton');
    }
};

/**
 * Hides the toggle breakdown button.
 * Call this when calculation is pending, fails, or no item is selected.
 */
export const hideToggleButton = () => {
    if (domElements.toggleBreakdownButton) {
        domElements.toggleBreakdownButton.style.display = 'none';
    }
};