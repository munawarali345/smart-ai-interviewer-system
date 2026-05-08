// Start timer service
// Yeh timer start karta hai, check karta hai already running, entry banata hai

import Task from "@/server/models/clickUp_Models/clickUp_Task";  // Task model
import logger from "@/server/lib/logger";  // logging

// Main function
export const startTimerService = async (taskId: string, userId: string) => {
  try {
    // Step 1: Task find karo
    const task = await Task.findById(taskId);

    // Step 2: Task exist check
    if (!task) {
      throw new Error("Task not found");
    }

    // Step 3: ye code check kar raha hai ki is user ka koi active (running) timer already chal raha hai ya nahi
    const activeEntry = task.timeEntries.find( //array se search
      (entry) => //each record
           entry.userId?.toString() === userId && // correct user
           entry.endTime === null // still running
       );

       // Check karo agar timeEntries field missing hai (old tasks ke liye)
         if (!task.timeEntries) {
             task.timeEntries = [];  // empty array set karo
            }

    // Step 4: If running, error
    if (activeEntry) {
      throw new Error("Timer already running for this user");
    }

    // Step 5: New time entry create karo
    const newEntry = {
      startTime: new Date(),  // current time
      duration: 0,  // initial 0
      userId: userId,  // user ID
      createdAt: new Date(),  // creation time
    };

    // Step 6: Entry ko task.timeEntries me add karo
    task.timeEntries.push(newEntry);

    // Step 7: Activity log add karo
    task.activityLogs.push({
      action: "timer_started",  // action type
      details: "Timer started for task",  // details
      performedBy: userId,  // user
      performedModel: "ClickUpUser",  // model
      createdAt: new Date(),  // time
    });

    // Step 8: DB save karo
    await task.save();

    // Step 9: Success log
    logger.info("Timer started", { taskId, userId });

    // Step 10: New entry return karo
    return newEntry;

  } catch (error: any) {
    // Error log
    logger.error("Error starting timer", { taskId, userId, error: error.message });

    // Error throw
    throw error;
  }
};