import { describe, expect, it } from "vitest";
import {
  normalizeIngredientName,
  parseAvailableIngredients,
} from "@/lib/ingredient-normalizer";

describe("normalizeIngredientName", () => {
  it.each([
    ["2 cups Fresh Spinach, chopped", "fresh spinach"],
    ["1 1/2 tbsp olive oil", "olive oil"],
    ["(3) cloves GARLIC", "garlic"],
    ["  Tomatoes   ", "tomatoes"],
  ])("normalizes %s", (ingredient, expected) => {
    expect(normalizeIngredientName(ingredient)).toBe(expected);
  });

  it("returns an empty name when a line only contains a quantity and unit", () => {
    expect(normalizeIngredientName("2 cups")).toBe("");
  });
});

describe("parseAvailableIngredients", () => {
  it("turns non-empty lines into display and normalized ingredient names", () => {
    expect(parseAvailableIngredients("2 Tomatoes\n\n1 cup Spinach\r\n Garlic ")).toEqual([
      { ingredient: "2 Tomatoes", normalizedIngredientName: "tomatoes" },
      { ingredient: "1 cup Spinach", normalizedIngredientName: "spinach" },
      { ingredient: "Garlic", normalizedIngredientName: "garlic" },
    ]);
  });

  it("drops lines that have no ingredient name after normalization", () => {
    expect(parseAvailableIngredients("2 cups\n\n1 tbsp olive oil")).toEqual([
      { ingredient: "1 tbsp olive oil", normalizedIngredientName: "olive oil" },
    ]);
  });
});
