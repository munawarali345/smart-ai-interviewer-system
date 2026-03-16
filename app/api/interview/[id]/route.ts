import { NextRequest, NextResponse } from "next/server";
import Interview from "@/server/models/interview";
import mongoose from "mongoose";
import { connectDB } from "@/server/lib/db";

// Winston logger - logs requests and errors to file/console
import logger from "@/server/lib/logger";

/**
 * GET /api/interview/[id]
 * Frontend ye API call karta hai jab interview page load hota hai
 * Yeh interview ki details (questions, answers, status) laata hai
 */

export async function GET( req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    // Step 1: Database connect karo
    await connectDB();
    const { id } = await params;

    // Step 2: Validate karo - ID MongoDB ObjectId format me hai?
        if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid interview ID format" },
        { status: 400 }
      );
    }

    // Step 3: Database se interview document find karo
    const interview = await Interview.findById(id);

    // Step 4: Agar interview nahi mila to error return karo
    if (!interview) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 }
      );
    }

    // Step 5: Interview data return karo frontend ko
    return NextResponse.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    // Error log karo aur client ko error message bhejo
    logger.error("Error fetching interview", { error: error instanceof Error ? error.message : error });
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}
