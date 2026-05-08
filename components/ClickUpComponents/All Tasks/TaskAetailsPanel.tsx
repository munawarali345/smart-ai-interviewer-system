"use client";

import { useEffect, useState } from "react";
import { IClickUpTask } from "@/types/clickUp_Task.Type";
import TaskAttachmentsSection from "./TaskAttachmentSection";
import { useTaskStore } from '@/lib/stores/taskStore';
import { useUserStore } from '@/lib/stores/userStore'; // userId yaha se nikalene
import { updateSubtask } from "@/lib/api/updateSubtasks";  // API helper import
import { useTimeTrackingStore } from '@/lib/stores/timeTrackingStore';  // store import

// icons
import { Play, Square } from "lucide-react";

interface Props {
  task: IClickUpTask | null;
}

export default function TaskDetailsPanel({ task }: Props) {

  // State for hover
  const [isHovered, setIsHovered] = useState(false);

  // Add hooks here
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus); // store se updateTaskStatus function nikal rahe he 

  const { user } = useUserStore(); // store se user ka data nikal rahe he 

  // Time tracking store se state aur actions lao
  const { isRunning, elapsedTime, startTimer, stopTimer, resetTimer, currentTaskId, lastElapsed, updateElapsedTime } = useTimeTrackingStore();

  // Reset timer for new task
   useEffect(() => {
      if (task?._id) {
      resetTimer(); // New task ke liye time reset
     }
    }, [task?._id]);

  // Ye useEffect har 1 second baad timer ka elapsed time update karta hai jab timer running ho.
  // take UI me live timer (real-time seconds/minutes) show hota rahe bina page reload ke.
  useEffect(() => {

  let interval: NodeJS.Timeout;

  if (isRunning && currentTaskId === task?._id.toString()) {

    interval = setInterval(() => {

      updateElapsedTime();

    }, 1000);

  }

  return () => clearInterval(interval);

}, [isRunning, currentTaskId]);
// ends here

// handle start stop
const handleStartStop = async () => {

   // Validation: Agar task ya user ID nahi, function exit karo 
  if (!task?._id || !user?._id) return;

  try {
     // Condition: Timer running hai aur current task yahi hai
    if (isRunning && currentTaskId === task._id.toString()) {  
      
    // Stop timer
      await stopTimer(task._id.toString(), user._id.toString()); // API call: Stop timer with IDs

    } else { // Timer running nahi ya different task

      await startTimer(task._id.toString(), user._id.toString()); // API call: Start timer with IDs
    
    }

  } catch (error) {

    console.error("Timer error:", error);
  }
};
// ends here

// for formateTime  readable kerne k lie 
const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

  // Status change handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    console.log('Status change triggered', e.target.value); // add this

  if ( !task || !user || !user._id ) return; // task null check

  const newStatus = e.target.value;

  updateTaskStatus(task._id.toString(), newStatus, user?._id.toString());

};
    
   const getInitials = (name: string) => {
  return name
    .split(" ")    // Name ko spaces pe split karo (words array, e.g.["Munawar", "Ali"])
    .map((word) => word[0])        // Har word ka first character lo (["M", "A"])
    .join("")                      // Join karo ("MA")
    .toUpperCase()                 // Uppercase karo ("MA")
    .slice(0, 2);                  // Sirf first 2 characters lo (agar zyada ho)
};


   // Subtask toggle handler
   const handleSubtaskToggle = async (subTaskId: string, completed: boolean) => {
   

     if (!task?._id || !user?._id) {
        console.error("Missing task or user");
        return;
     };

    try {

      if (!subTaskId || typeof subTaskId !== "string") {
        console.error("Invalid subTaskId detected");
       return;
      }

      // API call to update subtask
      await updateSubtask({
        taskId: task!._id.toString(),  // task ID
        subTaskId: subTaskId,  // subtask ID
        completed: completed,  // new status
        userId: user?._id?.toString() || '',  // user ID
      });
    // No refetch, UI later update
    } catch (error) {

    console.error("Error updating subtask:", error);

    alert("Failed to update subtask");

  }

};
// subtask work ends here

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

          value={task?.status}
          onChange={handleStatusChange}  // function call karo
          className="border px-3 py-1 rounded-md text-sm"
        >
          <option value="to do">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>

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

        <div className="text-2xl font-mono">{formatTime(elapsedTime)}</div>
  
          <button 

             onClick={handleStartStop}

              onMouseEnter={() => setIsHovered(true)}

              onMouseLeave={() => setIsHovered(false)}

              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"

              title={isRunning ? "Stop Timer" : "Start Timer"}  // Tooltip
              >

             {isRunning ? (

               <Square className="w-4 h-4 text-red-500" />  // Stop icon

           ) : (

               <Play className="w-4 h-4 text-green-500" />  // Play icon

             )}
    
             <span className="text-sm font-medium">

               {isHovered ? (isRunning ? "Stop Time" : "Start Time") : (isRunning ? "Running" : (lastElapsed > 0 ? formatTime(lastElapsed) : "0h"))}

            </span>

          </button>

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

                     onChange={(e) => { 

                      if (!sub._id) return;

                        handleSubtaskToggle(

                         sub._id.toString(), 
                         
                        e.target.checked)
                     }} 
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

// {/* toggle call e.target.checked boolean deta he (true/false checkbox k liye ye use huta he )*/}