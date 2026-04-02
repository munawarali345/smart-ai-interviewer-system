// clickUp user creation route 

// imports
import { NextRequest, NextResponse } from "next/server";
import { createUserSchema } from "@/server/zod_Validations/userValidation";
import { createUser } from "@/server/services/clickUp.services/clickUp.User";
import logger from "@/server/lib/logger";
import { connectDB } from "@/server/lib/db";


// main post function starts from here
export async function POST(req: NextRequest) {

    try{
        
        // db connects
        await connectDB();

        // step 1 frontend se data lao
        const body = await req.json();

        // step 2 zod validation
        const data = await createUserSchema.parse(body);

        // step 3 service call yaha hu rah he (db logic)
        const user = await createUser(data);

        // step 4 return success responce
        return NextResponse.json(
            {
            success: true,
            message: "User created successfylly",
            data: user,
           },

           {status: 201}
       );
         
    } catch (error: any) {
        // step 5 error log
        logger.error("create user api error", {
            message: error.message,
            stack: error.stack
        }); 

        return NextResponse.json(
            {
                success: false,
                message: error.message || "internal server error"
            },

            {status: 500}
        );

    }

}
// ends here