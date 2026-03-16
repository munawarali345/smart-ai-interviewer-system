import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose"; 
import { startInterview } from "@/server/services/interview.service";

// Winston logger - logs requests and errors to file/console
import logger from "@/server/lib/logger";

/**
 * POST /api/interview/start
 * Frontend "Start Interview" button click karta hai
 * Yeh naya interview create karta hai AI se question generate karke
 */

export async function POST (req: NextRequest) {

  try{

      // Step 1: Frontend se body se candidateId nikalte hain
      const body = await req.json();
      const candidateId = body.candidateId;
      
      // Step 2: Validation - candidateId required hai?
      if (!candidateId) {
          return NextResponse.json(
              { error: "candidateId is required" },
              { status: 400 }
          );
      }

      // Step 3: Validate karo - candidateId MongoDB ObjectId format me hai?
      if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return NextResponse.json(
              { success: false, message: "Invalid interview ID format" },
              { status: 400 }
            );
      }


       // Step 4: Service call karke interview start karte hain
       const data = await startInterview(candidateId);

       // Step 5: Success log karte hain
       logger.info('Interview started successfully', { candidateId });

     // Step 6: Response return karte hain - interviewId aur pehla question
       return NextResponse.json({
         success: true,
         data,
       });

     } catch (err: unknown) {
       // Error log karo aur client ko error bhejo
       logger.error('Start interview error', { error: err instanceof Error ? err.message : err });
       return NextResponse.json(
          {error: err instanceof Error ? err.message : "Failed to process data"},
          {status: 400}
        );
     }  

}
