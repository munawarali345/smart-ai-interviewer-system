import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/server/lib/fileUpload";
import { saveResume } from "@/server/services/resumeParser/resume.service";

// Winston logger - logs requests and errors to file/console
import logger from "@/server/lib/logger";

/**
 * POST /api/resume
 * Frontend resume upload karta hai (PDF file)
 * Yeh file save karta hai aur database me candidate record create karta hai
 */

export async function POST(req: NextRequest) {
  try {
    // Step 1: Frontend se form data me file nikalte hain
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    // Step 2: Validation - file required hai
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Step 3: File ko server storage me save karte hain
    const filePath = await saveFile(file);

    // Step 4: Resume ko database me save karte hain
    const candidate = await saveResume(filePath);

    // Step 5: Success log karte hain
    logger.info('Resume uploaded successfully', { candidateId: candidate._id });

    // Step 6: Candidate ID return karte hain frontend ko
    return NextResponse.json(
      {
        success: true,
        message: "Resume uploaded successfully",
        candidate: {
          id: candidate._id,
          resumeFile: candidate.resumeFile,
        },
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Error log karo aur client ko error bhejo
    logger.error('Resume upload error', { error: error instanceof Error ? error.message : error });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process resume" },
      { status: 500 }
    );
  }
}
