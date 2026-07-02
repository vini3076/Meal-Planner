export default function RecipeMatchList({ matches }) {
  if (matches.length === 0) {
    return (
      <section className="empty-state">
        <h2>No recipes to match yet</h2>
        <p>Save recipes to your library, then come back to find the best matches.</p>
      </section>
    );
  }

  return (
    <section className="recipe-list" aria-live="polite">
      <h2>Recipe matches</h2>
      {matches.map((recipe) => (
        <article className="recipe-card" key={recipe.id || recipe.name}>
          <div className="match-card-header">
            <h3>{recipe.name}</h3>
            <p className="match-score">
              {recipe.matchCount} of {recipe.totalIngredientCount} matched
            </p>
          </div>
          <p className="recipe-meta">
            {Math.round(recipe.matchPercentage * 100)}% ingredient match
          </p>

          <section>
            <h4>Matched ingredients</h4>
            {recipe.matchedIngredients.length > 0 ? (
              <ul className="matched-ingredient-list">
                {recipe.matchedIngredients.map((ingredient) => (
                  <li key={`${recipe.id || recipe.name}-${ingredient}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="file-status">No available ingredients matched this recipe yet.</p>
            )}
          </section>
        </article>
      ))}
    </section>
  );
}
