// Comment add karne ka API helper

import API_URL from "@/config/api";  // base URL

interface AddCommentPayload {
  taskId: string;
  comment: string;
  userId: string;
};

// main Api call function
export async function addComment(payload: AddCommentPayload) {

    try{

        // fetch call
        const res = await fetch(`${API_URL}/api/tasks/${payload.taskId}/add-comments`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                comment: payload.comment,
                userId: payload.userId
            }),

        });

        if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add comment");
     }

     const data = await res.json();
     return data.task; // data returnS

    } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Something went wrong");
    }
  };

}