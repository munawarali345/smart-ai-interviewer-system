import { Document } from "mongoose";

// ================================
// mongoose se Document interface import kar rahe hain
// ================================

// role enum
export enum Roles {
  FRONTEND = "frontend",
  BACKEND = "backend",
  FULLSTACK = "fullstack",
  MOBILE = "mobile_developer",
  TESTER = "tester",
  AUTOMATION_TESTER = "automation_tester",
  DESIGNER = "designer",
  CONTENT_CREATOR = "content_creator",
  MARKETING = "marketing",
}

// clickup user interface
export interface IUser extends Document {
  // Basic Information
  name: string;
  email: string;

    // Professional Information
  role: Roles,
  department:"engineering" | "qa" | "production" | "design" | "hr" | "marketing";
  skills: string[];
  experienceLevel?: "junior" | "mid" | "senior" | "intern";
  manager?: string;
  createdAt: Date;
  updatedAt: Date;
}
