
import Task from '@/server/models/clickUp_Models/clickUp_Task';
import logger from "@/server/lib/logger";
import { triggerReviewAgent } from "@/server/lib/triggerReviewAgent/triggerReviewAgent";
// ================================
// SERVICE: jub usr status change karega status update huga activity log update huga 
// ================================

export const changeTaskStatusService = async (
    taskId: string,
    newStatus: string,
    userId: string
 ) => {

   try {
       // 1. Task find karo
       const task = await Task.findById(taskId);

       if (!task) {
         throw new Error("Task not found");
       }

       const oldStatus = task.status;

        // 2. Status update karo
         task.status = newStatus; // yaha se db me status udate hu raha he jo newstatus ara he 

        // 3. Activity log add karo
        task.activityLogs.push({
         action: "status_changed",
         details: `Status changed from ${oldStatus} to ${newStatus}`,
         performedBy: userId,
         performedModel: 'ClickUpUser',
         createdAt: new Date(),
        });

        // 4. Save task
        await task.save();

        // ================================
        // AUTO REVIEW TRIGGER
       // ================================

      //step 5. Agar task review stage me chala gaya
     if (newStatus === "review") {

      // review agent trigger karo
     const reviewResult = await triggerReviewAgent(taskId);

     // log result
     logger.info("Review completed", {
       taskId,
      decision: reviewResult.decision,
      reason: reviewResult.reason,
      feedBack: reviewResult.feedback,
      confidence: reviewResult.confidence,

    });

  // OPTIONAL: yahan next step (main agent) later lagega
   }

        logger.info("Task status updated", {
               taskId,
              oldStatus,
              newStatus,
              userId,
          });

       return task;

    } catch (error: any) {

        logger.error("Error changing task status", {
          message: error.message,
         taskId,
     });
          throw error;
    }
};


// Frontend dropdown change
//         ↓
// API request (taskId, newStatus, userId)
//         ↓
// Task DB se fetch
//         ↓
// status update
//         ↓
// activity log add
//         ↓
// DB save
//         ↓
// updated task return
//         ↓
// frontend UI update