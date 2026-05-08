// ================================================================
// ClickUp Task Model - Mongoose Schema
// ================================================================
// Purpose: Store tasks created by ClickUp agent
// When: After agent successfully creates a task for user
// Relations: References User model via userId

import mongoose, { Schema } from 'mongoose';
import { IClickUpTask } from '../../../types/clickUp_Task.Type';

// clickUp task schema starts from here
const taskSchema: Schema<IClickUpTask> = new Schema ({

    // Basic info
    title: {
        type: String,
        required: [true, 'task tittle is required'],
        trim: true,
        maxlength: [200, 'tittle cannot exceed 200 characters'],
    },

    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'description canot exceed 2000 characters'],
    },

    // Relations
    spaceId: {
        type: mongoose.Types.ObjectId,
        ref: "ClickUpSpace",
        required: [true, "Space ID required"],
        index: true
    },

    projectId: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: [true, "Project ID required"],
        index: true
    },

    taskKey: { type: String, required: true, unique: true },

      // Phase system fields
    phase: {
       type: String,
       enum: ["onboarding", "skills", "real"],
       required: true
    },

    phaseOrder: { type: Number, required: true, min: 1, max: 3 },

   

    // main assignment of users
    assignees: [{
        type: mongoose.Types.ObjectId,
        ref: "ClickUpUser"
    }],

    createdBY: {
         type: mongoose.Types.ObjectId,
         ref: "clickUpSystemUser"
    },

    // startedAt: {
    //     type: Date
    // },

    // status tracking
    status: {
        type: String,
        required: [true, 'task status is required'],
        enum: {
            values: ['to do', 'in progress', 'review', 'completed', 'cancelled'],
            message: 'status must be one of: to do, in progress, review, completed, Rejected'
        },
        
        default: 'to do'
    },

    // Priority
    priority: {
        type: String,
        enum: {
            values: ['low', 'normal', 'high', 'urgent'],
            message: 'priority must be one of: low, normal, high, urgent'
        } 
    },

    // deadline
    dueDate: {
        type: Date,
    },

    // tags
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'tag cannot exceed 50 characters']
    }],

    timeEstimate: {
         type: String,  // Optional string
         default: "Not set"
    },

    timeEntries: [{  // Time tracking entries
         startTime: { type: Date },
         endTime: { type: Date },
         duration: { type: Number, required: true }, // sec
         userId: { type: mongoose.Schema.Types.ObjectId, ref: "ClickUpUser", required: true },
         createdAt: { type: Date, default: Date.now },
     }],

   relationships: [{
        type: String,  // Array of strings
    }],

    attachments: [{  // Array of Objects (multiple files ka data)
        fileName: String,
        filePath: String,
        fileType: String,
        fileSize: Number,

        // user info
        uploadedBy: {
           userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "ClickUpUser"
            },

            name: String,

           },

            uploadedAt: {
               type: Date,
               default: Date.now
            },

             extractedText: {
                type: String,
                default: ""
            }
    }],

    // Subtasks (AI + user dono add kar sakte)
    subTask: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        title: { type: String },
        completed: { type: Boolean, default: false },
        description: { type: String },
      }],

    //  Comments (discussion/chat)
    //  rePath add kar rahe he hum 
    comments: [
      {
        text: { type: String },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "comments.userModel"
        },

         userModel: {  
            type: String,
            enum: ["ClickUpUser", "clickUpSystemUser"],
           required: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
        
      }
    ],

    // Activity Log (VERY IMPORTANT)
    activityLogs: [{
        action: {
          type: String
          // e.g. "task_created", "assigned", "status_changed"
        },

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "activityLogs.performedModel"
          // AI ke case me "system user" use kar sakte ho
        },

        performedModel: {  // Add this
            type: String,
            enum: ['ClickUpUser', 'clickUpSystemUser'],
             required: true
        },

        details: {
          type: String
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }]

}, {
    
    timestamps: true
});


// ends here 

//indexes for performance starts from here
taskSchema.index({assignees: 1, createdAt: -1}); //users tasks by creation date

taskSchema.index({status: 1, dueDate: 1}); // tasks by status and due date

taskSchema.index({createdAt: -1}); // recent task first


// Export task model
export default mongoose.models.clickUpTask || mongoose.model<IClickUpTask>("clickUpTask", taskSchema);