// ================================================================
// Project Interface - ClickUp Style
// ================================================================
// Purpose: Project ke structure ko define karne ke liye
// Relation: Har Project ek Space me belong karega
// Tasks: Ye projects ke andar tasks assign honge
// ================================================================

import mongoose, { Document, Types } from "mongoose";

// project interface starts from here 
export interface IProject extends Document{

  name: string;                // Project ka naam (required)

  description?: string;        // Optional description, project details

  spaceId: mongoose.Types.ObjectId;   // Link to Space (_id from Space model)

  status?: "active" | "completed" | "on hold"; // Project status

  tasks?: string[];            // Array of task IDs linked to this project

  // Optional members (project-specific team)
  members?: Types.ObjectId[]; 

  createdAt?: Date;            // Auto timestamps
  updatedAt?: Date;

}
// ends here