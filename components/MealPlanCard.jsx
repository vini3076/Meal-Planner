export default function MealPlanCard({ planItem }) {
  const { dayNumber, mealType, recipe } = planItem;
  const matchedIngredients = recipe.matchedIngredients || [];

  return (
    <article className="meal-plan-card">
      <p className="meal-plan-day">
        Day {dayNumber} <span aria-hidden="true">·</span>{" "}
        <span className="meal-type">{mealType}</span>
      </p>
      <h3>{recipe.name}</h3>
      <p className="meal-plan-score">
        {recipe.matchCount} of {recipe.totalIngredientCount} ingredients matched
        {typeof recipe.matchPercentage === "number" && (
          <span> ({Math.round(recipe.matchPercentage * 100)}%)</span>
        )}
      </p>

      {matchedIngredients.length > 0 ? (
        <ul className="matched-ingredient-list" aria-label="Matched ingredients">
          {matchedIngredients.map((ingredient) => (
            <li key={`${recipe.id || recipe.name}-${ingredient}`}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        <p className="file-status">This dinner does not use an ingredient from your list.</p>
      )}

      {recipe.source_url && (
        <a className="recipe-link meal-plan-link" href={recipe.source_url}>
          View original recipe
        </a>
      )}
    </article>
  );
}
