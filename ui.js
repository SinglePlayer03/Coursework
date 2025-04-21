import { items } from './data.js';
import { getCurrentLang, getTranslation, translations } from './i18n.js';
import { domElements } from './dom.js';
import { getItemName } from './utils.js';

export const populateTargetItemSelect = () => {
    if (!domElements.targetItemSelect || !items) return;
    const currentLang = getCurrentLang();
    const selectedValue = domElements.targetItemSelect.value;

    const craftableItems = Object.entries(items)
                                .filter(([id, item]) => item.craftable === true);

    craftableItems.sort(([, itemA], [, itemB]) => {
        const nameA = getItemName(itemA, null, currentLang).toLowerCase();
        const nameB = getItemName(itemB, null, currentLang).toLowerCase();
        return nameA.localeCompare(nameB, currentLang);
    });

    domElements.targetItemSelect.innerHTML = '';

    craftableItems.forEach(([itemId, item]) => {
        const option = document.createElement('option');
        option.value = itemId;
        option.textContent = getItemName(item, itemId, currentLang);
        domElements.targetItemSelect.appendChild(option);
    });

    if (selectedValue && craftableItems.some(([id]) => id === selectedValue)) {
        domElements.targetItemSelect.value = selectedValue;
    } else if (craftableItems.length > 0) {
        if (!domElements.targetItemSelect.value) {
             domElements.targetItemSelect.value = craftableItems[0][0];
        }
    }
};

export const updateResultDisplay = (totalCost, quantity, statusMessage = null) => {
    if (!domElements.totalCostSpan || !domElements.costPerItemSpan || !domElements.costPerItemLabel) return;

    const costPerItem = quantity > 0 && isFinite(totalCost) ? totalCost / quantity : 0;
    const displayQuantity = Math.max(1, quantity || 1);

    if (statusMessage) {
        domElements.totalCostSpan.textContent = statusMessage;
        domElements.costPerItemSpan.textContent = statusMessage;
        domElements.costPerItemLabel.dataset.langKey = "costPerItemLabel";
        domElements.costPerItemLabel.textContent = getTranslation("costPerItemLabel");
        domElements.costPerItemLabel.style.display = 'inline';
        domElements.costPerItemSpan.style.display = 'inline';
    } else if (!isFinite(totalCost) || isNaN(totalCost)) {
        domElements.totalCostSpan.textContent = getTranslation('error');
        domElements.costPerItemSpan.textContent = getTranslation('error');
        domElements.costPerItemLabel.dataset.langKey = "costPerItemLabel";
        domElements.costPerItemLabel.textContent = getTranslation("costPerItemLabel");
        domElements.costPerItemLabel.style.display = 'inline';
        domElements.costPerItemSpan.style.display = 'inline';
    } else {
        domElements.totalCostSpan.textContent = totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        domElements.costPerItemSpan.textContent = costPerItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const showCostPerItem = displayQuantity >= 1;
        domElements.costPerItemLabel.dataset.langKey = "costPerItemLabel";
        domElements.costPerItemLabel.textContent = getTranslation("costPerItemLabel");
        domElements.costPerItemLabel.style.display = showCostPerItem ? 'inline' : 'none';
        domElements.costPerItemSpan.style.display = showCostPerItem ? 'inline' : 'none';
    }
};