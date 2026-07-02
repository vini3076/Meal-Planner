import { normalizeIngredientName } from "@/lib/ingredient-normalizer";

function splitRecipeIngredientLines(recipe) {
  const ingredientsText = recipe.ingredients_raw || recipe.ingredients || "";

  return ingredientsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function matchRecipesToIngredients(recipes, availableIngredients) {
  const availableNames = uniqueValues(
    availableIngredients.map((ingredient) => ingredient.normalizedIngredientName),
  );

  return recipes
    .map((recipe) => {
      const ingredientLines = splitRecipeIngredientLines(recipe);
      const normalizedRecipeIngredients = uniqueValues(
        ingredientLines.map((line) => normalizeIngredientName(line)),
      );
      const matchedIngredients = normalizedRecipeIngredients.filter((ingredient) =>
        availableNames.some(
          (availableIngredient) =>
            ingredient === availableIngredient ||
            ingredient.includes(availableIngredient) ||
            availableIngredient.includes(ingredient),
        ),
      );
      const matchCount = matchedIngredients.length;
      const totalIngredientCount = normalizedRecipeIngredients.length;
      const matchPercentage =
        totalIngredientCount > 0 ? matchCount / totalIngredientCount : 0;

      return {
        ...recipe,
        matchedIngredients,
        matchCount,
        matchPercentage,
        totalIngredientCount,
      };
    })
    .sort((firstRecipe, secondRecipe) => {
      if (secondRecipe.matchCount !== firstRecipe.matchCount) {
        return secondRecipe.matchCount - firstRecipe.matchCount;
      }

      if (secondRecipe.matchPercentage !== firstRecipe.matchPercentage) {
        return secondRecipe.matchPercentage - firstRecipe.matchPercentage;
      }

      return firstRecipe.name.localeCompare(secondRecipe.name);
    });
}
