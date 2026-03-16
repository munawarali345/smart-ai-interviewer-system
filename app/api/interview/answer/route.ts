import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { submitAnswer } from "@/server/services/submitAnswer";

/**
 * POST /api/interview/answer
 * Frontend user ka answer bhejta hai jab wo question ka answer deta hai
 * Yeh answer database me save karta hai aur next question generate karta hai
 */

export async function POST(req: NextRequest) {

    try{

        // Step 1: Frontend se body me interviewId aur answer nikalte hain
        const body = await req.json();
        const {interviewId, answer} = body;

        // Step 2: Validation - dono fields required hain
        if(!interviewId || !answer) {
            return NextResponse.json(
                { error: "interviewId and answer are required"},
                {status: 400},
            );
        }

        // Step 3: Validate karo - interviewId MongoDB ObjectId format me hai?
        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return NextResponse.json(
                { success: false, message: "Invalid interview ID format" },
                { status: 400 }
            );
        }

        // Step 4: Service call - answer save karo aur next question lo
        const result = await submitAnswer( interviewId, answer );

        // Step 5: Result return karo (next question ya interview completed)
        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error) {
        // Error return karo
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error" },
            { status: 500 }
        );
    } 

}
