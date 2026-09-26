export default function ExcludeRecipeButton({ recipe, onExclude }) {
  return (
    <button
      className="exclude-recipe-button"
      type="button"
      onClick={() => onExclude(recipe)}
      aria-label={`Exclude ${recipe.name} from this week`}
    >
      Not this week
    </button>
  );
}
