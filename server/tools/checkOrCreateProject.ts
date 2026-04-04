// tool call huga is me dekhnge project pehle se space me active he  ya bana huga 

// imports 
import ClickUpProjects from "../models/clickUp_Models/clickUIp_Projects";
import logger from "../lib/logger";
import clickUpSpace from "../models/clickUp_Models/clickUp_Space";

// Tool: Check if project exists in space, else create
export const checkOrCreateProject = async (spaceId, projectName: string) => {

          //  GUARD YAHAN LAGAO (TRY se pehle)
        if (!spaceId || !projectName) { // agar  agent ne spaceId or projectId empty beja ya undefine to stop krdo
            logger.error("SpaceId or ProjectId missing in tool input");
            throw new Error("SpaceId or ProjectIdis required");
        }

    try {
        logger.info(`Checking project "${projectName}" in space: ${spaceId}`);

        // Step 1: Check if project exists in the given space
        let project = await ClickUpProjects.findOne({ spaceId, name: projectName });

        if (!project) {
            // Step 2: Create project if not exists
            project = await ClickUpProjects.create({ 
                name: projectName,       // friendly name
                description: ` Project for ${projectName} in space `,
                spaceId: spaceId,                           // belongs to this space
                status: 'active',                           // default active
                tasks: [],                                  // initially empty
                members: []                                 // initially empty
             });

            //  project creaet hu jai to space me uski id ko push kr denge take hum space k project sare get ker sake
            // Hamesha space me push (duplicate avoid)
            const space = await clickUpSpace.findById(spaceId);
            // include check karta hai k project id pehle se space.projects me hai ya nahi.
             if (space && !space.projects.includes(project._id)) {
               space.projects.push(project._id);
                 await space.save();
               }


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