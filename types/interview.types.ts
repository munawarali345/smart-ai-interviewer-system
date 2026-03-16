import { Document, ObjectId } from "mongoose";
import { Difficulty } from "./difficulty.types";

/**
 * Single question object
 */
export interface Question {
  questionText: string;   // AI-generated question
  answerText: string;     // Candidate answer
  score: number;          // Score for this answer
  feedback?: string;      // Optional AI feedback
  difficulty: Difficulty; // initioally Question difficulty first question per ai dega
  nextDifficulty: Difficulty; // ye next question k liye he evaluator ai dega
  answeredAt?: Date;      // Optional timestamp of answer
  quality?: "weak" | "average" | "good";
  reason?: string;
}

/**
 * Interview interface
 */
export interface IInterview extends Document {
  candidateId: ObjectId;     // Reference to Candidate
  resumeText: string;
  questions: Question[];     // Questions array
  totalScore: number;        // Aggregate score
  status: "in-progress" | "completed"; // Interview progress
  createdAt: Date;
  updatedAt?: Date;          // Last updated timestamp
  completedAt?: Date;        // Optional interview completion time
}