// Start timer API helper
import API_URL from "@/config/api";  // base URL

interface StartTimerPayload {
  taskId: string;
  userId: string;
}

export async function startTimer(payload: StartTimerPayload) {
  try {
    // Fetch call
    const res = await fetch(`${API_URL}/api/tasks/${payload.taskId}/start-Timer`, {
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
      throw new Error(error.message || "Failed to start timer");
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