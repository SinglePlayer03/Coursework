import { items } from './data.js';
import { getTranslation, getCurrentLang } from './i18n.js';
import { getItemName } from './utils.js';

const MAX_DEPTH = 20;

export const calculateCost = (itemId, quantity, prices, visited = new Set(), depth = 0, forceCraft = false) => {
    const item = items[itemId];
    const currentLang = getCurrentLang();
    const itemName = item ? getItemName(item, itemId, currentLang) : `Unknown (${itemId})`;
    const itemNameRu = item?.name_ru || `Unknown (${itemId})`;
    const itemNameUk = item?.name_uk || itemNameRu;
    const itemNameEn = item?.name_en || itemNameRu;

    if (!item) {
        console.error(`Item not found: ${itemId}`);
        const errorMsg = getTranslation('dataLoadError');
        return {
            totalCost: Infinity, costPerUnit: Infinity, calculatedCostPerUnit: null,
            breakdown: {
                itemId: itemId,
                name_ru: itemNameRu,
                name_uk: itemNameUk,
                name_en: itemNameEn,
                quantity: quantity,
                cost: Infinity,
                costPerUnit: Infinity,
                calculatedCostPerUnit: null,
                isBase: true,
                error: errorMsg,
                isError: true
            }
        };
    }

    if (quantity <= 0) {
        return { totalCost: 0, costPerUnit: 0, calculatedCostPerUnit: null, breakdown: {} };
    }

    if (depth > MAX_DEPTH) {
        console.error(`Max recursion depth (${MAX_DEPTH}) exceeded for ${itemId}. Possible deep craft or cycle.`);
        const errorMsg = getTranslation('infiniteCalcError');
        return {
            totalCost: Infinity, costPerUnit: Infinity, calculatedCostPerUnit: Infinity,
            breakdown: {
                itemId: itemId,
                name_ru: itemNameRu,
                name_uk: itemNameUk,
                name_en: itemNameEn,
                quantity: quantity,
                cost: Infinity,
                costPerUnit: Infinity,
                calculatedCostPerUnit: Infinity,
                isBase: true,
                error: errorMsg,
                isError: true
            }
        };
    }

    if (!item.craftable) {
        const userPrice = prices[itemId];
        if (userPrice !== undefined && typeof userPrice === 'number' && isFinite(userPrice) && userPrice > 0) {
            const totalCost = userPrice * quantity;
            const costPerUnit = userPrice;
            return {
                totalCost, costPerUnit, calculatedCostPerUnit: null,
                breakdown: {
                    itemId: itemId,
                    name_ru: itemNameRu,
                    name_uk: itemNameUk,
                    name_en: itemNameEn,
                    quantity: quantity,
                    cost: totalCost,
                    costPerUnit: costPerUnit,
                    calculatedCostPerUnit: null,
                    isBase: true
                }
            };
        } else {
            const errorMsg = getTranslation('missingBasePriceError', { itemName: itemName });
            console.error(`Missing or invalid price for non-craftable item: ${itemId} ('${itemName}'). Price must be > 0. Provided: ${userPrice}`);
            return {
                totalCost: Infinity, costPerUnit: Infinity, calculatedCostPerUnit: null,
                breakdown: {
                    itemId: itemId,
                    name_ru: itemNameRu,
                    name_uk: itemNameUk,
                    name_en: itemNameEn,
                    quantity: quantity,
                    cost: Infinity,
                    costPerUnit: Infinity,
                    calculatedCostPerUnit: null,
                    isBase: true,
                    error: errorMsg,
                    isError: true
                }
            };
        }
    }

    // --- Cycle Detection ---
    if (visited.has(itemId)) {
        console.warn(`Circular dependency detected for item: ${itemId}. Calculation stopped for this path.`);
        const errorMsg = getTranslation('infiniteCalcError');
        // Return Infinity cost and mark as error in breakdown
        return {
            totalCost: Infinity, costPerUnit: Infinity, calculatedCostPerUnit: Infinity,
            breakdown: {
                itemId: itemId,
                name_ru: itemNameRu,
                name_uk: itemNameUk,
                name_en: itemNameEn,
                quantity: quantity,
                cost: Infinity,
                costPerUnit: Infinity,
                calculatedCostPerUnit: Infinity,
                isBase: true,
                error: errorMsg,
                isError: true
            }
        };
    }

    // --- Craftable Item Calculation ---
    visited.add(itemId); // Add current item to the path

    const craftYield = item.yield || 1;
    const energyCostPerCraft = item.energyCost || 0;
    // **Strict Check** for energy price
    const energyItemId = 'энергия';
    const energyItem = items[energyItemId];
    const energyItemName = energyItem ? getItemName(energyItem, energyItemId, currentLang) : `Unknown (${energyItemId})`;
    let energyPrice = Infinity; // Default to Infinity to ensure error if not set
    let energyCalculationError = true; // Assume error initially
    let energyErrorMsg = getTranslation('missingBasePriceError', { itemName: energyItemName }); // Default error message

    // Check if user provided a valid, positive price for energy
    if (prices[energyItemId] !== undefined && typeof prices[energyItemId] === 'number' && isFinite(prices[energyItemId]) && prices[energyItemId] > 0) {
        energyPrice = prices[energyItemId];
        energyCalculationError = false; // Price is valid, clear error
        energyErrorMsg = null;
    } else {
        // Error if user price is missing/invalid/zero for Energy - Log the specific reason
        console.error(`Missing or invalid price for required resource: Energy ('${energyItemName}'). Price must be > 0. Provided: ${prices[energyItemId]}`);
        // Keep energyPrice as Infinity, energyCalculationError as true, and use the default energyErrorMsg
    }

    const craftsNeeded = Math.ceil(quantity / craftYield);
    const actualYield = craftsNeeded * craftYield;

    let ingredientsTotalCost = 0;
    let ingredientsBreakdown = {};
    let calculationError = energyCalculationError; // Start with energy error state
    let accumulatedErrorMsg = energyErrorMsg; // Accumulate specific error messages

    if (item.ingredients && item.ingredients.length > 0) {
        for (const ingredient of item.ingredients) {
            const ingredientId = ingredient.itemId;
            const ingredientItem = items[ingredientId];
            const ingredientItemName = ingredientItem ? getItemName(ingredientItem, ingredientId, currentLang) : `Unknown (${ingredientId || 'unknown'})`;

            if (!ingredientId || !ingredientItem) {
                const errorMsg = getTranslation('dataLoadError'); // Generic error
                console.error(`Invalid or missing ingredient ID '${ingredientId || 'unknown'}' found in recipe for ${itemId} (${itemName})`);
                const unknownNameRu = ingredientItem?.name_ru || `Неизвестный (${ingredientId || 'unknown'})`;
                const unknownNameUk = ingredientItem?.name_uk || `Невідомий (${ingredientId || 'unknown'})`;
                const unknownNameEn = ingredientItem?.name_en || `Unknown (${ingredientId || 'unknown'})`;
                ingredientsBreakdown[ingredientId || 'unknown'] = {
                    itemId: ingredientId || 'unknown',
                    name_ru: unknownNameRu,
                    name_uk: unknownNameUk,
                    name_en: unknownNameEn,
                    quantity: (ingredient.quantity || 0) * craftsNeeded,
                    cost: Infinity,
                    costPerUnit: Infinity,
                    calculatedCostPerUnit: null,
                    isBase: true,
                    error: errorMsg,
                    isError: true
                };
                calculationError = true; // Mark error for the parent item
                if (!accumulatedErrorMsg) accumulatedErrorMsg = errorMsg;
                ingredientsTotalCost = Infinity; // Ensure parent cost reflects error
                continue; // Skip this invalid ingredient but mark parent as errored
            }

            const neededIngredientQuantity = ingredient.quantity * craftsNeeded;
            const ingredientResult = calculateCost(
                ingredientId,
                neededIngredientQuantity,
                prices,
                new Set(visited),
                depth + 1,
                false // ALWAYS calculate ingredients without forcing craft initially
            );

            // Aggregate costs and check for errors from the recursive call
            // Check breakdown.isError as well as cost
            if (ingredientResult.breakdown?.isError || !isFinite(ingredientResult.totalCost) || isNaN(ingredientResult.totalCost)) {
                const errorMsg = ingredientResult.breakdown?.error || getTranslation('error'); // Use specific error if available
                console.error(`Error calculating cost for ingredient ${ingredientId} ('${ingredientItemName}') of ${itemId} ('${itemName}'): ${errorMsg}`);
                calculationError = true; // Mark error for the parent item
                if (!accumulatedErrorMsg) accumulatedErrorMsg = errorMsg; // Store the first error encountered
                // Store the error state in the ingredient breakdown
                ingredientsBreakdown[ingredientId] = { ...ingredientResult.breakdown, cost: Infinity, costPerUnit: Infinity, error: errorMsg, isError: true };
                // If calculation fails, use Infinity for total cost aggregation
                ingredientsTotalCost = Infinity;
            } else {
                ingredientsBreakdown[ingredientId] = ingredientResult.breakdown;
                // Only add cost if the ingredient calculation didn't error out previously and parent is not already errored
                if (!calculationError) {
                    ingredientsTotalCost += ingredientResult.totalCost;
                }
            }
        }
    } else if (item.craftable) { // Only warn if it's supposed to be craftable
        console.warn(`Craftable item ${itemId} ('${itemName}') has no ingredients defined.`);
        // Treat as having 0 ingredient cost, but energy cost might still apply
        ingredientsTotalCost = 0;
    }

    visited.delete(itemId); // Remove current item from the path before returning

    // Calculate the total cost purely based on crafting components + energy
    const totalEnergyCost = (energyCostPerCraft * craftsNeeded * energyPrice); // energyPrice might be Infinity
    let calculatedTotalCraftCost = Infinity;
    let calculatedCostPerUnit = Infinity;

    // Calculate raw craft cost per unit ONLY if sub-calculations were successful (including energy price)
    if (!calculationError && isFinite(ingredientsTotalCost) && isFinite(totalEnergyCost)) {
        calculatedTotalCraftCost = ingredientsTotalCost + totalEnergyCost;
        calculatedCostPerUnit = (actualYield > 0) ? (calculatedTotalCraftCost / actualYield) : 0;
        // Handle potential division by zero or negative yield gracefully
        if (!isFinite(calculatedCostPerUnit) || calculatedCostPerUnit < 0) {
            console.warn(`Invalid calculated cost per unit for ${itemId}: ${calculatedCostPerUnit}. Setting to Infinity.`);
            calculatedCostPerUnit = Infinity;
            calculationError = true; // Mark as calculation error state
            if (!accumulatedErrorMsg) accumulatedErrorMsg = getTranslation('infiniteCalcError');
        }
    } else {
        // If there was an error in ingredients or energy, propagate the error state
        calculationError = true;
        calculatedTotalCraftCost = Infinity;
        calculatedCostPerUnit = Infinity;
        // Make sure accumulatedErrorMsg has a value
        if (!accumulatedErrorMsg) accumulatedErrorMsg = getTranslation('error');
    }

    // --- Determine Final Cost (Respecting Override Price only if cheaper, unless forceCraft) ---
    const overridePrice = prices[itemId];
    let finalTotalCost = Infinity; // Default to infinity in case of error
    let finalCostPerUnit = Infinity;
    let usedOverridePrice = false;
    let finalIsBase = true; // Assume base/error initially

    if (calculationError) {
        // If any error occurred during calculation (missing price, cycle, depth, energy, ingredient), result is error
        finalCostPerUnit = Infinity;
        finalTotalCost = Infinity;
        usedOverridePrice = false;
        finalIsBase = true;
    } else if (forceCraft) {
        // If forcing craft and no errors, always use the calculated cost
        finalCostPerUnit = calculatedCostPerUnit;
        finalTotalCost = finalCostPerUnit * quantity;
        usedOverridePrice = false;
        finalIsBase = false; // Successfully crafted
    } else {
        // Not forcing craft, no calculation errors - compare override price with calculated cost
        const isValidOverride = overridePrice !== undefined && typeof overridePrice === 'number' && isFinite(overridePrice) && overridePrice > 0;

        if (isValidOverride && overridePrice < calculatedCostPerUnit) {
            // Use override price ONLY if it's provided, valid (>0), and CHEAPER than crafting
            finalCostPerUnit = overridePrice;
            finalTotalCost = finalCostPerUnit * quantity;
            usedOverridePrice = true;
            finalIsBase = true; // Using an override price means it acts like a base item
        } else {
            // Use calculated cost if override is absent, invalid, 0, or >= calculated cost
            finalCostPerUnit = calculatedCostPerUnit;
            finalTotalCost = finalCostPerUnit * quantity;
            usedOverridePrice = false;
            finalIsBase = false; // Using calculated cost
        }
    }

    // Final safety check for NaN/Infinity in final cost
    if (!isFinite(finalTotalCost) || isNaN(finalTotalCost)) {
        finalTotalCost = Infinity;
        finalCostPerUnit = Infinity;
        calculationError = true; // Mark as error state if not already
        if (!accumulatedErrorMsg) accumulatedErrorMsg = getTranslation('infiniteCalcError');
        finalIsBase = true; // Treat as base on final error
    }

    // --- Construct Breakdown ---
    const breakdown = {
        itemId: itemId,
        name_ru: itemNameRu,
        name_uk: itemNameUk,
        name_en: itemNameEn,
        quantity: quantity,
        cost: finalTotalCost, // Final cost based on the logic
        costPerUnit: finalCostPerUnit, // Final cost per unit based on the logic
        calculatedCostPerUnit: item.craftable ? calculatedCostPerUnit : null, // Store the purely calculated cost per unit if craftable
        isBase: finalIsBase, // Updated isBase based on final decision/error
        isError: calculationError, // Set the error flag
        error: calculationError ? accumulatedErrorMsg : null, // Use the specific error message accumulated
        craftDetails: item.craftable && !calculationError && !usedOverridePrice ? { // Only include if craftable, no error, AND craft cost was used
            craftsNeeded,
            actualYield,
            totalCraftCost: calculatedTotalCraftCost, // Store the *raw* craft cost details
            ingredientsCost: ingredientsTotalCost,
            energyCost: totalEnergyCost
        } : null,
        ingredients: ingredientsBreakdown // Include regardless of parent error to show where sub-errors occurred
    };

    return {
        totalCost: finalTotalCost,
        costPerUnit: finalCostPerUnit,
        calculatedCostPerUnit: item.craftable ? calculatedCostPerUnit : null, // Return calculated cost per unit separately
        breakdown
    };
};