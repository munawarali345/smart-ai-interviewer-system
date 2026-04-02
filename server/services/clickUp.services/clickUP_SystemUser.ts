import clickUpSystemUser from "@/server/models/clickUp_Models/clickUp_SystemUser";

// simple global variable for system user
let SYSTEM_USER_ID: string | null = null;

// fuction to create system user if not exits
export const createSytemUser = async () => {

    try{

        // agar id pehel se mojood he to return kardo wai se
        if (SYSTEM_USER_ID) return SYSTEM_USER_ID

        // check in DB if system user already exits
        let systemUser = await clickUpSystemUser.findOne({ role: "system" });

        // agar system user ni he then create kro 
        if(!systemUser) {
            // create system user 
            systemUser = await clickUpSystemUser.create({
                    name: "Task Manager Agent",
                    role: "system"
            });

            console.log("System user created with ID:", systemUser._id);

        } else {

            console.log("system user already exits with ID:", systemUser._id);
        }

        // set global variable for use in other services
        // yaha hu system user ki id ko globle variable me save ker re ha
        SYSTEM_USER_ID = systemUser._id.toString(); 

    //    return system user
    return SYSTEM_USER_ID;

    } catch (error: any) {

        console.error("error creating system user:", error);
        throw error;

    }
}