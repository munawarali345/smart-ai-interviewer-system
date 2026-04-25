"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import getTaskById from "@/lib/api/getTaskById";
import { IClickUpTaskWithFeed } from "@/types/clickUp_ActivityFeed.Type";
import TaskDetailsPanel from "./TaskAetailsPanel";
import ActivityPanel from "./TaskActivityPanel/ActivityPanel";

interface Props {
  taskId: string;
}

export default function TaskModal({ taskId }: Props) {

  const router = useRouter();

  const [task, setTask] = useState<IClickUpTaskWithFeed| null>(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {

    const fetchTask = async () => {

      setLoading(true);

      const data = await getTaskById(taskId);

      setTask(data);
      
      setLoading(false);
    };

    if (taskId) fetchTask();

  }, [taskId]);

  // ================= CLOSE =================
  const handleClose = () => {
    router.push("/clickup/dashboard/AllTasks?view=list");
  };

 return (

    <Dialog open={true} onOpenChange={handleClose}>

      {/*  FULL SIZE MODAL */}
      <DialogContent
        className="
          !w-[95vw]
          !max-w-none
          h-[90vh]
          p-0
          flex flex-col
          rounded-xl
        "
      >

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          {/* LEFT */}
          <div className="text-sm font-medium text-gray-700">
            {(task?.spaceId as any)?.name || "Space"} /
            {(task?.projectId as any)?.name || "Project"}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6 mr-6">

            {/* CREATED AT */}
            <span className="text-xs text-gray-700">
                Created: {task?.createdAt
                      ? new Date(task.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                         })
                        : "No date"}
               </span>

          </div>

        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 px-6 py-4 overflow-hidden min-h-0">

          {/* LOADING */}
          {loading && (
            <p className="text-sm text-gray-400">
              Loading...
            </p>
          )}

          {/* accessibility only */}
          <DialogTitle className="sr-only">
            {task?.title}
          </DialogTitle>

          <DialogDescription className="sr-only">
            {task?.description || "No description"}
          </DialogDescription>

          {/* MAIN CONTENT - 2 BOXES */}
          {!loading && task && (
            <div className="flex gap-6 h-full min-h-0">

              {/* LEFT: DETAILS */}
              <div className="w-3/5 min-h-0   border-r ">

                <ScrollArea className="h-full pr-3">

                   <TaskDetailsPanel task={task} />

                  </ScrollArea>

              </div>

              {/* RIGHT: ACTIVITY/COMMENTS */}
              <div className="w-2/5 min-h-0  ">
                {/* Yahan activity aur comments aaenge */}
                   <ActivityPanel task={task} />
                {/* Next: Activity list add */}
              </div>

            </div>
          )}

        </div>

      </DialogContent>

    </Dialog>
  );

}