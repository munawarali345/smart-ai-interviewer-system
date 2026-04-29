// Comment add karne ka API route
// Yeh task me comment add karta hai aur activity log bhi

// imports 
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/lib/db";
import { addCommentService } from "@/server/services/clickUp.services/clickUp_addCommentService";


// main POST Route function 
export async function POST( req: NextRequest, {params}: {params: Promise<{ taskId: string }>} ) {

    try {

        // Step 1: DB connect karo 
             await connectDB();
        
            // Step 2: URL params se taskId extract karo
             const { taskId } = await params;
        
            // Step 3: Request body se comment aur userId niklne k liye get body
             const body = await req.json();
        
             const { comment, userId } = body; // body se data nikal/extract kia

            // Step 4: Validation - required fields check karo
             if (!comment || !userId) {
                 
                return NextResponse.json(
                 
                { message: "Missing required fields: comment, userId" },
                 
                   { status: 400 }
                 
                );
            };

            // Step 5: Service call karo status update ke liye
              const updatedTask = await addCommentService(
                     taskId,
                     comment,
                     userId
               );
            
            // Step 6: Success response return karo
                return NextResponse.json({
                  message: "Comments added successfully",
                  task: updatedTask,
                });
                
                 
    }  catch (error: any) {
        
              console.log("API Error:", error);
    
             return NextResponse.json(
                 { message: error.message || "Internal Server Error" },
                 { status: 500 }
            );
    
         }

}