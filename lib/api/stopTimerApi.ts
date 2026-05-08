// Stop timer API helper
import API_URL from "@/config/api";  // base URL

interface StopTimerPayload {
  taskId: string;
  userId: string;
}

export async function stopTimer(payload: StopTimerPayload) {
  try {
    // Fetch call
    const res = await fetch(`${API_URL}/api/tasks/${payload.taskId}/stop-Timer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: payload.userId,  // userId send
      }),
    });

    // Error check
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to stop timer");
    }

    // Data return
    const data = await res.json();
    return data;

  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Something went wrong");
    }
  }
}