"use client";

import { useState } from "react";
import { parsePaprikaFile } from "@/lib/paprika-parser";

export default function FileUpload({ onRecipesImported }) {
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setError("");
    setIsLoading(true);

    try {
      // The browser reads and parses the export locally. Nothing is uploaded
      // to a server in this MVP.
      const recipes = await parsePaprikaFile(file);
      onRecipesImported(recipes);
    } catch (caughtError) {
      onRecipesImported([]);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not read that Paprika export.",
      );
    } finally {
      setIsLoading(false);
      // Reset the input so the same file can be selected again after an error.
      event.target.value = "";
    }
  }

  return (
    <section className="upload-card">
      <label className="upload-label" htmlFor="paprika-file">
        Choose a Paprika export
      </label>
      <input
        id="paprika-file"
        type="file"
        accept=".paprikarecipes"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <p className="file-status">
        {isLoading
          ? `Reading ${fileName}...`
          : fileName || "No file selected yet."}
      </p>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
