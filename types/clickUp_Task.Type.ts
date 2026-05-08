// ================================
// ClickUp Task Interface
// ================================

import mongoose, { Document, Types } from "mongoose";

// Subtask interface (task ke andar choti tasks)
export interface ISubtask {
  _id: string; 
  title: string;
  completed: boolean;
  description?: string;
}

// Comment interface (discussion ke liye)
export interface IComment {
  text: string;
  userId: Types.ObjectId; // kis ne comment kiya
  createdAt?: Date;
} 

// Activity Log interface (system tracking)
export interface IActivityLog {
  action: string; // e.g. "task_created", "assigned", "status_changed"
  performedBy: Types.ObjectId; // user ya system
  details?: string; // extra info
  createdAt?: Date;
}

// Time Entry interface (time tracking ke liye)
export interface ITimeEntry {
  startTime?: Date;
  endTime?: Date;
  duration: number; // minutes
  userId: Types.ObjectId;
  createdAt: Date;
}

// interface starts from here
export interface IClickUpTask extends Document {
    
    // task information
    title: string;
    description?: string;

    spaceId: Types.ObjectId;
    projectId: Types.ObjectId;

   taskKey: string;          // Unique key for reusable/standard task
   phase: "onboarding" | "Skills" | "real";  // onboarding, practice, real
   phaseOrder: number;        // onboarding=1, practice=2, real=3


    // for multiple users assign or user k ref
    assignees: Types.ObjectId[];

    createdBY?: mongoose.Types.ObjectId;

    status: "to do" | "in progress" | "review" | "completed" | "cancelled";
    priority?: "low" | "normal" | "high" | "urgent";
    
    // timing
    dueDate?: Date;

    // categorization
    tags?: string[];

    // subTasks
    subTask: ISubtask[];

    // comments
    comments: IComment[];

    // activity logs
    activityLogs: IActivityLog[];

    timeEstimate?: string;  // Estimated time (e.g., "2 hours")

    timeEntries: ITimeEntry[];  // Time tracking entries
    
    relationships?: string[];  // Related tasks (e.g., ["Depends on Task 123"])

    attachments?: {  // Array of Objects (multiple files ka data)
          fileName: string;
          filePath: string;
          fileType: string;
          fileSize: number;

          uploadedBy: {

              userId: Types.ObjectId;
              name: string;

          },

          uploadedAt: Date;
          
          extractedText?: string;

        }[];

    // system fields
    createdAt: Date;
    updatedAt: Date;
}

// ends here
