// Importing Task model from MongoDB schema
import Task from '@/server/models/clickUp_Models/clickUp_Task';
// ================================
// SERVICE: Get User Tasks
// PURPOSE: Fetch all tasks assigned to a specific user
// USED IN: Dashboard (My Tasks page)
// ================================
export const getUserTasks = async (userId: string) => {

    // Step 1: Fetch all tasks from DB where userId matches
    // Reason: Each user has multiple tasks, so we use find() not findById()
    const tasks = await Task.find({ userId })

        // Step 2: Sort tasks by creation date (newest first)
        // -1 means descending order (latest task on top)
        .sort({ createdAt: -1 });

    // Step 3: Return tasks to API route
    return tasks;
};