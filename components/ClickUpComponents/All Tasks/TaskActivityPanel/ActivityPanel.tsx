"use client";

import ActivityItem from "./ActivityItem";
import CommentBox from "./CommentBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
 import { IClickUpTaskWithFeed } from "@/types/clickUp_ActivityFeed.Type";

interface Props {

  task: IClickUpTaskWithFeed;
}

export default function ActivityPanel( {task}: Props ) {

  // backend se merged feed aa rahi hai
  // yaha humne wo nikal li he
  const activities = task?.activityFeed || [];

  return (
    <div className="h-full flex flex-col bg-white ">

      {/* HEADER */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Activity
        </h2>
        <p className="text-xs text-gray-500">
          Task timeline & updates
        </p>
      </div>

      <Separator />

      {/* FEED */}
     
      <ScrollArea className="h-full pr-3 py-4">

        <div className="space-y-4">

          
          {activities.map((item, index) => (

            <ActivityItem key={index} item={item} />

          ))}
          

        </div>

      </ScrollArea>

      <Separator />

      {/* COMMENT INPUT */}
      <div className="p-3">

        <CommentBox />

      </div>

    </div>
  );
}