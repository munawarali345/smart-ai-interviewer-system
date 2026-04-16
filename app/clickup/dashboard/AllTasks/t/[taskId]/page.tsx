// task ka dynamic page he yaha se hum taskid se task leke aenge 
// Ye sirf URL detect + taskId extract karti ha
// /t/123 → system samajhta hai "ye task open karna hai"

"use client";

// Next.js hook jo URL se dynamic params nikalta hai
import { useParams } from "next/navigation";

import { useEffect } from "react";

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
  const taskId = params?.taskId;

  // =====================================================
  // 2. DEBUG / FLOW CHECK (SAMJHNE KE LIYE)
  // =====================================================
  useEffect(() => {

    //  agar taskId mil gayi hai to console me print karo
    if (taskId) {
      console.log("🔵 Task ID from URL:", taskId);

      // -----------------------------------------------------
      //  YE VALUE KAHAN SE AA RAHI HAI?
      // -----------------------------------------------------
      //  URL se aa rahi hai:
      // /AllTasks/t/123
      //
      //  Next.js route system isko parse karta hai
      // -----------------------------------------------------
    }

  }, [taskId]);

  // =====================================================
  // 3. UI (ABHI EMPTY HAI - KYUN?)
  // =====================================================
  //  kyunki STEP 1 sirf routing test hai
  //  STEP 2 me yahan modal open hoga
  // =====================================================
  return (
    <div>

      {/* Placeholder UI */}
      <h1 className="text-sm text-gray-500 p-4">
        Task route loaded (no UI yet)
      </h1>

    </div>
  );
}

//  FLOW (AB CLEAR SAMJHO)
// User URL open karta hai:
//    /AllTasks/t/123

// ↓ Next.js route match karta hai

// ↓ [taskId] extract hota hai

// ↓ useParams() returns:
//    taskId = "123"

// ↓ useEffect run hota hai

// ↓ console log:
//    🔵 Task ID from URL: 123
//  YE FILE KAHAN SE DATA LE RAHI HAI?
//  1. URL se:
// /t/123
//  2. Next.js routing system se:
// [taskId] folder automatically inject karta hai
// IMPORTANT CONCEPT

//  Ye file database se kuch nahi le rahi
//  Ye sirf URL read kar rahi hai

//  ABHI TUMHARA STEP 1 COMPLETE HUA

// ✔ route working
// ✔ taskId readable
// ✔ Next.js dynamic routing OK

// 🚀 NEXT STEP (STEP 2)

// Ab hum karenge:

// 🔥 TASK CLICK → URL CHANGE
// TaskTable me:
// router.push(/clickup/dashboard/AllTasks/t/${task._id})

// 👉 jisse ClickUp jaisa behavior banega

// 💬 SIMPLE SUMMARY

// 👉 STEP 1 = URL samajhna
// 👉 STEP 2 = click → URL change
// 👉 STEP 3 = modal open

// 👉 AB BATAO

// Agar ye clear hai to bolo:

// 👉 “step 2 start”

// phir main tumhe real ClickUp-style click system bana ke dunga 🔥


