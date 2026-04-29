"use client";

import ActivityItem from "./ActivityItem";
import CommentBox from "./CommentBox";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IClickUpTaskWithFeed } from "@/types/clickUp_ActivityFeed.Type";
import { useUserStore } from '@/lib/stores/userStore';

interface Props {

  task: IClickUpTaskWithFeed;
}

export default function ActivityPanel( {task}: Props ) {

  // user store se user nikla raha he comments k sath hum userid b bej rahe he 
  // activity feed me as user comment sow k liye 
  const { user } = useUserStore();

    if ( !task || !user || !user._id ) return; // task null check



  // backend se merged feed aa rahi hai
  // yaha humne wo nikal li he
  const activities = task?.activityFeed || [];

  return (
    <div className="h-full flex flex-col bg-white ">

      {/* HEADER */}
      <div className="px-4 py-3 flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-800">
          Activity
        </h2>
        <p className="text-xs text-gray-500">
          Task timeline & updates
        </p>
      </div>

      <Separator />

      {/* FEED */}
     <div className="flex-1 overflow-y-auto pr-3 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent" style={{ scrollbarWidth: 'thin' }}>
      

        <div className="space-y-4 pb-4">

          
          {activities.map((item, index) => (

            <ActivityItem key={index} item={item} />

          ))}
          

        </div>
   
      </div>

      <Separator />

      {/* COMMENT INPUT */}
      <div className="p-3 flex-shrink-0 bg-gray-50">

        <CommentBox 
          taskId={task?._id?.toString() || ''} 
          userId={user?._id?.toString() || ''} 
          // onCommentAdded={onCommentAdded} 
          />

      </div>

    </div>
  );
}