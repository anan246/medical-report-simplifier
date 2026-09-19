import { readFile } from "fs/promises";
import pdfParse from "pdf-parse";

export async function extractTextFromFile(filePath, mimeType) {
  const buffer = await readFile(filePath);

  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();
    if (!text) {
      throw new Error("Could not extract text from PDF. The file may be image-based.");
    }
    return text;
  }

  if (mimeType.startsWith("image/")) {
    return `[IMAGE_FILE: ${filePath}]`;
  }

  throw new Error("Unsupported file type for text extraction");
}
