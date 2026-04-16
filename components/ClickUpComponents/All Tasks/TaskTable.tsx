// ============================================================================
// TaskTable Component (ClickUp Style)
// Purpose: Tasks ko table format me dikhana
// Data Source: Aggregated tasks + user lookup included
// ============================================================================

import { useRouter } from "next/navigation";
import { IClickUpTask } from "@/types/clickUp_Task.Type";


// Props: parent se aggregated tasks aa rahe hain
interface Props {
  tasks: IClickUpTask[];
}

// ============================================================================
// PRIORITY COLORS (UI mapping)
// ============================================================================

// Record = key-value mapping
// priority string → CSS class
const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-600",
  high: "bg-orange-100 text-orange-600",
  normal: "bg-blue-100 text-blue-600",
  low: "bg-gray-100 text-gray-600",
};

// Priority → color return helper
const getPriorityColor = (priority?: string) => {
  return priorityColors[priority || ""] || "bg-gray-100 text-gray-500";
};

// ============================================================================
// NAME → INITIALS HELPER
// "Munawar Ali" → "MA"
// ============================================================================

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TaskTable({ tasks }: Props) {

// route init
const router = useRouter();

// =====================================================
  // TASK CLICK HANDLER (CLICKUP STYLE NAVIGATION)
// =====================================================
const handleTaskClick = (taskId: string) => {

  router.push(`/clickup/dashboard/AllTasks/t/${taskId}`);

};


  // main UI work
  return (

    <div className="mt-3">

      {/* ================= TABLE HEADER ================= */}
      <div className="grid grid-cols-4 text-xs font-semibold text-gray-500 border-b pb-2">
        <p>Name</p>
        <p>Assignees</p>
        <p>Due Date</p>
        <p>Priority</p>
      </div>

      {/* ================= TABLE BODY ================= */}
      <div className="mt-2 space-y-2">

        {tasks.map((task) => (

          <div

            key={task._id?.toString()} // React unique key
            onClick={() => handleTaskClick(task._id?.toString() || "")}
            className="grid grid-cols-4 items-center text-sm bg-white cursor-pointer transition-all duration-200 hover:bg-gray-100 border p-2 rounded-md"
          >

            {/* ================= TASK TITLE ================= */}
            <p className="font-medium text-gray-800" >
                
              {task.title}

            </p>

            {/* ================= ASSIGNEES ================= */}
            <div className="flex gap-2">

              {task.assignees?.length ? (
                task.assignees.map((user: any) => {

                  //  NOW comes from USER LOOKUP
                  const name = user?.name || "User";

                  const initials = getInitials(name);

                  return (
                    <div
                      key={user._id}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold"
                    >
                      {initials}
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-400 text-xs">
                  Unassigned
                </span>
              )}

            </div>

            {/* ================= DUE DATE ================= */}
            <p className="text-gray-600 text-xs">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date"}
            </p>

            {/* ================= PRIORITY ================= */}
            <div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority || "normal"}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>

  );
  
}