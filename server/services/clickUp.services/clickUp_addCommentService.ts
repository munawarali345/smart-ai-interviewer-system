//  Comment add karne ka service 
// yaha hum comment ko dbme ass kar rah he as an user 
//  usr j comment krega yaha se db me save huga 
// or activity feeds me b 

// imports 
import Task from "@/server/models/clickUp_Models/clickUp_Task";
import logger from "@/server/lib/logger";

// main function
export const addCommentService = async (
    taskId: string,
    comment: string,
    userId: string,

) => {

    try {

        // step 1 : find task
        const task = await Task.findById(taskId);

        if (!task) {
            throw new Error("Task not found")
        };

        // step 2: add/push comment to db 
        task.comments.push({
            text: comment,
            userId: userId,
            userModel: "ClickUpUser",
            createdAt: new Date()
        });

        // 3. Activity log add karo
        task.activityLogs.push({
         action: "comment_added",
         details: `Comment added: ${comment}`,  // short details
         performedBy: userId,
         performedModel: 'ClickUpUser',
         createdAt: new Date(),
        }); 

        // step 4: db me save
        await task.save();

        logger.info("Comment added", {
               taskId,
               comment,
               userId,
          });

        return task;  // updated task return

    }  catch (error: any) {

    logger.error("Error adding comment", 
        {
         message: error.message,
         taskId, userId 
        });

    throw error;
  }

};
