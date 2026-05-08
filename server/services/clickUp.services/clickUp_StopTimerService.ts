// Stop timer service
// Yeh timer stop karta hai, duration calculate karta hai, entry update karta hai

import Task from "@/server/models/clickUp_Models/clickUp_Task";  // Task model
import logger from "@/server/lib/logger";  // logging

// Main function
export const stopTimerService = async (taskId: string, userId: string) => {
  try {
    // Step 1: Task find karo
    const task = await Task.findById(taskId);

    // Step 2: Task exist check
    if (!task) {
      throw new Error("Task not found");
    }

    // Step 3: Find active timer for user
    const activeEntryIndex = task.timeEntries.findIndex(
      entry => !entry.endTime && entry.userId.toString() === userId  // endTime null means running
    );

    // Check karo agar timeEntries field missing hai (old tasks ke liye)
      if (!task.timeEntries) {
       task.timeEntries = [];  // empty array set karo
      }

    // Step 4: If no active timer, error
    if (activeEntryIndex === -1) {
      throw new Error("No active timer found for this user");
    }

    // Debug logs
console.log('Looking for userId:', userId);
console.log('Task timeEntries:', task.timeEntries.map(e => ({
  userId: e.userId.toString(),
  endTime: e.endTime,
  hasEndTime: !!e.endTime
})));

    // Step 5: Active entry lao
    const activeEntry = task.timeEntries[activeEntryIndex];

    // Step 6: End time set karo
    const endTime = new Date();

    // Step 7: Duration calculate karo (minutes) end - start = total time spent (ms)
    const duration = Math.floor((

        endTime.getTime()     //current time in milliseconds

        - activeEntry.startTime!.getTime()) / (1000 * 60)); // jab timer start hua tha
        // convert minutes: / (1000 * 60) milliseconds → minutes

    // Step 8: Entry update karo
    activeEntry.endTime = endTime;
    activeEntry.duration = duration;

    // Step 9: Activity log add karo
    task.activityLogs.push({
      action: "timer_stopped",  // action type
      details: `Timer stopped. Duration: ${duration} minutes`,  // details with duration
      performedBy: userId,  // user
      performedModel: "ClickUpUser",  // model
      createdAt: new Date(),  // time
    });

    // Step 10: DB save karo
    await task.save();

    // Step 11: Success log
    logger.info("Timer stopped", { taskId, userId, duration });

    // Step 12: Result return karo
    return { entry: activeEntry, duration };

  } catch (error: any) {
    // Error log
    logger.error("Error stopping timer", { taskId, userId, error: error.message });

    // Error throw
    throw error;
  }
};