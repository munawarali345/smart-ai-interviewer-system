// ============================================================================
// GET SINGLE TASK API ROUTE
// Purpose: frontend ko ek specific task ka data dena
// URL: /api/tasks/:taskId
// ============================================================================

// populate = reference ID ko actual object me convert karna

// imports 
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/lib/db";
import { getTaskByIdService } from "@/server/services/clickUp.services/clickUp_getTaskById_service";


// main get bu id waa function
export async function GET( req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {

    try {

        // step 1: db connect 
        await connectDB();

        // step 2: URL params se taskId extract/lena 
        // Example: /api/tasks/123 → params.taskId = 123
        const { taskId } =  await params;

        // step 3: validation : taskId required
        if (!taskId) {
            return NextResponse.json(
                {
                error: "taskId is Required"
               },

               {status: 400}

             );
        }

        // step 4: service call: task lao with papulated space/project names with assignees
        // (yahan actual DB + populate ka kaam hoga)
         const task = await getTaskByIdService( taskId );

        // step 5: responce return
        return NextResponse.json(
            {
                success: true,
                data: task // // Full task object with populated fields
            }
        );

    } catch (error: any) {
    
    // Error handling
    console.error("Error in GET /api/tasks/[taskId]:", error);

    return NextResponse.json({

      error: error.message || "Failed to fetch task"

    }, { status: 500 });
    
  }

}


