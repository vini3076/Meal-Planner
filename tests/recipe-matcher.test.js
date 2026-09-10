import { describe, expect, it } from "vitest";
import { matchRecipesToIngredients } from "@/lib/recipe-matcher";

function availableIngredients(...names) {
  return names.map((name) => ({
    ingredient: name,
    normalizedIngredientName: name,
  }));
}

describe("matchRecipesToIngredients", () => {
  it("calculates matched ingredients and ranks by match count first", () => {
    const recipes = [
      { id: 1, name: "Tomato Pasta", ingredients_raw: "2 tomatoes\npasta\ngarlic\ncheese" },
      { id: 2, name: "Garlic Bread", ingredients_raw: "bread\ngarlic" },
      { id: 3, name: "Green Salad", ingredients_raw: "lettuce\ncucumber" },
    ];

    const matches = matchRecipesToIngredients(
      recipes,
      availableIngredients("tomatoes", "garlic", "pasta"),
    );

    expect(matches.map((recipe) => recipe.name)).toEqual([
      "Tomato Pasta",
      "Garlic Bread",
      "Green Salad",
    ]);
    expect(matches[0]).toMatchObject({
      matchedIngredients: ["tomatoes", "pasta", "garlic"],
      matchCount: 3,
      matchPercentage: 0.75,
      totalIngredientCount: 4,
    });
  });

  it("uses match percentage to break equal-count ties", () => {
    const recipes = [
      { id: 1, name: "Long Recipe", ingredients_raw: "tomato\nrice\nonion\npepper" },
      { id: 2, name: "Short Recipe", ingredients_raw: "tomato\nrice" },
    ];

    const matches = matchRecipesToIngredients(recipes, availableIngredients("tomato"));

    expect(matches.map((recipe) => recipe.name)).toEqual(["Short Recipe", "Long Recipe"]);
    expect(matches.map((recipe) => recipe.matchPercentage)).toEqual([0.5, 0.25]);
  });

  it("uses recipe name as a stable final tie-breaker", () => {
    const recipes = [
      { id: 1, name: "Zucchini Soup", ingredients_raw: "zucchini\nstock" },
      { id: 2, name: "Apple Salad", ingredients_raw: "apple\nlettuce" },
    ];

    const matches = matchRecipesToIngredients(recipes, []);

    expect(matches.map((recipe) => recipe.name)).toEqual(["Apple Salad", "Zucchini Soup"]);
    expect(matches.every((recipe) => recipe.matchCount === 0)).toBe(true);
  });

  it("accepts recipe ingredients from an unsaved imported recipe", () => {
    const [match] = matchRecipesToIngredients(
      [{ name: "Rice Bowl", ingredients: "1 cup rice\n2 carrots" }],
      availableIngredients("rice"),
    );

    expect(match).toMatchObject({
      matchedIngredients: ["rice"],
      matchCount: 1,
      totalIngredientCount: 2,
    });
  });
});
