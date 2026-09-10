"use client";

import { useState } from "react";
import Link from "next/link";
import IngredientInput from "@/components/IngredientInput";
import MealPlanCard from "@/components/MealPlanCard";
import RecipeMatchList from "@/components/RecipeMatchList";
import { generateMealPlan } from "@/lib/meal-plan-generator";
import { getRecipes } from "@/lib/recipe-service";
import { matchRecipesToIngredients } from "@/lib/recipe-matcher";

export default function PlanPage() {
  const [ingredients, setIngredients] = useState([]);
  const [matches, setMatches] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
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
      setMealPlan(generateMealPlan(rankedMatches));
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
          {isGenerating ? "Generating your plan..." : "Generate 5-day dinner plan"}
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
              />
            ))}
          </div>

          <details className="match-details">
            <summary>See all ranked recipe matches</summary>
            <RecipeMatchList matches={matches} />
          </details>
        </section>
      )}
    </main>
  );
}
