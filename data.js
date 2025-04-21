import { baseItems } from './base-items.js';
import { componentRecipes } from './component-recipes.js';
import { foodRecipes } from './food-recipes.js';

export const items = {
    ...baseItems,
    ...componentRecipes,
    ...foodRecipes,
};

