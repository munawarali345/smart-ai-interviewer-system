// Start timer API route
// Yeh timer start karta hai, new time entry banata hai

import { NextRequest, NextResponse } from "next/server";  // Next.js imports
import { connectDB } from "@/server/lib/db";  // DB connection
import { startTimerService } from "@/server/services/clickUp.services/clickUp_StartTimerService";  // service import

// POST handler for start timer
export async function POST(req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    // DB connect
    await connectDB();

    // URL se taskId extract
    const { taskId } = await params;

    // Request body se userId lao
    const body = await req.json();
    const { userId } = body;

    // Validation: userId required
    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    // Service call karo timer start ke liye
    const result = await startTimerService(taskId, userId);

    // Success response
    return NextResponse.json({ message: "Timer started", entry: result });

  } catch (error: any) {
    // Error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}