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
}