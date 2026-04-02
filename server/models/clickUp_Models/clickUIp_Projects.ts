// ================================================================
// Project Model - MongoDB Schema
// ================================================================
// Purpose: Projects ko database me store karne ke liye
// Relation: Ye Space aur Tasks se linked hoga
// ================================================================

// imports
import mongoose, { Schema } from "mongoose";
import { IProject } from "@/types/clickUp_project"; // project interface

const projectSchema: Schema<IProject> = new Schema({

  name: {
    type: String,
    required: [true, "Project name required"],
    trim: true,
    maxLength: [100, "Name cannot exceed 100 characters"]
  },

  description: {
    type: String,
    trim: true,
    maxLength: [1000, "Description cannot exceed 1000 characters"]
  },

  spaceId: {
    type: Schema.Types.ObjectId,
    ref: "ClickUpSpace",
    required: [true, "Space ID required"],
    index: true
  },
  
  status: {
    type: String,
    enum: ["active", "completed", "on hold"],
    default: "active"
  },

  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "clickUpTask"
  }],

  // Optional: Project-specific users
  members: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  }],

}, {
  timestamps: true
});

// Indexes for performance
projectSchema.index({ spaceId: 1, status: 1 }); // quickly filter by space & status
projectSchema.index({ createdAt: -1 });         // recent projects first

// Export model
export default mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);