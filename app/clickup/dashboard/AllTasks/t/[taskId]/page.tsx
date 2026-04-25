// task ka dynamic page he yaha se hum taskid se task leke aenge 
// Ye sirf URL detect + taskId extract karti ha
// /t/123 → system samajhta hai "ye task open karna hai"

"use client";

// Next.js hook jo URL se dynamic params nikalta hai
import { useParams } from "next/navigation";
import TaskModal from "@/components/ClickUpComponents/All Tasks/TaskModal";


export default function TaskRoutePage() {

  // =====================================================
  // 1. URL SE TASK ID NIKALNA
  // =====================================================
  // Example URL:
  // /clickup/dashboard/AllTasks/t/123
  //
  //  Next.js automatically [taskId] ko yahan inject karta hai
  // =====================================================
  const params = useParams();

  //  yahan se actual taskId mil rahi hai URL se
  const taskId = params?.taskId as string;

  // =====================================================
  // 3. UI (ABHI EMPTY HAI - KYUN?)
  // =====================================================
  //  kyunki STEP 1 sirf routing test hai
  //  STEP 2 me yahan modal open hoga
  // =====================================================
    return <TaskModal taskId={taskId} />;
}

//  FLOW (AB CLEAR SAMJHO)
// User URL open karta hai:
//    /AllTasks/t/123

// ↓ Next.js route match karta hai

// ↓ [taskId] extract hota hai

// ↓ useParams() returns:
//    taskId = "123"


//  Ye file database se kuch nahi le rahi
//  Ye sirf URL read kar rahi hai

//  ABHI TUMHARA STEP 1 COMPLETE HUA

// ✔ route working
// ✔ taskId readable
// ✔ Next.js dynamic routing OK

//  NEXT STEP (STEP 2)

// Ab hum karenge:

//  TASK CLICK → URL CHANGE
// TaskTable me:
// router.push(/clickup/dashboard/AllTasks/t/${task._id})

//  jisse ClickUp jaisa behavior banega

//  SIMPLE SUMMARY

//  STEP 1 = URL samajhna
//  STEP 2 = click → URL change
//  STEP 3 = modal open

//  AB BATAO

// Agar ye clear hai to bolo:

//  “step 2 start”

// phir main tumhe real ClickUp-style click system bana ke dunga 


