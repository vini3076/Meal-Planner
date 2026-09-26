import { describe, expect, it } from "vitest";
import {
  excludeRecipe,
  filterExcludedRecipes,
  getRecipeExclusionKey,
  includeRecipe,
  isRecipeExcluded,
} from "@/lib/exclusion-service";

describe("recipe exclusion identity", () => {
  it("prefers a Paprika UID when one is available", () => {
    expect(
      getRecipeExclusionKey({ id: 12, paprika_uid: "paprika-123", name: "Pasta" }),
    ).toBe("paprika:paprika-123");
  });

  it("matches recipe names without case or surrounding-space differences", () => {
    const excludedRecipes = [{ name: " Tomato Pasta " }];

    expect(isRecipeExcluded({ name: "tomato pasta" }, excludedRecipes)).toBe(true);
  });
});

describe("excludeRecipe", () => {
  it("adds a recipe without changing the original list", () => {
    const original = [{ name: "Soup" }];
    const result = excludeRecipe(original, { name: "Tacos" });

    expect(result).toEqual([{ name: "Soup" }, { name: "Tacos" }]);
    expect(original).toEqual([{ name: "Soup" }]);
  });

  it("does not add the same recipe twice", () => {
    const original = [{ name: "Tacos" }];

    expect(excludeRecipe(original, { name: "tacos" })).toBe(original);
  });
});

describe("includeRecipe", () => {
  it("removes only the selected recipe from the exclusion list", () => {
    expect(
      includeRecipe([{ name: "Soup" }, { name: "Tacos" }], { name: "Soup" }),
    ).toEqual([{ name: "Tacos" }]);
  });
});

describe("filterExcludedRecipes", () => {
  it("removes exclusions while preserving the ranked order", () => {
    const rankedRecipes = [
      { name: "First" },
      { name: "Second" },
      { name: "Third" },
    ];

    expect(filterExcludedRecipes(rankedRecipes, [{ name: "Second" }])).toEqual([
      { name: "First" },
      { name: "Third" },
    ]);
    expect(rankedRecipes).toHaveLength(3);
  });
});
