"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecipes } from "@/lib/recipe-service";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
      try {
        const savedRecipes = await getRecipes();

        if (isMounted) {
          setRecipes(savedRecipes);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "We could not load your recipe library.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page">
      <section className="import-header">
        <p className="eyebrow">Recipe Library</p>
        <h1>Saved recipes</h1>
        <p>Recipes saved from your Paprika exports appear here.</p>
      </section>

      {isLoading && <p className="file-status">Loading recipes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && recipes.length === 0 && (
        <section className="empty-state">
          <h2>No saved recipes yet</h2>
          <p>Import a Paprika export and save the recipes to build your library.</p>
          <Link className="button" href="/import">
            Import recipes
          </Link>
        </section>
      )}

      {!isLoading && recipes.length > 0 && (
        <section className="recipe-list">
          <h2>
            {recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"}
          </h2>
          {recipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
              <h3>{recipe.name}</h3>
              {recipe.categories?.length > 0 && (
                <p className="recipe-meta">{recipe.categories.join(", ")}</p>
              )}
              {recipe.source_url && (
                <a className="recipe-link" href={recipe.source_url}>
                  Original source
                </a>
              )}
              <section>
                <h4>Ingredients</h4>
                <p className="recipe-text">
                  {recipe.ingredients_raw || "No ingredients provided."}
                </p>
              </section>
              <section>
                <h4>Directions</h4>
                <p className="recipe-text">
                  {recipe.directions || "No directions provided."}
                </p>
              </section>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
