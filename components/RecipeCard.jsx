export default function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <h3>{recipe.name}</h3>

      <section>
        <h4>Ingredients</h4>
        <p className="recipe-text">{recipe.ingredients || "No ingredients provided."}</p>
      </section>

      <section>
        <h4>Directions</h4>
        <p className="recipe-text">{recipe.directions || "No directions provided."}</p>
      </section>
    </article>
  );
}
