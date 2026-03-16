// Interview Model
// Purpose: Interview session ka data store karta hai (questions, answers, scores)

import mongoose, { Schema } from "mongoose";
import { IInterview, Question } from "@/types/interview.types";

// Question Schema - har ek question ke liye
const QuestionSchema: Schema<Question> = new Schema({
  // Question ka text
  questionText: { type: String, required: true },
  // Candidate ka answer
  answerText: { type: String, default: "" },
  // Question ki difficulty (easy, medium, hard)
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  // Kab answer diya gaya
  answeredAt: { type: Date },

  // AI evaluation fields
  score: { type: Number, min: 0, max: 10 },             // Numeric score (0-10)
  quality: { type: String, enum: ["good", "average", "weak"] }, // Answer quality
  nextDifficulty: {type: String, enum:["easy","medium","hard"] }, // Next question ki difficulty
  reason: { type: String }  // AI ka feedback/reason
});

// Interview Schema - poore interview session ke liye
const InterviewSchema: Schema<IInterview> = new Schema({
  // Kis candidate ka interview hai
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  // Resume text (AI question generate karne ke liye)
  resumeText: { type: String, required: true },
  // Array of questions
  questions: [QuestionSchema],
  // Total score (sare questions ka)
  totalScore: { type: Number, default: 0 },
  // Interview status (in-progress ya completed)
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
  // Kab interview complete hui
  completedAt: { type: Date },
}, { timestamps: true }); // auto createdAt & updatedAt

// DATABASE INDEXES - For Better Query Performance
// Indexes speed up database queries by creating sorted references

// 1. Find all interviews for a specific candidate
InterviewSchema.index({ candidateId: 1 });

// 2. Filter interviews by status (in-progress or completed)
InterviewSchema.index({ status: 1 });

// 3. Sort interviews by creation date (newest first)
InterviewSchema.index({ createdAt: -1 });

// 4. Combined index for candidate + status queries
InterviewSchema.index({ candidateId: 1, status: 1 });

// 5. Find completed interviews by completion date
InterviewSchema.index({ completedAt: -1 });

export default mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
