"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";

export default function PlanPage() {
  const [ingredients, setIngredients] = useState([]);
  const [savedIngredients, setSavedIngredients] = useState([]);

  function handleUseIngredients() {
    setSavedIngredients(ingredients);
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
          onClick={handleUseIngredients}
          disabled={ingredients.length === 0}
        >
          Use these ingredients
        </button>
        <p className="file-status">
          {ingredients.length} {ingredients.length === 1 ? "ingredient" : "ingredients"} ready
          for matching.
        </p>
      </section>

      {savedIngredients.length > 0 && (
        <section className="recipe-card">
          <h2>Ingredients ready for Milestone 4</h2>
          <ul className="ingredient-list">
            {savedIngredients.map((item) => (
              <li key={`saved-${item.ingredient}-${item.normalizedIngredientName}`}>
                <span>{item.normalizedIngredientName}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
