import API_URL from "@/config/api";

// interface
interface ChangeStatusPayload {
  taskId: string;
  newStatus: string;
  userId: string;
}

// Change task status API
export async function changeTaskStatus(payload: ChangeStatusPayload) {

  try {

    // body
     const body = {
      newStatus: payload.newStatus,
      userId: payload.userId
    };

    const res = await fetch(`${API_URL}/api/tasks/${payload.taskId}/change-status`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to change status");
    }

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