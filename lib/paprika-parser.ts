import JSZip from "jszip";
import { ungzip } from "pako";
import type { PaprikaRecipe, Recipe } from "@/types/recipe";

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const strings = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );

  return strings.length > 0 ? strings : undefined;
}

function toRecipe(value: PaprikaRecipe): Recipe {
  return {
    paprika_uid: optionalString(value.uid) || optionalString(value.paprika_uid),
    name: typeof value.name === "string" && value.name ? value.name : "Untitled recipe",
    ingredients: typeof value.ingredients === "string" ? value.ingredients : "",
    directions: typeof value.directions === "string" ? value.directions : "",
    servings: optionalString(value.servings),
    prep_time: optionalString(value.prep_time),
    cook_time: optionalString(value.cook_time),
    total_time: optionalString(value.total_time),
    source: optionalString(value.source),
    source_url: optionalString(value.source_url),
    categories: optionalStringArray(value.categories),
    rating: optionalNumber(value.rating),
    image_url: optionalString(value.image_url),
  };
}

function parseRecipeBytes(bytes: Uint8Array): Recipe {
  let jsonText: string;

  try {
    // A Paprika export is a ZIP archive. Each recipe inside it is normally
    // another gzip-compressed file containing JSON.
    jsonText = ungzip(bytes, { to: "string" });
  } catch {
    // This fallback also accepts uncompressed JSON recipe entries, which is
    // useful for simple test exports and makes the parser more forgiving.
    jsonText = new TextDecoder().decode(bytes);
  }

  const parsed: unknown = JSON.parse(jsonText);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("A recipe inside the export did not contain valid recipe data.");
  }

  return toRecipe(parsed as PaprikaRecipe);
}

export async function parsePaprikaFile(file: File): Promise<Recipe[]> {
  if (!file.name.toLowerCase().endsWith(".paprikarecipes")) {
    throw new Error("Please choose a file ending in .paprikarecipes.");
  }

  // JSZip opens the outer Paprika archive and gives us every recipe entry.
  const archive = await JSZip.loadAsync(await file.arrayBuffer());
  const recipeEntries = Object.values(archive.files).filter(
    (entry) => !entry.dir && entry.name.toLowerCase().endsWith(".paprikarecipe"),
  );

  if (recipeEntries.length === 0) {
    throw new Error("This export did not contain any Paprika recipes.");
  }

  const recipes = await Promise.all(
    recipeEntries.map(async (entry) => {
      const bytes = await entry.async("uint8array");
      return parseRecipeBytes(bytes);
    }),
  );

  return recipes;
}
