const COMMON_UNITS =
  /\b(cups?|tbsp|tablespoons?|tsp|teaspoons?|ounces?|oz|pounds?|lbs?|grams?|g|kg|milliliters?|ml|liters?|l|pinch|cloves?|slices?)\b/g;

export function normalizeIngredientName(ingredient) {
  return ingredient
    .toLowerCase()
    .split(",")[0]
    .replace(/^[\d\s/.,()-]+/, "")
    .replace(COMMON_UNITS, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function parseAvailableIngredients(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((ingredient) => ({
      ingredient,
      normalizedIngredientName: normalizeIngredientName(ingredient),
    }))
    .filter((item) => item.normalizedIngredientName);
}
