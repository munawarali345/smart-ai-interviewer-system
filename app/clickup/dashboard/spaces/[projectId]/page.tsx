// Single Project Tasks Page: Status-wise tasks only (space/project header mein hai)
'use client';

import { useEffect } from "react";
import { useTaskStore } from "@/lib/stores/taskStore";
import { useUserStore } from "@/lib/stores/userStore";
import TaskTable from "@/components/ClickUpComponents/All Tasks/TaskTable";
import { useParams, useSearchParams } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useSidebarSpacesStore } from "@/lib/stores/sidebarSpacesStore";

export default function ProjectTasksPage() {

  const { user } = useUserStore();
  const { tasks, loading, error, fetchTasks } = useTaskStore();
  const { spaces } = useSidebarSpacesStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const view = searchParams.get("view") || "list";

  // projectId se spaceId find
  const currentSpace = spaces.find((s) =>
    s.projects?.some((p) => p._id === projectId)
  );

  const spaceId = currentSpace?._id;

  useEffect(() => {

    if (user?._id && spaceId && projectId) {

      fetchTasks(user._id.toString(), spaceId.toString(), projectId);  // Filtered: sirf is project ke tasks
    }

  }, [user, spaceId, projectId, fetchTasks]);

  if (loading) return <p>Loading tasks...</p>;

  if (error) return <p>Error: {error}</p>;

  if (!tasks.length) return <p>No tasks found for this project</p>;

  // Single project: tasks[0] mein statuses hain, directly statuses show karo
  const projectData = tasks[0];  // Filtered data mein sirf 1 project

  if (view === "list") {
    return (
      <div className="space-y-6 border rounded-lg bg-white p-4 shadow-sm">

        {/* Status accordions directly (space/project header mein hai) */}
        <Accordion type="multiple" defaultValue={["to do"]}>

          {projectData.statuses.map((statusItem) => (

            <AccordionItem key={statusItem.status} value={statusItem.status}>

              <AccordionTrigger className="text-sm font-medium no-underline">

                {statusItem.status.toUpperCase()} ({statusItem.tasks.length})  {/* Status with count */}

              </AccordionTrigger>

              <AccordionContent>

                <div className="space-y-2 ml-4">

                  <TaskTable tasks={statusItem.tasks} />  {/* Tasks list */}

                </div>

              </AccordionContent>

            </AccordionItem>

          ))}

        </Accordion>

      </div>

    );
  }

}