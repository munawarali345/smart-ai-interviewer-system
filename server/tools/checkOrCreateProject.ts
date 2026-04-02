// tool call huga is me dekhnge project pehle se space me active he  ya bana huga 

// imports 
import ClickUpProjects from "../models/clickUp_Models/clickUIp_Projects";
import logger from "../lib/logger";

// Tool: Check if project exists in space, else create
export const checkOrCreateProject = async (spaceId: string, projectName: string) => {
    try {
        logger.info(`Checking project "${projectName}" in space: ${spaceId}`);

        // Step 1: Check if project exists in the given space
        let project = await ClickUpProjects.findOne({ spaceId, name: projectName });

        if (!project) {
            // Step 2: Create project if not exists
            project = await ClickUpProjects.create({ 
                name: `Project 1`,       // friendly name
                description: ` project 1 for space `,
                spaceId: spaceId,                           // belongs to this space
                status: 'active',                           // default active
                tasks: [],                                  // initially empty
                members: []                                 // initially empty
             });

            logger.info(`Created new project "${projectName}" in space ${spaceId}`, { projectId: project._id });

        } else {

            logger.info(`Project "${projectName}" already exists in space ${spaceId}`, { projectId: project._id });
        }

        // Step 3: Return project for task creation
        return project

    } catch (error: any) {
        logger.error("Error in checkOrCreateProject", { message: error.message });
        throw new Error(error.message || "Failed to check or create project");
    }
};