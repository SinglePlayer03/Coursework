import { getTranslation } from './i18n.js';

export const getItemName = (item, itemId, currentLang) => {
    if (!item) return `Unknown (${itemId})`;

    let name = '';
    if (currentLang === 'en') {
        name = item.name_en;
    } else if (currentLang === 'uk') {
        name = item.name_uk;
    } else {
        name = item.name_ru;
    }

    return name || item.name_ru || item.name_uk || item.name_en || `Unknown (${itemId})`;
};

export const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (!isFinite(num)) return getTranslation('error') || 'Error';
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

