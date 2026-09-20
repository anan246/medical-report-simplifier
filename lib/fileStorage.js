import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload PDF, PNG, or JPG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File too large. Maximum size is 10 MB.");
  }
}

export async function saveFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".pdf";
  const filename = `${uuidv4()}${ext}`;

  const uploadDir = path.join(process.cwd(), "storage", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return {
    filename,
    fileUrl: `/api/reports/files/${filename}`,
    filePath,
  };
}
