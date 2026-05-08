// ==============================================
// ATTACHMENT PROCESSOR SERVICE
// Purpose:
// DB me stored attachments ko read karke
// unka REAL content extract karna (OCR, PDF, DOCX)
// taake AI review agent ko meaningful data mile
// ==============================================


// ================= IMPORTS =================

// File system access (disk se file read karne ke liye)
import fs from "fs/promises";

// DOCX files se text extract karne ke liye
import mammoth from "mammoth";

// File path handling (future use / safety)
import path from "path";


// PDF parser (CommonJS package ko ES module me convert kar rahe hain)
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// PDF file se text extract karne wala library
const PdfParse = require("pdf-parse-fork");


// OCR engine (images se text nikalta hai)
import { exec } from 'child_process';

// ================= TYPES =================

// DB se aane wala basic attachment structure
type Attachment = {
  fileName: string; // file ka name
  filePath: string;  // server me saved path
  fileType: string;  // mime type (image/pdf/docx)
};


// Processed attachment (AI-ready version)
type ProcessedAttachment = Attachment & {
  extractedText: string; // image/pdf/docx se nikla hua text
};


// ======================================================
// TEXT CLEANER (CORE UTIL)
// Purpose:
// raw extracted text ko clean banana (AI-friendly)
// ======================================================
function cleanText(text: string): string {

  return text
    .replace(/\x00/g, "")            // null characters remove
    // .replace(/[^\x20-\x7E\n]/g, "") // weird unicode remove
    .replace(/\r/g, "\n")            // windows line breaks normalize
    .replace(/\n{2,}/g, "\n")        // extra empty lines remove
    .replace(/[ \t]+/g, " ")         // multiple spaces remove
    .replace(/(.)\1{3,}/g, '$1$1')   // repeated chars limit (e.g., KKK -> KK)
    .replace(/^.{0,2}$/gm, '')       // short lines remove (<3 chars)
    .trim();                         // final cleanup
}


// ======================================================
// IMAGE PROCESSOR (OCR) - System Tesseract CLI use kar rahe hain
// Purpose:
// image file se text extract karna using system-installed tesseract
// ======================================================
const extractFromImage = async (filePath: string): Promise<string> => {
  try {
    // Step 1: Output file ka base path banao (extension remove karo)
    // Example: /path/image.png -> /path/image
    const outputBase = filePath.replace(/\.[^/.]+$/, '');
    
    // Step 2: Tesseract command run karo system se
    // Command: tesseract "input.png" "output" -l eng
    await new Promise((resolve, reject) => {

      exec(

         `tesseract "${filePath}" "${outputBase}" -l eng`, 
         
          (error, stdout, stderr) => {

          if (error) {
           // Agar command fail ho, error log karo
           console.error("Tesseract exec error:", error);

           reject(error);

        } else {

          // Stderr log karo agar kuch warning ho
           if (stderr) {
            console.warn("Tesseract stderr:", stderr);
           }

          // Success pe resolve karo
          resolve(stdout);

        }

      });

    });
    
    // Step 3: Tesseract ne jo .txt file banayi hai, usse text read karo
    const outputPath = outputBase + '.txt';

    const text = await fs.readFile(outputPath, 'utf8');
    
    // Step 4: Temp .txt file delete karo (cleanup)
    await fs.unlink(outputPath);
    
    // Step 5: Text clean karo aur return karo
    return cleanText(text);
    
  } catch (err) {
    // Overall error handling
    console.error("OCR Error:", err);

    return "OCR_FAILED";

  }

};


// ======================================================
// PDF PROCESSOR
// Purpose:
// PDF file se raw text extract karna
// ======================================================
const extractFromPDF = async (filePath: string): Promise<string> => {

  // PDF file ko binary buffer me read karte hain
  const buffer = await fs.readFile(filePath);

  // PDF parser se text nikalte hain
  const pdfData = await PdfParse(buffer);

  // clean text return
  return cleanText(pdfData.text);
};


// ======================================================
// DOCX PROCESSOR
// Purpose:
// Word file (.docx) se text extract karna
// ======================================================
const extractFromDocx = async (filePath: string): Promise<string> => {

  // file read (binary buffer)
  const buffer = await fs.readFile(filePath);

  // mammoth library se text extract
  const docxData = await mammoth.extractRawText({ buffer });

  // clean text return
  return cleanText(docxData.value);
};


// ======================================================
// MAIN PROCESSOR (ORCHESTRATOR)
// Purpose:
// Har attachment ko detect karke correct processor call karna
// ======================================================
export const processAttachments = async (
  attachments: Attachment[]
): Promise<ProcessedAttachment[]> => {

  // final output array
  const processed: ProcessedAttachment[] = [];

  // ============================================
  // LOOP: har file ko one-by-one process karna
  // ============================================
  for (const file of attachments) {

    let extractedText = ""; // har file ka result yahan store hoga


    // ================= IMAGE FILE =================
    if (file.fileType.startsWith("image")) {

      extractedText = await extractFromImage(file.filePath);
    }


    // ================= PDF FILE =================
    else if (file.fileType === "application/pdf") {

      extractedText = await extractFromPDF(file.filePath);
    }


    // ================= DOCX FILE =================
    else if (
      file.fileType.includes("wordprocessingml") ||
      file.fileType === "application/msword"
    ) {

      extractedText = await extractFromDocx(file.filePath);
    }


    // ================= UNSUPPORTED FILE =================
    else {

      extractedText = "UNSUPPORTED_FILE_TYPE";
    }


    // ============================================
    // FINAL STEP: file + extracted text merge
    // ============================================
    processed.push({
      ...file,
      extractedText,
    });
  }


  // return final AI-ready attachments
  return processed;
};