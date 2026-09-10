export const DINNER_PLAN_LENGTH = 5;

function recipeIdentity(recipe, index) {
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

function uniqueRecipes(rankedRecipes) {
  const seenRecipes = new Set();

  return rankedRecipes.filter((recipe, index) => {
    const identity = recipeIdentity(recipe, index);

    if (seenRecipes.has(identity)) {
      return false;
    }

    seenRecipes.add(identity);
    return true;
  });
}

export function generateMealPlan(rankedRecipes) {
  if (!Array.isArray(rankedRecipes)) {
    throw new TypeError("Ranked recipes must be provided as a list.");
  }

  const availableRecipes = uniqueRecipes(rankedRecipes);

  if (availableRecipes.length < DINNER_PLAN_LENGTH) {
    throw new Error(
      `A 5-day plan needs at least 5 different saved recipes. Your library currently has ${availableRecipes.length}.`,
    );
  }

  return availableRecipes.slice(0, DINNER_PLAN_LENGTH).map((recipe, index) => ({
    dayNumber: index + 1,
    mealType: "dinner",
    recipe,
  }));
}
