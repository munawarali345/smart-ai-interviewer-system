//  All task page
'use client'

// imports 
import { useEffect } from "react";
import { useTaskStore } from "@/lib/stores/taskStore"; // Task store
import { useUserStore } from "@/lib/stores/userStore"; //  User store (IMPORTANT)
import TaskTable from "@/components/ClickUpComponents/All Tasks/TaskTable";
import { useSearchParams } from "next/navigation"; // header componet me kam kia he view list ka url base us ke liye 
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


  // =====================================================
  // URL SEARCH PARAMS
  // Example: ?view=list
  // =====================================================
  const searchParams = useSearchParams();

  const view = searchParams.get("view") || "list"; // read url for rendering


    // ============================
  //  API CALL (jab page load ho)
  // ============================
  useEffect(() => {

    // Safety check: user exist karta ho tabhi API call karo
    if (user?._id) {

      // Backend ko userId bhej rahe hain
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

  // =====================================================
// VIEW SWITCH SYSTEM
// header me list by default select hoga
// or jab view change hoga to sirf usi ka content show hoga
// =====================================================

return (
  <div className="space-y-6">

    {/* =========================================
        VIEW 1: LIST VIEW (ClickUp Default)
    ========================================= */}
    {view === "list" && (

      <>
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
            <p className="text-xs text-gray-500">
              {item.spaceName}
            </p>

            {/* =====================================================
               PROJECT LEVEL (Expandable)
               Source: aggregation → project.name
            ===================================================== */}
            <Accordion type="single" collapsible>

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
                  <Accordion type="multiple" defaultValue={["to do"]} className="ml-4">

                    {item.statuses.map((statusItem) => (

                      <AccordionItem
                        key={statusItem.status}
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
                             LEVEL 3: TASK TABLE
                             tasks[] = full task objects (from $$ROOT)
                          ===================================================== */}
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
      </>
    )}

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


/*
SIDEBAR CLICK FLOW (ENTRY POINT)
=====================================================

👉 User clicks "All Tasks" in sidebar

Step 1:
Sidebar link open hota hai
→ /clickup/dashboard/AllTasks?view=list

Step 2:
Next.js page load hota hai
→ AllTasksPage render hota hai

Step 3:
URL se view read hota hai
→ useSearchParams()
→ view = "list" (default ya URL se)

Step 4:
API call trigger hoti hai
→ useEffect runs
→ fetchTasks(userId)

Step 5:
Backend aggregation run hoti hai
→ Space → Project → Status → Tasks structure return hota hai

Step 6:
Data store me aata hai
→ Zustand store update hota hai

Step 7:
UI render hota hai
→ {view === "list" && ->
*/