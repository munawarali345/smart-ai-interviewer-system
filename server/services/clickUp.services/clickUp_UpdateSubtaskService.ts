// Subtask update ka service
// Yeh subtask ko complete/incomplete karta hai aur activity log add karta hai

import Task from "@/server/models/clickUp_Models/clickUp_Task";  // Task model import
import logger from "@/server/lib/logger";  // logger import
import mongoose from "mongoose";

// main function
export const updateSubtaskService = async (  // main function
  taskId: string,          // task ID parameter
  userId: string,         //  user ID parameter
  subTaskId: string,     // subtask ID parameter
  completed: boolean,   // completed status parameter
) => {

    try { // try block for error handling

       // step 1: task find karo DB se
       const task = await Task.findById(taskId);

       // step 2: task exist check karo k task he ya ni
       if (!task) {

          throw new Error("Task not found");

        };


       // Subtask find karo _id se
       const subtask = task.subTask.find(
          (s: any) => s._id.toString() === subTaskId
         );


        if (!subtask) {  // check kro subtask he ya ni
          throw new Error("Subtask not found");
        }

        // Step 5: Subtask status update karo
         subtask.completed = completed;

       // Step 6: Activity log add karo
        task.activityLogs.push({
          action: "subtask_updated",
           details: `Subtask "${subtask.title}" ${completed ? "completed" : "marked pending"}`,
           performedBy: userId,
           performedModel: "ClickUpUser",
           createdAt: new Date(),
         });

        // Step 7: DB me save karo (ye actual update karta hai DB me)
         await task.save();

         logger.info("Subtask updated", {
            taskId,
            subTaskId,
            completed,
            userId,
         });

         return task; 

    }  catch (error: any) {  // catch block
    // error log karo
    logger.error("Error updating subtask", {
      message: error.message,  // error message
      taskId,  // context
      subTaskId,
      userId,
    });
    // error re-throw karo
    throw error;
  }

}

// task find
//    ↓
// subTask.find(_id match)
//    ↓
// completed update
//    ↓
// activity log push
//    ↓
// save()