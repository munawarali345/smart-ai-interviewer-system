// Review Agent Payload Interface
// Yeh structure define karta hai ke review AI ko kya data milega

export interface ReviewAgentPayload {

  // ================= BASIC TASK INFO =================
  taskId: string;  // Current task ID
  title: string;  // Task title
  description: string;  // Task description

  // ================= PROJECT CONTEXT =================
  // AI ko user ka learning/project context dene ke liye
  projectId?: string;  // Related project ID
  spaceId?: string;  // Related workspace/space ID
  phase?: string;  // Current learning/project phase
  phaseOrder?: number;  // Phase order for progression tracking

  // ================= TASK STATUS INFO =================
  status?: string;  // Current task status
  priority?: string;  // Task priority
  dueDate?: Date;  // Deadline

  // ================= USER WORK =================
  // User ne task pe kya work kiya
  subtasks: {
    _id: string;
    title: string;
    completed: boolean;
    description?: string;
  }[];

  // Uploaded proof files/screenshots
  attachments: [];

  // User comments/discussion
  comments: {
    text: string;
    createdAt: Date;
  }[];

  // ================= TIME TRACKING =================
  // AI realistic effort analyze kar sakta hai
  timeEntries: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
  }[];

  timeEstimate?: string;  // Expected task completion time

  // ================= EXTRA CONTEXT =================
  tags?: string[];  // Labels/categories
  relationships?: string[];  // Related tasks/features

  // ================= ACTIVITY HISTORY =================
  // Previous user/task actions
  activityLogs: {
    action: string;
    details?: string;
    createdAt: Date;
  }[];
}


// Review Agent Response Interface
// AI review result ka standard response structure

export interface ReviewAgentResponse {

  // Final AI decision
  decision: "PASS" | "FAIL";

  // Short technical reason
  reason: string;

  // Missing cheezein jo user ko fix karni hain
  missingItems: string[];

  // Human-style feedback
  feedback: string;

  // AI confidence score
  confidence: number;
}