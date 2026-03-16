// Resume Service - Main Entry Point
// Purpose: PDF file se text extract karta hai aur database me save karta hai

import extractTextFromFile from "./extractText.service";
import saveCandidateToDB from "./saveCandidate.service";
import logger from "@/server/lib/logger";

/**
 * saveResume - Resume ko save karta hai
 * @param filePath - File ka path (uploads folder me)
 * @returns Saved candidate document
 */
export const saveResume = async (filePath: string) => {
  try {
    // Step 1: PDF file se text extract karte hain
    const resumeText = await extractTextFromFile(filePath);
    
    // Validation - text empty na ho
    if (!resumeText || resumeText.trim().length < 10) {
      throw new Error("Could not extract text from file or file is empty");
    }
    
    // Step 2: Candidate ko database me save karte hain
    const savedCandidate = await saveCandidateToDB(filePath, resumeText);
    
    // Success log karte hain
    logger.info('Resume saved successfully', { candidateId: savedCandidate._id });
    
    // Saved candidate return karte hain
    return savedCandidate;
    
  } catch (error) {
    // Error log karte hain aur throw karte hain
    logger.error('Resume service error', { error: error instanceof Error ? error.message : error });
    throw error;
  }
};
