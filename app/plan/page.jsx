"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import RecipeMatchList from "@/components/RecipeMatchList";
import { getRecipes } from "@/lib/recipe-service";
import { matchRecipesToIngredients } from "@/lib/recipe-matcher";

export default function PlanPage() {
  const [ingredients, setIngredients] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [hasMatched, setHasMatched] = useState(false);

  async function handleFindMatches() {
    setIsMatching(true);
    setMatchError("");
    setHasMatched(false);

    try {
      const recipes = await getRecipes();
      setMatches(matchRecipesToIngredients(recipes, ingredients));
      setHasMatched(true);
    } catch (caughtError) {
      setMatches([]);
      setMatchError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not match recipes right now.",
      );
    } finally {
      setIsMatching(false);
    }
  }

  return (
    <main className="page">
      <section className="import-header">
        <p className="eyebrow">Meal Plan</p>
        <h1>What do you already have?</h1>
        <p>Add the ingredients in your kitchen so the next step can match recipes against them.</p>
      </section>

      <IngredientInput onIngredientsChange={setIngredients} />

      <section className="plan-actions">
        <button
          className="button"
          type="button"
          onClick={handleFindMatches}
          disabled={ingredients.length === 0 || isMatching}
        >
          {isMatching ? "Finding matches..." : "Find matching recipes"}
        </button>
        <p className="file-status">
          {ingredients.length} {ingredients.length === 1 ? "ingredient" : "ingredients"} ready
          for matching.
        </p>
      </section>

      {matchError && <p className="error-message">{matchError}</p>}
      {hasMatched && <RecipeMatchList matches={matches} />}
    </main>
  );
}
