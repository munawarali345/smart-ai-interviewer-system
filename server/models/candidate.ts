// Candidate Model
// Purpose: Resume upload karne wale candidate ka data store karta hai

import mongoose, { Schema } from "mongoose";

// Candidate Schema - Sirf resume data ke liye
const CandidateSchema = new Schema({

  // Resume file ka path (uploads folder me)
  resumeFile: { 
    type: String, 
    required: true 
  },
  
  // Resume se extract kiya hua text (AI ke liye)
  resumeText: { 
    type: String, 
    required: true 
  },

}, { timestamps: true });

// Export Candidate model
export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
