// Review agent trigger service
// Yeh service task ka complete data collect karti hai
// Aur review AI service ko bhejti hai

import Task from "@/server/models/clickUp_Models/clickUp_Task";
import { reviewTaskWithAI } from "../ai/clickUp.ReviewAgent";

// Function: Review agent trigger
export const triggerReviewAgent = async (taskId: string) => {

  // Step 1: Database se task fetch karo
  const task = await Task.findById(taskId);

  // Step 2: Check karo task mila ya nahi
  if (!task) {
    throw new Error("Task not found");
  }

  // Step 3: AI review ke liye structured payload banao
  // Yahan hum task ki sari important information AI ko denge
  const reviewPayload = {

    // ================= BASIC TASK INFO =================
    taskId: task._id.toString(),
    title: task.title,
    description: task.description,

    // ================= PROJECT CONTEXT =================
    // AI ko pata hona chahiye user kis project aur phase me hai
    projectId: task.projectId?.toString(),
    spaceId: task.spaceId?.toString(),
    phase: task.phase,
    phaseOrder: task.phaseOrder,

    // ================= TASK STATUS INFO =================
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,

    // ================= USER WORK =================
    // User ne kya complete kiya
    subtasks: task.subTask,
    attachments: task.attachments,
    comments: task.comments,

    // ================= TIME TRACKING =================
    // AI realistic work check kar sakta hai
    timeEntries: task.timeEntries,
    timeEstimate: task.timeEstimate,

    // ================= EXTRA CONTEXT =================
    tags: task.tags,
    relationships: task.relationships,

    // ================= ACTIVITY HISTORY =================
    // Previous actions aur logs
    activityLogs: task.activityLogs,
  };

  // Step 4: Review AI service call karo
  // Yeh AI decision return karega
  const reviewResult = await reviewTaskWithAI(reviewPayload);

  // Step 5: Result return karo
  return reviewResult;
};