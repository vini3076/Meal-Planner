export type Recipe = {
  name: string;
  ingredients: string;
  directions: string;
};

// Paprika recipe JSON contains many more fields. Milestone 1 only reads the
// three fields the import page displays.
export type PaprikaRecipe = {
  name?: unknown;
  ingredients?: unknown;
  directions?: unknown;
  [key: string]: unknown;
};
