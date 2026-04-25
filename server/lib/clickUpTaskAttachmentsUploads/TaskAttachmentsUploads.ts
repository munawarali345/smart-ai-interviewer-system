// yaha hum FS system se attachmenst jo aengi unko server folder me save karenge then unko db me save

// imports 
import path from "path";
import fs from "fs/promises"

// ======================================================
// Allowed file types
// Sirf ye file formats upload honge
// ======================================================
const allowedTypes = [
  // images
  "image/png",          // for PNG image
  "image/jpeg",        // for JPEG image
  "image/jpg",        // for JPG image
  "image/webp",      // for WEBP image

  // docs
  "application/pdf", // for PDF file
  "application/zip", // for zip file
  "application/x-zip-compressed", // for zip file
  "application/msword",   // for msword/docx file
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docs
];


// ======================================================
// Max file size = 20MB per file
// ======================================================
const MAX_FILE_SIZE = 20 * 1024 * 1024;


// ======================================================
// Return type for each saved file
// is me Batata hain har saved file ka data kaisa hoga.
// type bana di ha (blueprint)
// “Har file ka data is shape me hoga”
// ======================================================
type SavedFile = {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
};

// ======================================================
// Main Function
// files = frontend se aayi multiple files
// taskId = jis task ki attachments hain
// ======================================================
export async function saveAttachments( 
    files: File[], 
    taskId: string 
  ): Promise<SavedFile[]> {


    // ====================================================
  // Step 1: Empty files check
  // ====================================================
  if (!files || files.length === 0) {
    throw new Error("No files received");
  }

  // ====================================================
  // Step 2: Task wise folder path
  // Example:
  // /server/uploads/tasks/123/file.png
  // ====================================================
  const uploadPath = path.join(
    process.cwd(),
    "server",
    "uploads",
    "tasks",
    taskId
  );

  // ====================================================
  // Step 3: Ensure folder exists
  // Agar folder nahi hai to create kar do
  // ====================================================
  await fs.mkdir(uploadPath, { recursive: true });

   // Step 4: Final saved files array
  // Isme har uploaded file ka data push hoga
  // Yahan har saved file ka metadata store hoga.
  // "uploaded files ka record book"
  // ====================================================
  const savedFiles: SavedFile[] = [];

  // ====================================================
  // Step 5: Loop through all files
  // Har file ko validate + save karenge
  // ====================================================
  for (const file of files) {

    // --------------------------------------------------
    // File type validation
    // --------------------------------------------------
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.name}`);
    }


    // --------------------------------------------------
    // File size validation
    // --------------------------------------------------
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${file.name} exceeds 5MB limit`);
    }


    // --------------------------------------------------
    // Unique file name
    // Same name files overwrite na hon
    // --------------------------------------------------
    const uniqueName = `${Date.now()}-${file.name}`;


    // --------------------------------------------------
    // Full save path
    // Example: server/uploads/tasks/123/17123-design.png
    // --------------------------------------------------
    const filePath = path.join(uploadPath, uniqueName);


    // --------------------------------------------------
    // Browser file -> Buffer
    // Browser file ko binary data me convert kar rahe ho.
    // Disk pe save karne ke liye
    // Node.js ko save karne ke liye buffer chahiye.
    // --------------------------------------------------
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    // --------------------------------------------------
    // Save file in folder
    // Ab file hard disk me save ho gayi.
    // --------------------------------------------------
    await fs.writeFile(filePath, buffer);


    // --------------------------------------------------
    // Save metadata in array
    // DB me later store karenge
    // Har file ka info result array me add.
    // --------------------------------------------------
    savedFiles.push({
      fileName: uniqueName,
      filePath,
      fileSize: file.size,
      fileType: file.type,
    });
  }


  // ====================================================
  // Step 6: Return all saved files data
  // metadata array (final result)
  // yaha per file ni jaa rahi he just uski details return ker raha he 
  // ====================================================
  return savedFiles;

};


// Frontend
//   ↓
// User selects files
//   ↓
// API Route (/api/task-attachments)
//   ↓
// saveAttachments()
//   ↓
// STEP 1: validation (type + size)
//   ↓
// STEP 2: folder create (server/uploads/tasks/taskId)
//   ↓
// STEP 3: each file process
//         - convert to buffer
//         - save in disk
//         - create metadata object
//         - push in savedFiles[]
//   ↓
// STEP 4: return savedFiles[]
//   ↓
// Route receives array
//   ↓
// DB update:
// Task.attachments = $push + $each savedFiles