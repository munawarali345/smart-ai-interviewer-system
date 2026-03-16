// Extract Text Service
// Purpose: PDF ya DOCX file se text extract karta hai

// File system - file read karne ke liye
import fs from "fs/promises";
// Path handling - file extension find karne ke liye
import path from "path";
// DOCX parsing - Word file se text extract karne ke liye
import mammoth from "mammoth";

// CommonJS interop - pdf-parse-fork ek CommonJS package hai
// Next.js "type: module" use karta hai, isliye require() chahiye
import { createRequire } from "module";

// createRequire() - ES modules me require() jaise import karne ke liye
// pdf-parse-fork CommonJS (old) format me hai, ES modules me direct import nahi hota
const require = createRequire(import.meta.url);

// PDF parsing - pdf-parse-fork package use karta hai
// Yeh package PDF files se text extract karta hai
const PdfParse = require("pdf-parse-fork");

/**
 * cleanResumeText - Extracted text ko clean karta hai
 * @param text - Raw text
 * @returns Cleaned text
 */
function cleanResumeText(text: string) {
    return text
        .replace(/\x00/g, "")            // remove null characters
        .replace(/[^\x20-\x7E\n]/g, "")  // remove weird unicode
        .replace(/\r/g, "\n")            // normalize line breaks
        .replace(/\n{2,}/g, "\n")        // remove extra blank lines
        .replace(/[ \t]+/g, " ")         // normalize spaces
        .trim();
}

/**
 * extractTextFromFile - File se text extract karta hai
 * @param filePath - File ka path
 * @returns Extracted text
 */
const extractTextFromFile = async (filePath: string): Promise<string> => {

    // Step 1: File ka extension nikalte hain (pdf, docx, doc)
    const ext = path.extname(filePath).toLowerCase();

    // Step 2: File ko buffer me read karte hain
    const fileBuffer = await fs.readFile(filePath);

    let resumeTexts = "";

    // Step 3: Extension ke hisab se text extract karte hain
    if (ext === ".pdf"){
          // PDF file se text extract karte hain
          const pdfData = await PdfParse(fileBuffer);
          resumeTexts = pdfData.text;

    } else if (ext === ".docx" || ext === ".doc"){
        // DOCX file se text extract karne ke liye
        const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeTexts = docxData.value;

    } else {
       // Unsupported file type
       throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
    }

    // Step 4: Text clean karte hain
    const resumeText = cleanResumeText(resumeTexts);
  
    // Step 5: Clean text return karte hain
    return resumeText; 
};

export default extractTextFromFile;
