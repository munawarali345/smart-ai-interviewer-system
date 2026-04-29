// Subtask update ka API route
// Yeh subtask ko complete/incomplete karta hai

// imports
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/lib/db";
import { updateSubtaskService } from "@/server/services/clickUp.services/clickUp_UpdateSubtaskService";

// main POST function
export async function POST(req: NextRequest, { params }: { params: Promise<{taskId: string }> }) {

    try{

         // Step 1: DB connect karo 
          await connectDB();

         // Step 2: URL params se taskId extract karo
          const { taskId } = await params;
        
         // Step 3: Request body se comment aur userId niklne k liye get body
           const body = await req.json();

           const { completed, userId, subTaskId } = body; // body se data nikal/extract kia
           
        // Step 4: Validation - required fields check karo
            if (completed === undefined || !userId) {
                            
                return NextResponse.json(
                            
                { message: "Missing required fields: completed, userId" },
                            
                { status: 400 }
                            
              );
           };

           if (!subTaskId || typeof subTaskId !== "string") {
             return NextResponse.json({ message: "Invalid subTaskId" }, { status: 400 });
           }

        // Step 5: Service call karo
           const updatedTask = await updateSubtaskService(
                taskId,
                userId,
               subTaskId,
               completed
           );
        // Step 6: Success response return karo
            return NextResponse.json({
                 message: "Subtask Updated successfully",
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