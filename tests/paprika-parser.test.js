import JSZip from "jszip";
import { gzip } from "pako";
import { describe, expect, it } from "vitest";
import { parsePaprikaFile } from "@/lib/paprika-parser";

async function createPaprikaExport(entries, name = "recipes.paprikarecipes") {
  const archive = new JSZip();

  for (const [entryName, contents] of Object.entries(entries)) {
    archive.file(entryName, contents);
  }

  const bytes = await archive.generateAsync({ type: "uint8array" });
  return new File([bytes], name);
}

describe("parsePaprikaFile", () => {
  it("parses uncompressed recipe entries and maps supported fields", async () => {
    const file = await createPaprikaExport({
      "dinner.paprikarecipe": JSON.stringify({
        uid: "recipe-123",
        name: "Tomato Pasta",
        ingredients: "tomatoes\npasta",
        directions: "Cook and serve.",
        categories: ["Dinner", "", 12],
        rating: "4.5",
      }),
      "notes.txt": "This entry should be ignored.",
    });

    await expect(parsePaprikaFile(file)).resolves.toEqual([
      expect.objectContaining({
        paprika_uid: "recipe-123",
        name: "Tomato Pasta",
        ingredients: "tomatoes\npasta",
        directions: "Cook and serve.",
        categories: ["Dinner"],
        rating: 4.5,
      }),
    ]);
  });

  it("parses multiple gzip-compressed Paprika recipe entries", async () => {
    const file = await createPaprikaExport({
      "first.paprikarecipe": gzip(JSON.stringify({ name: "First", ingredients: "rice" })),
      "second.PAPRIKARECIPE": gzip(JSON.stringify({ name: "Second", ingredients: "beans" })),
    });

    const recipes = await parsePaprikaFile(file);

    expect(recipes.map((recipe) => recipe.name)).toEqual(["First", "Second"]);
  });

  it("rejects a file with the wrong extension before opening it", async () => {
    const file = await createPaprikaExport({}, "recipes.zip");

    await expect(parsePaprikaFile(file)).rejects.toThrow(
      "Please choose a file ending in .paprikarecipes.",
    );
  });

  it("rejects an archive that contains no recipe entries", async () => {
    const file = await createPaprikaExport({ "readme.txt": "No recipes here." });

    await expect(parsePaprikaFile(file)).rejects.toThrow(
      "This export did not contain any Paprika recipes.",
    );
  });

  it("rejects recipe JSON that is not an object", async () => {
    const file = await createPaprikaExport({
      "invalid.paprikarecipe": JSON.stringify(["not", "a", "recipe"]),
    });

    await expect(parsePaprikaFile(file)).rejects.toThrow(
      "A recipe inside the export did not contain valid recipe data.",
    );
  });
});
