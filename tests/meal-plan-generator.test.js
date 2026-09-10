import { describe, expect, it } from "vitest";
import { DINNER_PLAN_LENGTH, generateMealPlan } from "@/lib/meal-plan-generator";

function rankedRecipe(id, name = `Recipe ${id}`) {
  return {
    id,
    name,
    matchCount: 10 - id,
    matchPercentage: (10 - id) / 10,
    totalIngredientCount: 10,
    matchedIngredients: [`ingredient ${id}`],
  };
}

describe("generateMealPlan", () => {
  it("selects exactly five recipes from the top of the ranked list", () => {
    const rankedRecipes = Array.from({ length: 7 }, (_, index) => rankedRecipe(index + 1));

    const plan = generateMealPlan(rankedRecipes);

    expect(plan).toHaveLength(DINNER_PLAN_LENGTH);
    expect(plan.map((item) => item.recipe.name)).toEqual([
      "Recipe 1",
      "Recipe 2",
      "Recipe 3",
      "Recipe 4",
      "Recipe 5",
    ]);
  });

  it("labels every selection as dinner from Day 1 through Day 5", () => {
    const plan = generateMealPlan(
      Array.from({ length: 5 }, (_, index) => rankedRecipe(index + 1)),
    );

    expect(plan.map(({ dayNumber, mealType }) => ({ dayNumber, mealType }))).toEqual([
      { dayNumber: 1, mealType: "dinner" },
      { dayNumber: 2, mealType: "dinner" },
      { dayNumber: 3, mealType: "dinner" },
      { dayNumber: 4, mealType: "dinner" },
      { dayNumber: 5, mealType: "dinner" },
    ]);
  });

  it("skips duplicate recipes while preserving ranking order", () => {
    const plan = generateMealPlan([
      rankedRecipe(1, "Tomato Pasta"),
      rankedRecipe(2, "tomato pasta"),
      rankedRecipe(3, "Bean Chili"),
      rankedRecipe(4, "Rice Bowl"),
      rankedRecipe(5, "Green Curry"),
      rankedRecipe(6, "Tacos"),
    ]);

    expect(plan.map((item) => item.recipe.name)).toEqual([
      "Tomato Pasta",
      "Bean Chili",
      "Rice Bowl",
      "Green Curry",
      "Tacos",
    ]);
  });

  it("does not mutate the ranked recipe list", () => {
    const rankedRecipes = Array.from({ length: 6 }, (_, index) => rankedRecipe(index + 1));
    const originalOrder = rankedRecipes.map((recipe) => recipe.id);

    generateMealPlan(rankedRecipes);

    expect(rankedRecipes.map((recipe) => recipe.id)).toEqual(originalOrder);
  });

  it("explains when fewer than five different recipes are available", () => {
    expect(() => generateMealPlan([rankedRecipe(1), rankedRecipe(2)])).toThrow(
      "A 5-day plan needs at least 5 different saved recipes. Your library currently has 2.",
    );
  });

  it("rejects input that is not a ranked recipe list", () => {
    expect(() => generateMealPlan(null)).toThrow("Ranked recipes must be provided as a list.");
  });
});
