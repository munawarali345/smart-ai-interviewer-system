
import Task from '@/server/models/clickUp_Models/clickUp_Task';
import logger from "@/server/lib/logger";
import {IAgentInput} from "../../../types/clickUp_Agent.type";
import { triggerReviewAgent } from "@/server/lib/triggerReviewAgent/triggerReviewAgent";
import { getUserProgressionContextService } from './getUserProgressionContextService';
import { generateTask } from '@/server/lib/ai/clickUp.agent';
import ClickUpSystemUser from "@/server/models/clickUp_Models/clickUp_SystemUser";


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

       
      // System user get karo
      const systemUser = await ClickUpSystemUser.findOne({ role: 'system' });

      if (!systemUser) throw new Error("System user not found");

      const systemUserId = systemUser._id;

      //step 5. Agar task review stage me chala gaya
     if (newStatus === "review") {

      // review agent trigger karo
     const reviewResult = await triggerReviewAgent(taskId);

      // DB mein save
      task.reviewResult = reviewResult;

      // status update
      if (reviewResult.decision === "PASS") {

          task.status = "completed";

          // yaha save isliye take db me completed hu jai status pehle take new task generate kr sake na k reuse task
          await task.save(); 

         // Progression context se essential lo
         const progressionContext = await getUserProgressionContextService(userId);

          // date nikal rahe he Ai ko denge 
          const today = new Date().toISOString().split("T")[0];

         // Progression context se userData banao (bina name, clear context)
         const userData: IAgentInput = {
           _id: progressionContext.user._id,
           name: progressionContext.user.name,
           department: progressionContext.user.department,
           role: progressionContext.user.role,
           skills: progressionContext.user.skills,
           experienceLevel: progressionContext.user.experienceLevel,
           manager: progressionContext.user.manager,

           progressionContext: {  // Full progression context for next task
           totalCompletedTasks: progressionContext.totalCompletedTasks,
           onboardingCompletedCount: progressionContext.onboardingCompletedCount,
           skillsCompletedCount: progressionContext.skillsCompletedCount,
           realCompletedCount: progressionContext.realCompletedCount,
           onboardingCompleted: progressionContext.onboardingCompleted,
           skillsCompleted: progressionContext.skillsCompleted,
           currentPhase: progressionContext.currentPhase,
           latestCompletedTask: progressionContext.latestCompletedTask,
           latestReviewResult: progressionContext.latestReviewResult,
            completedTasksSummary: progressionContext.completedTasksSummary
        }
    };

           // Main agent ko context bhejo next task ke liye
           const nextTask = await generateTask(userData, today);

           // =====================================================
           // REUSABLE TASK CASE
           // If onboarding reusable task returned, agar reusable task mila he,
           // do NOT create new DB task to new task mat banao,
           // =====================================================

           if (nextTask.reuse) {

            logger.info("Existing onboarding task reused", {

               reusedTaskId: nextTask.observation._id,

               assignedTo: userId

             });

            await task.save(); //yaha current task save hu raha he jo user ne complete kia he 

            return task;
          }
 
           // Next task create and save
          //  nextTask create ker rahe he jo  agent responce me de raha he db me save ker rahe he 
             await Task.create({
                  createdBY: systemUserId,
                  title: nextTask.title,
                  description: nextTask.description,
                  status: "to do",
                  priority: nextTask.priority,
                  tags: nextTask.tags,
                  dueDate: new Date(nextTask.dueDate),
                  assignees: [progressionContext.user._id],
                  comments: nextTask.initialComment?.map(c => ({ ...c, userId: systemUserId,  userModel: "clickUpSystemUser", createdAt: new Date() })), // initial comments kisne kia he uski id or date  added
                  subTask: nextTask.subTask,
                  activityLogs: nextTask.activityLogs?.map(log => ({ ...log, performedBy: systemUserId, performedModel: "clickUpSystemUser", createdAt: new Date() })),  // createdAt or performedBy added
                  spaceId: nextTask.spaceId,
                  projectId: nextTask.projectId,
                  phase: nextTask.phase,  // Add: AI response se phase lo
                  phaseOrder: nextTask.phaseOrder,  // Add: AI response se phaseOrder lo
                  taskKey: nextTask.taskKey,  // Add: AI response se taskKey lo
                  timeEstimate: nextTask.timeEstimate,  // Agent se aa raha hai
                  relationships: nextTask.relationships || [],  // Agent se aa raha hai
           
                });

                task.activityLogs.push({
                  action: "review_completed",
                  details: `Review: ${reviewResult.decision} - ${reviewResult.reason}`,
                  performedBy: systemUserId,
                  performedModel: "clickUpSystemUser",
                  createdAt: new Date()
               });

           logger.info("Next task generated", { taskId });


         }  else {

          task.status = "in progress";

          // FAIL ke liye feedback comment aur activity add karo
           task.comments.push({
              text: `Review Feedback: ${reviewResult.feedback}`,
              userId: systemUserId,
              userModel: "clickUpSystemUser",
              createdAt: new Date()
          });

          task.activityLogs.push({
            action: "review_completed",
            details: `Review: ${reviewResult.decision} - ${reviewResult.reason}`,
            performedBy: systemUserId,
            performedModel: "clickUpSystemUser",
            createdAt: new Date()
         });

          logger.info("Task status updated to in progress due to review fail", { taskId, userId });


        }

        // Second save for review and status
        await task.save();
       

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