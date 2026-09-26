export function getRecipeExclusionKey(recipe, index = 0) {
  if (recipe.paprika_uid) {
    return `paprika:${recipe.paprika_uid}`;
  }

  if (recipe.name?.trim()) {
    return `name:${recipe.name.trim().toLowerCase()}`;
  }

  if (recipe.id !== undefined && recipe.id !== null) {
    return `id:${recipe.id}`;
  }

  return `position:${index}`;
}

export function isRecipeExcluded(recipe, excludedRecipes) {
  const recipeKey = getRecipeExclusionKey(recipe);

  return excludedRecipes.some(
    (excludedRecipe) => getRecipeExclusionKey(excludedRecipe) === recipeKey,
  );
}

export function excludeRecipe(excludedRecipes, recipe) {
  if (isRecipeExcluded(recipe, excludedRecipes)) {
    return excludedRecipes;
  }

  return [...excludedRecipes, recipe];
}

export function includeRecipe(excludedRecipes, recipe) {
  const recipeKey = getRecipeExclusionKey(recipe);

  return excludedRecipes.filter(
    (excludedRecipe) => getRecipeExclusionKey(excludedRecipe) !== recipeKey,
  );
}

export function filterExcludedRecipes(rankedRecipes, excludedRecipes = []) {
  const excludedKeys = new Set(
    excludedRecipes.map((recipe) => getRecipeExclusionKey(recipe)),
  );

  return rankedRecipes.filter(
    (recipe, index) => !excludedKeys.has(getRecipeExclusionKey(recipe, index)),
  );
}
