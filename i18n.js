import { items } from './data.js'; // Import items for name fallback in case of missing price
import { getItemName as getItemNameUtil } from './utils.js'; // Import utility to get name
import { savePricesToLocalStorage, getCurrentPrices } from './prices.js'; // Import price saving functions

// --- Constants ---
export const LOCAL_STORAGE_LANG_KEY = 'stalcraftCalculatorLang';

// --- State ---
let currentLang = 'ru'; // Default language

// --- Translations ---
export const translations = {
    ru: {
        pageTitle: "Stalcraft X Крафт Калькулятор",
        mainHeading: "Stalcraft X Крафт Калькулятор",
        calcSectionTitle: "Расчет стоимости крафта",
        selectItemLabel: "Выберите предмет:",
        quantityLabel: "Количество:",
        quantityPlaceholder: "Кол-во",
        calculateButton: "Рассчитать",
        totalCostLabel: "Общая стоимость",
        costPerItemLabel: "Стоимость за 1 шт",
        toggleBreakdownButton: "Показать/Скрыть детализацию",
        breakdownTitle: "Детализация крафта:",
        craftedItemsTitle: "Промежуточные компоненты (Крафт):",
        baseItemsTitle: "Базовые ресурсы (Покупка/Сбор):",
        pricesTitle: "Цены ресурсов",
        savePricesButton: "Экспорт Цен", // Changed text to reflect file export
        pricesDescription: "Введите текущие рыночные цены (за 1 шт).", // Updated description
        priceInputPlaceholder: "Рассчитать крафт",
        pricesSavedSuccess: "Цены сохранены!", // Used by local storage save feedback now
        pricesSavedError: "Ошибка сохранения", // Used by local storage save feedback now
        pricesExportSuccess: "Цены экспортированы!", // New key for file export feedback
        pricesExportError: "Ошибка экспорта", // New key for file export feedback
        noCraftedItems: "Нет промежуточных крафтов",
        noCraftedItemsTitle: "Промежуточные компоненты (Крафт):",
        noBaseItems: "Нет базовых ресурсов",
        calculating: "...",
        error: "Ошибка",
        loadPricesButton: "Импорт Цен", // Changed text to reflect file import
        pricesLoadedSuccess: "Цены импортированы!",
        pricesLoadedError: "Ошибка импорта",
        pricesLoadFileError: "Ошибка чтения файла",
        selectValidItemError: "Пожалуйста, выберите действительный предмет.",
        infiniteCalcError: "Расчет привел к бесконечному или нечисловому результату. Проверьте цены и возможные циклы крафта.",
        breakdownDetailTemplate: "{quantity} шт. (Общая стоимость: {totalCost}, Цена за шт: {costPer})",
        breakdownCraftDetails: "({craftsNeeded} крафт(а/ов) => {actualYield} шт. Всего: {totalCraftCost} [Ингр: {ingredientsCost}, Энергия: {energyCost}])",
        dataLoadError: "Ошибка: Данные о предметах не загружены.",
        saveErrorAlert: "Не удалось сохранить цены. Возможно, хранилище переполнено.",
        missingBasePriceError: "Цена для базового ресурса '{itemName}' не указана.",
        baseResourcesColumnTitle: "Базовые ресурсы",
        craftableResourcesColumnTitle: "Крафтовые ресурсы",
    },
    uk: {
        pageTitle: "Stalcraft X Крафт Калькулятор",
        mainHeading: "Stalcraft X Крафт Калькулятор",
        calcSectionTitle: "Розрахунок вартості крафту",
        selectItemLabel: "Оберіть предмет:",
        quantityLabel: "Кількість:",
        quantityPlaceholder: "К-сть",
        calculateButton: "Розрахувати",
        totalCostLabel: "Загальна вартість",
        costPerItemLabel: "Вартість за 1 шт",
        toggleBreakdownButton: "Показати/Приховати деталізацію",
        breakdownTitle: "Деталізація крафту:",
        craftedItemsTitle: "Проміжні компоненти (Крафт):",
        baseItemsTitle: "Базові ресурси (Купівля/Збір):",
        pricesTitle: "Ціни ресурсів",
        savePricesButton: "Експорт Цін", // Changed text
        pricesDescription: "Введіть поточні ринкові ціни (за 1 шт).", // Updated description
        priceInputPlaceholder: "Розрахувати крафт",
        pricesSavedSuccess: "Ціни збережено!",
        pricesSavedError: "Помилка збереження",
        pricesExportSuccess: "Ціни експортовано!", // New key
        pricesExportError: "Помилка експорту", // New key
        noCraftedItems: "Немає проміжних крафтів",
        noCraftedItemsTitle: "Проміжні компоненти (Крафт):",
        noBaseItems: "Немає базових ресурсів",
        calculating: "...",
        error: "Помилка",
        loadPricesButton: "Імпорт Цін", // Changed text
        pricesLoadedSuccess: "Ціни імпортовано!",
        pricesLoadedError: "Помилка імпорту",
        pricesLoadFileError: "Помилка читання файлу",
        selectValidItemError: "Будь ласка, оберіть дійсний предмет.",
        infiniteCalcError: "Розрахунок призвів до нескінченного або нечислового результату. Перевірте ціни та можливі цикли крафту.",
        breakdownDetailTemplate: "{quantity} шт. (Загальна вартість: {totalCost}, Ціна за шт: {costPer})",
        breakdownCraftDetails: "({craftsNeeded} крафт(и/ів) => {actualYield} шт. Усього: {totalCraftCost} [Інгр: {ingredientsCost}, Енергія: {energyCost}])",
        dataLoadError: "Помилка: Дані про предмети не завантажені.",
        saveErrorAlert: "Не вдалося зберегти ціни. Можливо, сховище переповнене.",
        missingBasePriceError: "Ціну для базового ресурсу '{itemName}' не вказано.",
        baseResourcesColumnTitle: "Базові ресурси",
        craftableResourcesColumnTitle: "Крафтові ресурси",
    },
    en: {
        pageTitle: "Stalcraft X Crafting Calculator",
        mainHeading: "Stalcraft X Crafting Calculator",
        calcSectionTitle: "Crafting Cost Calculation",
        selectItemLabel: "Select item:",
        quantityLabel: "Quantity:",
        quantityPlaceholder: "Qty",
        calculateButton: "Calculate",
        totalCostLabel: "Total cost",
        costPerItemLabel: "Cost per 1 item",
        toggleBreakdownButton: "Show/Hide Breakdown",
        breakdownTitle: "Crafting Breakdown:",
        craftedItemsTitle: "Intermediate Components (Crafted):",
        baseItemsTitle: "Base Resources (Buy/Gather):",
        pricesTitle: "Resource Prices",
        savePricesButton: "Export Prices", // Changed text
        pricesDescription: "Enter current market prices (per 1 item).", // Updated description
        priceInputPlaceholder: "Calculate craft",
        pricesSavedSuccess: "Prices saved!",
        pricesSavedError: "Save error",
        pricesExportSuccess: "Prices exported!", // New key
        pricesExportError: "Export error", // New key
        noCraftedItems: "No intermediate crafts",
        noCraftedItemsTitle: "Intermediate Components (Crafted):",
        noBaseItems: "No base resources",
        calculating: "...",
        error: "Error",
        loadPricesButton: "Import Prices", // Changed text
        pricesLoadedSuccess: "Prices imported!",
        pricesLoadedError: "Import error",
        pricesLoadFileError: "File read error",
        selectValidItemError: "Please select a valid item.",
        infiniteCalcError: "Calculation resulted in infinite or non-numeric value. Check prices and potential crafting cycles.",
        breakdownDetailTemplate: "{quantity} pcs (Total cost: {totalCost}, Price per pc: {costPer})",
        breakdownCraftDetails: "({craftsNeeded} craft(s) => {actualYield} pcs. Total: {totalCraftCost} [Ingr: {ingredientsCost}, Energy: {energyCost}])",
        dataLoadError: "Error: Item data not loaded.",
        saveErrorAlert: "Could not save prices. Storage might be full.",
        missingBasePriceError: "Price for base resource '{itemName}' is missing.",
        baseResourcesColumnTitle: "Base Resources",
        craftableResourcesColumnTitle: "Craftable Resources",
    }
};

export const getCurrentLang = () => currentLang;

export const getTranslation = (key, placeholders = {}) => {
    let translation = translations?.[currentLang]?.[key] ?? key;

    for (const placeholder in placeholders) {
        translation = translation.replace(`{${placeholder}}`, placeholders[placeholder]);
    }

    return translation;
};

export const setLanguage = (lang, uiFunctions, triggerRecalculation) => {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not found in translations.`);
        return;
    }

    // --- Save current prices before changing language ---
    const currentPrices = getCurrentPrices();
    savePricesToLocalStorage(currentPrices);
    console.log("Prices saved before language change.");
    // --- End Save ---

    currentLang = lang;
    document.documentElement.lang = lang;
    document.title = getTranslation('pageTitle');

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = getTranslation(key);

        if (translation !== key) {
            if (element.tagName === 'INPUT' && element.hasAttribute('data-lang-placeholder-key')) {
                const placeholderKey = element.getAttribute('data-lang-placeholder-key');
                element.placeholder = getTranslation(placeholderKey);
            } else if (element.tagName === 'BUTTON' || !element.children.length || element.hasAttribute('data-lang-key')) {
                element.textContent = translation;
            } else {
                let textNode = null;
                for (let i = 0; i < element.childNodes.length; i++) {
                    if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].textContent.trim().length > 0) {
                        textNode = element.childNodes[i];
                        break;
                    }
                }
                if (textNode) {
                    const leadingSpace = textNode.textContent.match(/^\s*/)[0];
                    const trailingSpace = textNode.textContent.match(/\s*$/)[0];
                    textNode.textContent = leadingSpace + translation + trailingSpace;
                } else {
                    if (!element.querySelector('div, p, h1, h2, h3, h4, h5, h6, ul, li')) {
                        element.textContent = translation;
                    } else {
                        let potentialTextNode = findFirstTextNode(element);
                        if (potentialTextNode) {
                            const leadingSpace = potentialTextNode.textContent.match(/^\s*/)[0];
                            const trailingSpace = potentialTextNode.textContent.match(/\s*$/)[0];
                            potentialTextNode.textContent = leadingSpace + translation + trailingSpace;
                        } else {
                            console.warn(`Could not automatically translate complex element with key: ${key}`, element);
                        }
                    }
                }
            }
        }
    });

    const langToggleButton = document.getElementById('lang-toggle-button');
    if (langToggleButton) {
        langToggleButton.textContent = lang.toUpperCase();
    }

    const toggleBreakdownButton = document.getElementById('toggle-breakdown-button');
    if (toggleBreakdownButton) {
        toggleBreakdownButton.textContent = getTranslation('toggleBreakdownButton');
    }

    const savePricesButton = document.getElementById('save-prices-button');
    if (savePricesButton) {
        const currentText = savePricesButton.textContent;
        const ruSuccess = translations.ru.pricesSavedSuccess;
        const enSuccess = translations.en.pricesSavedSuccess;
        const ukSuccess = translations.uk.pricesSavedSuccess;
        const ruError = translations.ru.pricesSavedError;
        const enError = translations.en.pricesSavedError;
        const ukError = translations.uk.pricesSavedError;

        if (currentText !== ruSuccess && currentText !== ukSuccess && currentText !== enSuccess && currentText !== ruError && currentText !== ukError && currentText !== enError) {
            savePricesButton.textContent = getTranslation('savePricesButton');
        } else {
            savePricesButton.textContent = getTranslation('savePricesButton');
            savePricesButton.classList.remove('success', 'error');
        }
    }

    if (uiFunctions.populateTargetItemSelect) uiFunctions.populateTargetItemSelect();
    if (uiFunctions.populateItemPriceInputs) uiFunctions.populateItemPriceInputs();

    // Update load prices button text
    const loadPricesButton = document.getElementById('load-prices-button');
    if (loadPricesButton) {
        loadPricesButton.textContent = getTranslation('loadPricesButton');
    }

    const totalCostSpan = document.getElementById('total-cost');
    const costPerItemSpan = document.getElementById('cost-per-item');
    const otherLanguages = ['ru', 'uk', 'en'].filter(l => l !== lang);
    const wasCalculating = otherLanguages.some(l => totalCostSpan?.textContent === translations[l]?.calculating) || totalCostSpan?.textContent === translations[lang]?.calculating;
    const wasError = otherLanguages.some(l => totalCostSpan?.textContent === translations[l]?.error) || totalCostSpan?.textContent === translations[lang]?.error;
    const wasZero = totalCostSpan?.textContent === '0.00' || totalCostSpan?.textContent === '0';

    const doUpdateResultDisplay = uiFunctions.updateResultDisplay && typeof uiFunctions.updateResultDisplay === 'function';

    if (totalCostSpan && !wasZero && !wasCalculating && !wasError) {
        triggerRecalculation('language');
    } else {
        if (doUpdateResultDisplay) {
            const currentQuantity = parseInt(document.getElementById('target-quantity')?.value, 10) || 1;
            uiFunctions.updateResultDisplay(0, currentQuantity);
        } else {
            console.error("updateResultDisplay function not provided to setLanguage");
        }
        if (uiFunctions.clearBreakdownDisplay) {
            uiFunctions.clearBreakdownDisplay();
        }
        if (uiFunctions.hideBreakdownContainer) {
            uiFunctions.hideBreakdownContainer();
        }
        const toggleBtn = document.getElementById('toggle-breakdown-button');
        if (toggleBtn) toggleBtn.style.display = 'none';
    }

    try {
        localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
    } catch (error) {
        console.error("Error saving language preference to localStorage:", error);
    }
};

function findFirstTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        return node;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
        let found = findFirstTextNode(node.childNodes[i]);
        if (found) {
            return found;
        }
    }
    return null;
}

export const toggleLanguage = (uiFunctions, triggerRecalculation) => {
    let newLang;
    switch (currentLang) {
        case 'ru':
            newLang = 'uk';
            break;
        case 'uk':
            newLang = 'en';
            break;
        case 'en':
        default:
            newLang = 'ru';
            break;
    }
    setLanguage(newLang, uiFunctions, triggerRecalculation);
};