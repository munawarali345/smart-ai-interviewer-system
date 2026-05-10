// ================================
// ClickUp Agent Input Interface
// ================================
// Purpose: Define structure for data sent to AI agent
// When: When generating tasks for users
// Contains: Only relevant fields for AI decision making
import  { Types } from "mongoose";

export interface IAgentInput {
  _id: Types.ObjectId;
  name: string;
  role: string;
  skills: string[];
  experienceLevel?: string;
  department?: string;
  manager?: string;

   // =====================================
  // progression/task memory context
  // used for next intelligent task generation
  // =====================================
  progressionContext?: {
    totalCompletedTasks: number;
    onboardingCompletedCount: number;
    skillsCompletedCount: number;
    realCompletedCount: number;
    onboardingCompleted: boolean;
    skillsCompleted: boolean;
    currentPhase: string;
    latestCompletedTask: any;
    latestReviewResult: any;
    completedTasksSummary: any[];
  };

}