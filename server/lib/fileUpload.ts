import path from "path";
import fs from "fs/promises";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveFile(file: File): Promise<string> {

  // 1 File type validation
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF / DOC / DOCX files allowed");
  }

  // 2 File size validation
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  // 3 Upload folder path
  const uploadPath = path.join(process.cwd(), "uploads/resumes");

  // 4 Ensure folder exists
  await fs.mkdir(uploadPath, { recursive: true });

  // 5 Unique file name
  const uniqueName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadPath, uniqueName);

  // 6 Convert to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 7 Save file
  await fs.writeFile(filePath, buffer);

  return filePath;
}