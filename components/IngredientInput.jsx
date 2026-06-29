"use client";

import { useMemo, useState } from "react";
import { parseAvailableIngredients } from "@/lib/ingredient-normalizer";

export default function IngredientInput({ onIngredientsChange }) {
  const [ingredientText, setIngredientText] = useState("");

  const ingredients = useMemo(
    () => parseAvailableIngredients(ingredientText),
    [ingredientText],
  );

  function handleIngredientTextChange(event) {
    const nextText = event.target.value;
    const nextIngredients = parseAvailableIngredients(nextText);

    setIngredientText(nextText);
    onIngredientsChange(nextIngredients);
  }

  return (
    <section className="ingredient-input-card">
      <label className="form-label" htmlFor="available-ingredients">
        Available ingredients
      </label>
      <textarea
        id="available-ingredients"
        className="ingredient-textarea"
        value={ingredientText}
        onChange={handleIngredientTextChange}
        placeholder={"spinach\nrice\ntomatoes\nyogurt"}
        rows={8}
      />

      <section className="normalized-preview" aria-live="polite">
        <h2>Normalized ingredients</h2>
        {ingredients.length === 0 ? (
          <p className="file-status">Add one ingredient per line.</p>
        ) : (
          <ul className="ingredient-list">
            {ingredients.map((item) => (
              <li key={`${item.ingredient}-${item.normalizedIngredientName}`}>
                <span>{item.normalizedIngredientName}</span>
                {item.ingredient !== item.normalizedIngredientName && (
                  <small>from {item.ingredient}</small>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
