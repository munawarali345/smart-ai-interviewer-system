// Stop timer API route
// Yeh timer stop karta hai, duration calculate karta hai

import { NextRequest, NextResponse } from "next/server";  // Next.js imports
import { connectDB } from "@/server/lib/db";  // DB connection
import { stopTimerService } from "@/server/services/clickUp.services/clickUp_StopTimerService";  // service import

// POST handler for stop timer
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

    // Service call karo timer stop ke liye
    const result = await stopTimerService(taskId, userId);

    // Success response
    return NextResponse.json({ message: "Timer stopped", ...result }); // ... result isliye kun ki multiple data retrun hu raha he entries and duration

  } catch (error: any) {
    // Error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}