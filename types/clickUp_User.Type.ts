import { Document } from "mongoose";

// ================================
// mongoose se Document interface import kar rahe hain
// ================================

// clickup user interface
export interface IUser extends Document {
  // Basic Information
  name: string;
  email: string;

    // Professional Information
  role: "developer" | "tester" | "manager" | "designer";
  department:"engineering" | "qa" | "production" | "design" | "hr" | "marketing";
  skills: string[];
  experienceLevel?: "junior" | "mid" | "senior" | "intern";
  manager?: string;
  createdAt: Date;
  updatedAt: Date;
}