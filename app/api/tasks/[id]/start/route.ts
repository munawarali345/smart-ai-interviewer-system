import { NextRequest, NextResponse } from "next/server";
import { startTask } from "@/server/services/clickUp.services/clickUp_StartTask";
import mongoose from "mongoose";
import { connectDB } from "@/server/lib/db";


// main start task Api
export async function PATCH(req: NextRequest, {params}: {params: { id: string }}) {

    try {
   
        // step 1: db connect
        await connectDB;

        // step 2: route se task id lo 
        const taskId =  params.id

        // Step 3: Validate karo - ID MongoDB ObjectId format me hai?
           if (!mongoose.Types.ObjectId.isValid(taskId)) {
              return NextResponse.json(
                { success: false, message: "Invalid interview ID format" },
                { status: 400 }
              );
            }

            // step 4: service call karo
            const UpdatedTask = await startTask(taskId);

            // step 5: frontend ko responce bejo
            return NextResponse.json({
                success: true,
                message: "Task Started Successfully",
                data: UpdatedTask
            });

    } catch (error: eny) {

        return NextResponse.json({
            success: false,
            error: error.message
        }, 
          { status: 500 });
   
    }
}