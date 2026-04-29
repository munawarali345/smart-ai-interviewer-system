// Subtask update ka API helper
// Yeh subtask ko complete/incomplete karne ke liye API call karta hai

import API_URL from "@/config/api";  // base URL

interface UpdateSubtaskPayload {  // payload interface define
  taskId: string;  // task ki ID
  userId: string; //user ki ID
  subTaskId: string;  // subtask ka index array me Specific subtask update karne ke liye index chahiye
  completed: boolean;  // complete status
};

// main fucntion 
export async function updateSubtask( payload: UpdateSubtaskPayload ) {

    try {

        // fetch call
        const res = await fetch(`${API_URL}/api/tasks/${ payload.taskId }/update-subtask`, {

            method: "POST",

            headers: {
                 "Content-Type": "application/json",  // JSON headers
                },

            body: JSON.stringify({  // body me data
                 subTaskId:    payload.subTaskId,  // subTaskId pass
                 completed:    payload.completed,    // status pass
                 userId:       payload.userId,      // userId pass
               }),
        });

            if (!res.ok) {  // agar response ok nahi
                 const error = await res.json();  // error get
                throw new Error(error.message || "Failed to update subtask");  // error throw
              }

         const data = await res.json();  // success data
           return data;  // data return

    } catch (err: unknown) {  // catch block

    if (err instanceof Error) {  // agar error instance

      throw err;  // re-throw

    } else {

      throw new Error("Something went wrong");  // generic error

    }

  };

}