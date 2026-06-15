"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import RecipeCard from "@/components/RecipeCard";

export default function ImportPage() {
  const [recipes, setRecipes] = useState([]);

  return (
    <main className="page">
      <section className="import-header">
        <p className="eyebrow">Paprika Smart Meal Planner</p>
        <h1>Import your recipes</h1>
        <p>Choose a Paprika `.paprikarecipes` export from your computer.</p>
      </section>

      <FileUpload onRecipesImported={setRecipes} />

      {recipes.length > 0 && (
        <section className="recipe-list" aria-live="polite">
          <h2>
            Imported {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </h2>
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}
