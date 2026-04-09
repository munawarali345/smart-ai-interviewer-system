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
import projects from '@/server/models/clickUp_Models/clickUIp_Projects'
import ClickUpSpace from "@/server/models/clickUp_Models/clickUp_Space";
import logger from '@/server/lib/logger';
import { generateTask } from '@/server/lib/ai/clickUp.agent';
import {IAgentInput} from "../../../types/clickUp_Agent.type";
import { createSytemUser } from './clickUP_SystemUser';
import { IUser } from "../../../types/clickUp_User.Type"; // Import the IUser interface from the types file




// create task for user ka main function he isko hum user denge jo craete k kia he 
export const createTaskForUser = async (user: IUser) => {

    try{

        // step 1 check karenge k koi task pehle se active to ni he 
        // $in use kia he kun ki hum array me userId dhondh rahe he 
        const existingTask = await Task.findOne({
            assignees: {$in: [user._id]},// ye assignees arry me chaeck karega userId
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

            _id: user._id,
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

        // ye tab kam karega jub same task multiple user ko assisgn huga jese interns ko pahse 1 k tasks
        if (aiTask.reuse) { // agar ai responce me reuse true he to (flag)

           return aiTask.task; //existing task object return 

         };


         // Helper function for existing task: Project aur space relations update karne ke liye 
         const updateRelations = async (task: any, userId) => {

            // Project find karo aur update karo
           const project = await projects.findById(task.projectId);

        if (project) {

            // Task add karo agar nahi hai project model k tasks array me 
        if (!project.tasks.includes(task._id)) 
            project.tasks.push(task._id);
            
            // User add karo agar nahi hai project model k memebers array me 
        if (!project.members.includes(userId)) 
            project.members.push(userId);

             await project.save(); // db me save
         }

         // Space find karo aur update karo
         const space = await ClickUpSpace.findById(task._spaceId);

       if (space && !space.members.includes(userId)) {

         // User add karo
            space.members.push(userId);

               await space.save(); // Save karo
         }
      };

        
        //  task create ker rahe he jo groq agent responce me de raha he db me save ker rahe he 
        const task = await Task.create({
            createdBY: systemUserId,
            title: aiTask.title,
            description: aiTask.description,
            status: "to do",
            priority: aiTask.priority,
            tags: aiTask.tags,
            dueDate: new Date(aiTask.dueDate),
            assignees: [user._id],
            comments: aiTask.initialComment.map(c => ({ ...c, userId: systemUserId, createdAt: new Date() })), // initial comments kisne kia he uski id or date  added
            subTask: aiTask.subTask,
            activityLogs: aiTask.activityLogs.map(log => ({ ...log, performedBy: systemUserId, createdAt: new Date() })),  // createdAt or performedBy added
            spaceId: aiTask.spaceId,
            projectId: aiTask.projectId,
            phase: aiTask.phase,  // Add: AI response se phase lo
            phaseOrder: aiTask.phaseOrder,  // Add: AI response se phaseOrder lo
            taskKey: aiTask.taskKey,  // Add: AI response se taskKey lo

        });

        // task create hune k bad hum task ko or membes array ko project model me update karenge
        // Task ke through uska related project nikaal rahe hain
        // task is project se related he
         await updateRelations(task, user._id); // function call relations update
         

        logger.info('task generated successfully', {taskIs: task._id});
        return task;

    } catch (error: any) {
        logger.error('error creating task', {
            message: error.message,
            stack: error.stack
        });
         
        throw new Error("failed to create task")
    }
};