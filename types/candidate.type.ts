// ================================
// mongoose se Document interface import kar rahe hain
// ================================
import { Document } from "mongoose";

// ================================
// Complete Candidate Interface
// ================================
// Ye interface define karta hai candidate document ki structure
// Har field ka type aur purpose comment me likha hai
export interface ICandidate extends Document {
  
  // ================================
  // RESUME INFO SECTION
  // ================================
  // Uploaded resume file ka path (server pe kahan store hai)
  resumeFile: string;
  
  // Resume se extract kiya gaya pura text
  resumeText: string;

  // ================================
  // TIMESTAMPS (Automatic)
  // ================================
  // mongoose timestamps: true se ye automatic add hote hain
  // Document kab create hua
  createdAt: Date;
  
  // Document kab update hua (optional kyunki first time null ho sakta hai)
  updatedAt?: Date;
}
