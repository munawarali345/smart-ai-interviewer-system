// tool call huga is me dekhnge space pehle se he ya bana huga 

// imports
import ClickUpSpace from "@/server/models/clickUp_Models/clickUp_Space"
import logger from "../lib/logger"

//  main tool  function check if space exists for department ni to create kro ni he to
export const checkOrCreateSpace = async (department: string) => {

    try{

        // log info
        logger.info(` Checking Space for department: ${department}`);

        // step 1: check if space exists
        let space = await ClickUpSpace.findOne({ department });

        // step 2: agar space ni he to create kro
        if (!space) {
            space = await ClickUpSpace.create({
                 name: `${department} Department Space`, // friendly name
                 description: `Space for ${department} department projects`,
                 department: department,
                 projects: [],
                 members: [],
            });

             logger.info(`Created new space for department ${department}`, { spaceId: space._id });

        } else {
            
            logger.info(`Space already exists for department ${department}`, { spaceId: space._id });
        }

        // Step 3: Return space for further project creation
         return space;

    } catch (error: any) {

        logger.error("Error in checkOrCreateSpace", { message: error.message });
        throw new Error(error.message || "Failed to check or create space");
    }
};