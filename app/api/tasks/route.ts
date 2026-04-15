// get task k liye ha
// is route me hum filter ker k userid se us user k task show karenge  Current user ke workspace ki saari tasks 
import { NextRequest, NextResponse } from "next/server";
import { getUserTasAggregatedData } from "@/server/services/clickUp.services/clickUp_TaskAggregation.service";
import { connectDB } from "@/server/lib/db";


// main get function
export async function GET(req: NextRequest) {

    try{

         // db connects
                await connectDB();

        // URL se userId query param nikalta hai
        const userId = req.nextUrl.searchParams.get("userId");
        
        console.log("🔥 ROUTE USER ID:", userId);
        

        //  validation
        if(!userId) {
            return NextResponse.json(
                { error : "userId is Required" },
                { status : 400 }
            );
        }

        // service call 
        const tasks = await getUserTasAggregatedData(userId);

        console.log("🔥 ROUTE TASKS:", tasks);

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