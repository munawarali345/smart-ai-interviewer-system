// ================================================================
// Space Model - Mongoose Schema
// Purpose: Ye store karta hai department-level spaces MongoDB me
// ================================================================

// imports
import mongoose, {Schema} from "mongoose";
import { ISpace } from "@/types/clickUp_Space.Type"; // space interface

const spaceSchema: Schema<ISpace> = new Schema(
  {
    // Unique name of the space, front-end me dikhaya jaayega
    name: {
      type: String,
      required: [true, "Space name required hai"],
      unique: true,
      trim: true,
      maxlength: [100, "Space name 100 characters se zyada nahi ho sakta"],
    },

    // Department field, logic ke liye, check karenge user belongs karta hai ya nahi
    department: {
      type: String,
      required: [true, "Department required hai"],
      enum: ["engineering", "marketing", "design", "qa", "production", "hr"],
      trim: true,
    },

    // Optional description space ki
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description 500 characters se zyada nahi ho sakta"],
    },

    // Array of projects jo is space me belong karte hain (Project _id references)
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    // Space ke members (department ke users)
    members: [
      {
        type: Schema.Types.ObjectId, 
        ref: "User"
      }
    ]

  },

  {
    timestamps: true, // automatically createdAt aur updatedAt add karega
  }
);

// Indexing performance ke liye: department ya name se search fast ho
spaceSchema.index({ department: 1, name: 1 });
spaceSchema.index({ createdAt: -1 });

// Export model
export default mongoose.models.ClickUpSpace ||
  mongoose.model<ISpace>("ClickUpSpace", spaceSchema);