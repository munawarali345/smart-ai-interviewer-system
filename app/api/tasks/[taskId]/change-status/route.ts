// task status update route 
// Dynamic route: /api/tasks/[taskId]/chnage-Status
// Purpose: Task ka status change karna aur activity log add karna

// imports
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/lib/db";  // DB connection ke liye
import { changeTaskStatusService } from "@/server/services/clickUp.services/clickUp_changeTaskStatusService";

// main PATCH Route function 
export async function PATCH( req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {

    try {

        // Step 1: DB connect karo (service DB use karta hai)
         await connectDB();

        // Step 2: URL params se taskId extract karo
         const { taskId } = await params;

        // Step 3: Request body se newStatus aur userId lo
         const body = await req.json();

         const {  newStatus, userId } = body;

        // Step 4: Validation - required fields check karo
        if (!newStatus || !userId) {

         return NextResponse.json(

         { message: "Missing required fields: newStatus, userId" },

         { status: 400 }

        );
       }

        // Step 5: Service call karo status update ke liye
         const updatedTask = await changeTaskStatusService(
              taskId,
              newStatus,
              userId
           );

        // Step 6: Success response return karo
         return NextResponse.json({
          message: "Status updated successfully",
          task: updatedTask,
         });

       } catch (error: any) {
    
          console.log("API Error:", error);

         return NextResponse.json(
             { message: error.message || "Internal Server Error" },
             { status: 500 }
        );

     }

}