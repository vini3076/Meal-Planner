import { supabase } from "@/lib/supabase-client";

function splitIngredientLines(ingredients) {
  return ingredients
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeIngredientName(line) {
  return line
    .toLowerCase()
    .replace(/^[\d\s/.,()-]+/, "")
    .replace(
      /\b(cups?|tbsp|tablespoons?|tsp|teaspoons?|ounces?|oz|pounds?|lbs?|grams?|g|kg|ml|liters?|l)\b/g,
      "",
    )
    .split(",")[0]
    .trim()
    .replace(/\s+/g, " ");
}

function toRecipeRow(recipe) {
  return {
    paprika_uid: recipe.paprika_uid || null,
    name: recipe.name,
    ingredients_raw: recipe.ingredients || null,
    directions: recipe.directions || null,
    servings: recipe.servings || null,
    prep_time: recipe.prep_time || null,
    cook_time: recipe.cook_time || null,
    total_time: recipe.total_time || null,
    source: recipe.source || null,
    source_url: recipe.source_url || null,
    categories: recipe.categories || null,
    rating: recipe.rating ?? null,
    image_url: recipe.image_url || null,
  };
}

export async function saveRecipes(recipes) {
  const savedRecipes = [];

  for (const recipe of recipes) {
    const { data: savedRecipe, error: recipeError } = await supabase
      .from("recipes")
      .insert(toRecipeRow(recipe))
      .select()
      .single();

    if (recipeError) {
      throw new Error(recipeError.message);
    }

    const ingredientRows = splitIngredientLines(recipe.ingredients || "").map((line) => ({
      recipe_id: savedRecipe.id,
      raw_ingredient_line: line,
      normalized_ingredient_name: normalizeIngredientName(line),
    }));

    if (ingredientRows.length > 0) {
      const { error: ingredientError } = await supabase
        .from("recipe_ingredients")
        .insert(ingredientRows);

      if (ingredientError) {
        throw new Error(ingredientError.message);
      }
    }

    savedRecipes.push(savedRecipe);
  }

  return savedRecipes;
}

export async function getRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, name, ingredients_raw, directions, source_url, categories, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
