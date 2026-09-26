"use client";

import { useState } from "react";
import Link from "next/link";
import IngredientInput from "@/components/IngredientInput";
import MealPlanCard from "@/components/MealPlanCard";
import RecipeMatchList from "@/components/RecipeMatchList";
import {
  excludeRecipe,
  filterExcludedRecipes,
  includeRecipe,
} from "@/lib/exclusion-service";
import { generateMealPlan } from "@/lib/meal-plan-generator";
import { getRecipes } from "@/lib/recipe-service";
import { matchRecipesToIngredients } from "@/lib/recipe-matcher";

export default function PlanPage() {
  const [ingredients, setIngredients] = useState([]);
  const [matches, setMatches] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [excludedRecipes, setExcludedRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planError, setPlanError] = useState("");

  function handleIngredientsChange(nextIngredients) {
    setIngredients(nextIngredients);
    setMatches([]);
    setMealPlan([]);
    setPlanError("");
  }

  async function handleGeneratePlan() {
    setIsGenerating(true);
    setPlanError("");
    setMatches([]);
    setMealPlan([]);

    try {
      const recipes = await getRecipes();
      const rankedMatches = matchRecipesToIngredients(recipes, ingredients);

      setMatches(rankedMatches);
      setMealPlan(generateMealPlan(rankedMatches, excludedRecipes));
    } catch (caughtError) {
      setMealPlan([]);
      setPlanError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not generate your dinner plan right now.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function rebuildPlan(nextExcludedRecipes) {
    try {
      setMealPlan(generateMealPlan(matches, nextExcludedRecipes));
      setPlanError("");
    } catch (caughtError) {
      setMealPlan([]);
      setPlanError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not update your dinner plan right now.",
      );
    }
  }

  function handleExcludeRecipe(recipe) {
    const nextExcludedRecipes = excludeRecipe(excludedRecipes, recipe);

    setExcludedRecipes(nextExcludedRecipes);
    rebuildPlan(nextExcludedRecipes);
  }

  function handleIncludeRecipe(recipe) {
    const nextExcludedRecipes = includeRecipe(excludedRecipes, recipe);

    setExcludedRecipes(nextExcludedRecipes);
    rebuildPlan(nextExcludedRecipes);
  }

  const eligibleMatches = filterExcludedRecipes(matches, excludedRecipes);

  return (
    <main className="page">
      <section className="import-header">
        <p className="eyebrow">Meal Plan</p>
        <h1>Plan five dinners from what you have.</h1>
        <p>
          Add the ingredients in your kitchen. We will prioritize the saved recipes that use the
          most of them.
        </p>
      </section>

      <IngredientInput onIngredientsChange={handleIngredientsChange} />

      <section className="plan-actions">
        <button
          className="button"
          type="button"
          onClick={handleGeneratePlan}
          disabled={ingredients.length === 0 || isGenerating}
        >
          {isGenerating
            ? "Generating your plan..."
            : excludedRecipes.length > 0
              ? "Regenerate without excluded recipes"
              : "Generate 5-day dinner plan"}
        </button>
        <p className="file-status">
          {ingredients.length} {ingredients.length === 1 ? "ingredient" : "ingredients"} ready
          for planning.
        </p>
      </section>

      {planError && (
        <section className="plan-error" role="alert">
          <p className="error-message">{planError}</p>
          <Link className="recipe-link" href="/import">
            Import more recipes
          </Link>
        </section>
      )}

      {excludedRecipes.length > 0 && (
        <section className="excluded-recipes" aria-live="polite">
          <div>
            <p className="eyebrow">Current week</p>
            <h2>Not this week</h2>
            <p>
              These recipes will stay out of the plan until you add them back or reload the page.
            </p>
          </div>
          <ul>
            {excludedRecipes.map((recipe) => (
              <li key={recipe.id || recipe.paprika_uid || recipe.name}>
                <span>{recipe.name}</span>
                <button
                  className="include-recipe-button"
                  type="button"
                  onClick={() => handleIncludeRecipe(recipe)}
                >
                  Add back
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mealPlan.length > 0 && (
        <section className="meal-plan-section" aria-live="polite">
          <div className="meal-plan-heading">
            <div>
              <p className="eyebrow">Your week</p>
              <h2>5-day dinner plan</h2>
            </div>
            <p>Five highest-ranked recipes, one dinner per day.</p>
          </div>

          <div className="meal-plan-grid">
            {mealPlan.map((planItem) => (
              <MealPlanCard
                key={`${planItem.dayNumber}-${planItem.recipe.id || planItem.recipe.name}`}
                planItem={planItem}
                onExcludeRecipe={handleExcludeRecipe}
              />
            ))}
          </div>

          <details className="match-details">
            <summary>See all eligible ranked recipe matches</summary>
            <RecipeMatchList matches={eligibleMatches} />
          </details>
        </section>
      )}
    </main>
  );
}
