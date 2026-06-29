"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import RecipeCard from "@/components/RecipeCard";
import { saveRecipes } from "@/lib/recipe-service";

export default function ImportPage() {
  const [recipes, setRecipes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  function handleRecipesImported(importedRecipes) {
    setRecipes(importedRecipes);
    setSaveMessage("");
    setSaveError("");
  }

  async function handleSaveRecipes() {
    setIsSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const savedRecipes = await saveRecipes(recipes);
      setSaveMessage(
        `Saved ${savedRecipes.length} ${
          savedRecipes.length === 1 ? "recipe" : "recipes"
        } to your library.`,
      );
    } catch (caughtError) {
      setSaveError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not save those recipes.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="page">
      <section className="import-header">
        <p className="eyebrow">Paprika Smart Meal Planner</p>
        <h1>Import your recipes</h1>
        <p>Choose a Paprika `.paprikarecipes` export from your computer.</p>
      </section>

      <FileUpload onRecipesImported={handleRecipesImported} />

      {recipes.length > 0 && (
        <section className="recipe-list" aria-live="polite">
          <h2>
            Imported {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </h2>
          <div className="save-actions">
            <button className="button" type="button" onClick={handleSaveRecipes} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save to recipe library"}
            </button>
            {saveMessage && <p className="success-message">{saveMessage}</p>}
            {saveError && <p className="error-message">{saveError}</p>}
          </div>
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}
