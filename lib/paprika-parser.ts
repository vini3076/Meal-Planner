import JSZip from "jszip";
import { ungzip } from "pako";
import type { PaprikaRecipe, Recipe } from "@/types/recipe";

function toRecipe(value: PaprikaRecipe): Recipe {
  return {
    name: typeof value.name === "string" && value.name ? value.name : "Untitled recipe",
    ingredients: typeof value.ingredients === "string" ? value.ingredients : "",
    directions: typeof value.directions === "string" ? value.directions : "",
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
