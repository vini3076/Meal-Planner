export type Recipe = {
  paprika_uid?: string;
  name: string;
  ingredients: string;
  directions: string;
  servings?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  source?: string;
  source_url?: string;
  categories?: string[];
  rating?: number;
  image_url?: string;
};

// Paprika recipe JSON contains many more fields. Milestone 1 only reads the
// three fields the import page displays.
export type PaprikaRecipe = {
  uid?: unknown;
  paprika_uid?: unknown;
  name?: unknown;
  ingredients?: unknown;
  directions?: unknown;
  servings?: unknown;
  prep_time?: unknown;
  cook_time?: unknown;
  total_time?: unknown;
  source?: unknown;
  source_url?: unknown;
  categories?: unknown;
  rating?: unknown;
  image_url?: unknown;
  [key: string]: unknown;
};
