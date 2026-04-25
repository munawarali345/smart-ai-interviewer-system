"use client";

import { IClickUpTask } from "@/types/clickUp_Task.Type";
import TaskAttachmentsSection from "./TaskAttachmentSection";

interface Props {
  task: IClickUpTask | null;
}

export default function TaskDetailsPanel({ task }: Props) {

    
   const getInitials = (name: string) => {
  return name
    .split(" ")    // Name ko spaces pe split karo (words array, e.g.["Munawar", "Ali"])
    .map((word) => word[0])        // Har word ka first character lo (["M", "A"])
    .join("")                      // Join karo ("MA")
    .toUpperCase()                 // Uppercase karo ("MA")
    .slice(0, 2);                  // Sirf first 2 characters lo (agar zyada ho)
};

  return (
    <div className="space-y-6 ">

        {/* Yahan details aaenge */}
                <h2 className="text-2xl font-semibold">
                  {task?.title}
                </h2>

      {/* ================= STATUS ================= */}
      <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">
          Status
        </p>

        <select
          defaultValue={task?.status}
          className="border px-3 py-1 rounded-md text-sm"
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="review">Review</option>
          <option value="complete">Complete</option>
        </select>

      </div>

      {/* ================= ASSIGNEES ================= */}
      <div className="flex items-center gap-10">
       <p className="text-sm text-gray-500 w-32">Assignees</p>
        <div className="flex gap-2">
          {task?.assignees?.length ? (
            task.assignees.map((user: any) => (
            <div
              key={user?._id}
                 className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold"
                  title={user?.name}  // Tooltip for full name
                  >
                 {getInitials(user?.name)}
            </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Unassigned</span>
             )}
         </div>

      </div>

      {/* ================= DUE DATE ================= */}
      <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">
          Due Date
        </p>

        <span className="text-sm">
          {task?.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No date"}
        </span>

      </div>

      {/* ================= PRIORITY ================= */}
      <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">
          Priority
        </p>

        <span className="text-sm">
          {task?.priority || "Normal"}
        </span>

      </div>

      {/* TIME ESTIMATE SECTION */}
       <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">Time Estimate</p>

       <span className="text-sm">{task?.timeEstimate || "Not set"}</span>

      </div>

      {/* TRACK TIME SECTION */}
      <div className="flex items-center gap-10">

       <p className="text-sm text-gray-500 w-32">Track Time</p>

        <span className="text-sm">{task?.timeTracked || "0 hours"}</span>

      </div>

      {/* TAGS SECTION */}
       <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">Tags</p>

        <div className="flex gap-2">

         {task?.tags && task.tags.length > 0 ? (

           task.tags.map((tag: string, index: number) => (

             <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">

                 {tag}

             </span>

            ))

         ) : (

           <span className="text-sm text-gray-400">No tags</span>

          )}

       </div>

     </div>

     {/* RELATIONSHIPS SECTION */}
      <div className="flex items-center gap-10">

        <p className="text-sm text-gray-500 w-32">Relationships</p>

         <div className="text-sm">

           {task?.relationships && task.relationships.length > 0

             ? task.relationships.join(', ')

              : "None"}

             </div>

          </div>


      {/* DESCRIPTION BOX starts here*/}
       <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">

        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>

          <p className="text-sm text-gray-800 leading-relaxed">

             {task?.description || "No description available."}

          </p>

         </div>
      {/* DESCRIPTION BOX ends here */}


      {/* SUBTASKS SECTION - PREMIUM REDESIGN */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">

           <div>
             <h4 className="text-sm font-semibold text-gray-800">Subtasks</h4>

              <p className="text-xs text-gray-500 mt-0.5">
                Track progress of smaller steps
              </p>
           </div>

            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"> 

               {task?.subTask?.length || 0} Items
             </span>
        </div>

          {/* Body */}
           <div className="p-3">

               {task?.subTask && task.subTask.length > 0 ? (

             <div className="space-y-3">

                {task.subTask.map((sub: any) => (

               <div

                 key={sub._id}
                 className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3 hover:border-gray-200 hover:shadow-sm transition-all"

                 >

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                     checked={sub.completed}
                      readOnly
                       className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer"
                     />

                    {/* Content */}
                     <div className="flex-1 min-w-0">

                       <div className="flex items-start justify-between gap-3">

                          <p
                            className={`text-sm font-medium leading-5 ${
                              sub.completed
                               ? "line-through text-gray-400"
                               : "text-gray-800"
                             }`}
                              >

                                {sub.title}
                          </p>

                           <span
                              className={`shrink-0 text-[11px] px-2 py-1 rounded-full font-medium ${
                               sub.completed
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                               }`}
                               >

                                 {sub.completed ? "Done" : "Pending"}
                             </span>
                        </div>

                          {sub.description && (

                            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">

                               {sub.description}

                            </p>

                           )}

                     </div>
                   </div>
                  ))}
             </div>

           ) : (

                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center">

                  <p className="text-sm font-medium text-gray-600">
                       No subtasks yet
                  </p>

                   <p className="mt-1 text-xs text-gray-400">
                        Subtasks will appear here when available
                   </p>

                </div>

              )}

          </div>
       </div>
       {/* subTask section ends here */}


       {/* Attachment section starts form here */}

        {/* check karo task exist karta he ya ni  */}
         {task && (  // agar task exist karat he

            // componet render huga or agar task exist ni karta to ni huga (slint skip)
             <TaskAttachmentsSection 
             taskId={task._id.toString()}
             assignees={task.assignees} 
             /> 

            )}

       {/* Attachment section starts form here */}


    </div>
  );
}