// Save Candidate Service
// Purpose: Candidate ko database me save karta hai

import Candidate from "@/server/models/candidate";
import { connectDB } from "@/server/lib/db";

/**
 * saveCandidateToDB - Candidate document create karta hai
 * @param filePath - Resume file ka path
 * @param resumeText - Resume se extract kiya hua text
 * @returns Saved candidate document
 */
const saveCandidateToDB = async (filePath: string, resumeText: string) => {
  
  // Step 1: Database connect karte hain
  await connectDB();
  

  // Step 2: Candidate document create karte hain
  const candidate = new Candidate({
    resumeFile: filePath,
    resumeText: resumeText,
  });
  
  // Step 3: Database me save karte hain
  const savedCandidate = await candidate.save();
  
  // Step 4: Saved candidate return karte hain
  return savedCandidate;
};

export default saveCandidateToDB;
