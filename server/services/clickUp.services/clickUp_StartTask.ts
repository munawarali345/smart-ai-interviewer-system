
import Task from '@/server/models/clickUp_Models/clickUp_Task';

// ================================
// SERVICE: Start Task
// PURPOSE: User jab task start kare to status update ho
// ================================

export const startTask = async (taskId: string) => {

    // step 1: find task in DB
    const task = await Task.findById(taskId);

    // step 2: validateion (task exits karta he ya ni)
    if(!task) {
        throw new Error("Task nor Found");
    }

    // step 3: status ko update karo
     task.status = "in progress";
     
    //  step 4: tracking
    task.startedAt = new Date();

    // step 5: save updated task
    await task.save();

    // step 6 return updated task
    return task;

};