// get task k liye ha
import { NextRequest, NextResponse } from "next/server";
import { getUserTasks } from "@/server/services/clickUp.services/clickUp_UserTasks";
import { connectDB } from "@/server/lib/db";

// main get function
export async function GET(req: NextRequest) {

    try{

        //  db connect 
        await connectDB;

        // RUL se userId nikal rahe hain
        const userId = req.nextUrl.searchParams.get("userId");

        //  validation
        if(!userId) {
            return NextResponse.json(
                { error : "userId is Required" },
                { status : 400 }
            );
        }

        // service call 
        const tasks = await getUserTasks(userId);

        // yaha se frontend ko responce bej raha he 
        return NextResponse.json({
            success: true,
            data: tasks
            })

    } catch (error: any) {
        return NextResponse.json(
            { error : error.message },
            { status : 500 }
        );
    }
};

// ends here