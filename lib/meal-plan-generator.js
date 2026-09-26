import {
  filterExcludedRecipes,
  getRecipeExclusionKey,
} from "@/lib/exclusion-service";

export const DINNER_PLAN_LENGTH = 5;

function uniqueRecipes(rankedRecipes) {
  const seenRecipes = new Set();

  return rankedRecipes.filter((recipe, index) => {
    const identity = getRecipeExclusionKey(recipe, index);

    if (seenRecipes.has(identity)) {
      return false;
    }

    seenRecipes.add(identity);
    return true;
  });
}

export function generateMealPlan(rankedRecipes, excludedRecipes = []) {
  if (!Array.isArray(rankedRecipes)) {
    throw new TypeError("Ranked recipes must be provided as a list.");
  }

  const eligibleRecipes = filterExcludedRecipes(rankedRecipes, excludedRecipes);
  const availableRecipes = uniqueRecipes(eligibleRecipes);

  if (availableRecipes.length < DINNER_PLAN_LENGTH) {
    const availabilityMessage =
      excludedRecipes.length > 0
        ? `${availableRecipes.length} remain after exclusions.`
        : `Your library currently has ${availableRecipes.length}.`;

    throw new Error(
      `A 5-day plan needs at least 5 different saved recipes. ${availabilityMessage}`,
    );
  }

  return availableRecipes.slice(0, DINNER_PLAN_LENGTH).map((recipe, index) => ({
    dayNumber: index + 1,
    mealType: "dinner",
    recipe,
  }));
}
