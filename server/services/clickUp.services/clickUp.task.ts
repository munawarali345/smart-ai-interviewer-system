// clickup task service 

// Get current date in YYYY-MM-DD format for AI usage
// Step 1: new Date() → current date & time
// Step 2: toISOString() → convert to standard format (YYYY-MM-DDTHH:mm:ssZ)
// Step 3: split("T") → separate date and time
// Step 4: [0] → take only date part (YYYY-MM-DD)
// This ensures AI gets a clean date to correctly calculate dueDate
// const today = new Date().toISOString().split("T")[0];

// imports
import Task from '@/server/models/clickUp_Models/clickUp_Task';
import logger from '@/server/lib/logger';
import { generateTask } from '@/server/lib/ai/clickUp.agent';
import {IAgentInput} from "../../../types/clickUp_Agent.type";
import { createSytemUser } from './clickUP_SystemUser';
import { IUser } from "../../../types/clickUp_User.Type"; // Import the IUser interface from the types file

import { checkOrCreateSpace } from '@/server/tools/checkOrCreateSpace';
import { checkOrCreateProject } from '@/server/tools/checkOrCreateProject';

// create task for user ka main function he isko hum user denge jo craete k kia he 
export const createTaskForUser = async (user: IUser) => {

    try{

        // step 1 check karenge k koi task pehle se active to ni he 
        const existingTask = await Task.findOne({
            userId: user._id,
            // wo task lao jinka status completed nahi he 
            status: {$ne: "completed"} // $ne ye mongodb ka opertator he means not equal to
        });

        // if task already exist then stop
        if(existingTask) {
            logger.info("user already has active task", {
                userId: user._id,
                taskId: existingTask._id
            });

            return existingTask; // yaha stop hu jaiga 
        };

        // date nikal rahe he Ai ko denge 
        const today = new Date().toISOString().split("T")[0];

        // prepare Ai input user me se jo needed fields he wai nikal ker ai ko denge
        const userData: IAgentInput = {
            name: user.name,
            role: user.role,
            skills: user.skills,
            experienceLevel: user.experienceLevel,
            department: user.department,
            manager: user.manager
        };
 
        // step 2 generating AI task for user
        logger.info("generating AI Task For User", {userId: user._id});

        // clickUp Ai Agent call
        const aiTask = await generateTask(userData, today);

        // ai responce k bad system user service call hugi system user create huga waha se system user ki id hame milegi 
        const systemUserId = await createSytemUser()

        // ------------------------ INSERT HERE ------------------------
       // Ensure Space exists for user.department
        const space = await checkOrCreateSpace(user.department);

     // Ensure Project exists in that Space
        const project = await checkOrCreateProject(space.id, `${user.department} Project`);
// ------------------------ INSERT END ------------------------

        //  task create ker rahe he jo groq agent responce me de raha he db me save ker rahe he 
        const task = await Task.create({
            createdBY: systemUserId,
            title: aiTask.title,
            description: aiTask.description,
            status: "to do",
            priority: aiTask.priority,
            tags: aiTask.tags,
            dueDate: aiTask.dueDate,
            assignees: [user._id],
            comments: aiTask.comments,
            subTask: aiTask.subTask,
            activityLogs: aiTask.activityLogs,
            SpaceId: space._id,
            projectId: project._id
        
        });

        logger.info('task generated successfully', {taskIs: task._id});
        return task;

    } catch (error: any) {
        logger.error('error creating task', {
            message: error.message,
            stack: error.stack
        });
         
        throw new Error("field to create task")
    }
};