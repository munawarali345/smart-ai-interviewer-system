//  All task page
'use client'

// imports 
import { useEffect } from "react";
import { useTaskStore } from "@/lib/stores/taskStore"; // Task store
import { useUserStore } from "@/lib/stores/userStore"; //  User store (IMPORTANT)
import TaskTable from "@/components/ClickUpComponents/All Tasks/TaskTable";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";



// Main All Tasks Page Component
export default function AllTasksPage() {

   // ============================
   // USER (kahan se aa raha?)
   // Zustand userStore se
  // ============================
  const { user } = useUserStore();

  // ============================
  // TASK STORE (aggregated data)
  // tasks = Space → Project → Status → Tasks
  // ============================
  const { tasks, loading, error, fetchTasks } = useTaskStore();

    // ============================
  //  API CALL (jab page load ho)
  // ============================
  useEffect(() => {

    // Safety check: user exist karta ho tabhi API call karo
    if (user?._id) {

      // 🔥 Backend ko userId bhej rahe hain
      // Backend us user ke assigned tasks return karega (aggregation ke sath)
      fetchTasks(user._id.toString());
    }

  }, [user, fetchTasks]); // 👈 user change hoga to refetch


  // Loading state
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  //  Error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  //  Empty state
  if (!tasks.length) {
    return <p>No tasks found</p>;
  }


  //  MAIN UI START
   return (
    <div className="space-y-6">

      {/* =========================================================
         LEVEL 1: PROJECT BOX LOOP
         tasks[] = aggregated array from backend
         Har item = ek Project box
      ========================================================== */}
      {tasks.map((item) => (

        <div
          key={item.projectId} // unique key (React optimization)
          className="border rounded-lg bg-white p-4 shadow-sm"
        >

          {/* =====================================================
             SPACE NAME (Top small text)
             Source: aggregation → space.name
           ===================================================== */}
          {/* Space Name (small) */}
          <p className="text-xs text-gray-500">
            {item.spaceName}
          </p>

          {/* =====================================================
             PROJECT LEVEL (Expandable)
             Source: aggregation → project.name
          ===================================================== */}
          {/*PROJECT ACCORDION */}
          <Accordion type="single" collapsible defaultValue={item.projectId}>

            <AccordionItem value={item.projectId}>

              {/* Project Name (click to expand) */}
              <AccordionTrigger className="text-lg font-semibold no-underline">
                {item.projectName}
              </AccordionTrigger>


              <AccordionContent>

                 {/* =====================================================
                   LEVEL 2: STATUS LOOP
                   statuses[] = [{ status, tasks }]
                ===================================================== */}

                {/*  STATUS ACCORDION */}
                <Accordion type="multiple"  defaultValue={["to do"]} className="ml-4">

                  {item.statuses.map((statusItem) => (

                    <AccordionItem
                      key={statusItem.status} // unique per status
                      value={statusItem.status}
                    >

                      {/* Status Header */}
                      <AccordionTrigger className="text-sm font-medium no-underline">

                        {statusItem.status.toUpperCase()} (
                        {statusItem.tasks.length}
                        )

                      </AccordionTrigger>


                      <AccordionContent>

                        {/* =====================================================
                           LEVEL 3: TASK LOOP
                           tasks[] = full task objects (from $$ROOT)
                        ===================================================== */}

                        {/* TASK LIST */}
                        <div className="space-y-2 ml-4">

                          <TaskTable tasks={statusItem.tasks} />

                        </div>

                      </AccordionContent>

                    </AccordionItem>

                  ))}

                </Accordion>

              </AccordionContent>

            </AccordionItem>

          </Accordion>

        </div>

      ))}

    </div>
  );
}



// ============================================================================
// 🔥 WHY 3 MAPS USED? (IMPORTANT CONCEPT - MUST UNDERSTAND)
// ============================================================================

/*
👉 Backend se hume jo data mil raha hai wo SIMPLE ARRAY nahi hai

👉 Ye NESTED (layered) structure hai:

[
  {
    spaceName,
    projectName,
    statuses: [
      {
        status,
        tasks: [ ... ]
      }
    ]
  }
]

 Is structure ko UI me dikhane ke liye hume har level pe loop chalana padta hai

// ---------------------------------------------------------------------------
//  MAP 1 → PROJECT LEVEL
// ---------------------------------------------------------------------------

tasks.map((item) => ...)

✔ Har item = ek "Project Box"
✔ Is level pe hum:
   - Space Name dikhate hain
   - Project Name dikhate hain

 Reason:
Backend ne data ko "Project level" pe group kiya hai


// ---------------------------------------------------------------------------
//  MAP 2 → STATUS LEVEL
// ---------------------------------------------------------------------------

item.statuses.map((statusItem) => ...)

✔ Har statusItem = ek status group
   (e.g. "To Do", "In Progress")

✔ Is level pe hum:
   - Status name dikhate hain
   - Task count dikhate hain

Reason:
Har project ke andar multiple statuses hote hain


// ---------------------------------------------------------------------------
//  MAP 3 → TASK LEVEL
// ---------------------------------------------------------------------------

statusItem.tasks.map((task) => ...)

✔ Har task = actual task object

✔ Is level pe hum:
   - Task title dikhate hain
   - (future: priority, due date, etc)

Reason:
Status ke andar multiple tasks hote hain


// ============================================================================
//  SIMPLE SUMMARY
// ============================================================================

 3 maps use kiye kyunki data 3 levels ka hai:

1 Project level  
2 Status level  
3 Task level  

 Agar nested data hai → multiple .map() lagenge  
 Flat data hota → sirf 1 map lagta


// ============================================================================
//  FLOW (END TO END)
// ============================================================================

Frontend (useEffect)
   ↓
API Call (/api/tasks)
   ↓
Route
   ↓
Service (Aggregation)
   ↓
MongoDB (grouped data)
   ↓
Frontend (tasks[])
   ↓
.map() → UI render


// ============================================================================
//  KEY USAGE (React Optimization)
// ============================================================================

 Har .map() me "key" dena zaroori hai

✔ Project → key = projectId  
✔ Status  → key = status  
✔ Task    → key = _id  

 Reason:
React efficiently re-render karta hai aur performance improve hoti hai


// ============================================================================
//  FINAL NOTE (PRO LEVEL)
// ============================================================================

 Ye approach scalable hai  
 Same structure future me use hoga:
   - Drag & Drop
   - Filters
   - Sorting
   - Real-time updates

 Ye exactly ClickUp / Trello jese apps ka base pattern hai
*/