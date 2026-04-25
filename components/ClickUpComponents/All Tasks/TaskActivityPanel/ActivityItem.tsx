"use client";

import { User, MessageSquare, CheckCircle2, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { IActivityFeedItem } from "@/types/clickUp_ActivityFeed.Type";

// 🔹 props type (simple for now)
type Props = {
  item: IActivityFeedItem; // Har card ko ek single activity item mil raha hai
};
// (matlab ek comment / ek attachment / ek activity log)

//  icon selector based on activity type
// type backend se ara he 
const getIcon = (type: string) => {

  switch (type) {

    case "activity":

      return <CheckCircle2 className="w-4 h-4 text-green-500" />;

    case "comment":

      return <MessageSquare className="w-4 h-4 text-purple-500" />;

    case "attachment":

      return <Plus className="w-4 h-4 text-blue-500" />;

    default:

      return <User className="w-4 h-4 text-gray-500" />;
  }

};
// ends here

// ================= MESSAGE bana rahe ha =================
const getMessage = (item: IActivityFeedItem) => {

  if (item.type === "comment") return item.text;

  if (item.type === "attachment")
    return `Uploaded file: ${item.fileName}`;

  if (item.type === "activity")
    return item.details || item.action;

  return "";
};

export default function ActivityItem({ item }: Props) {

  // ================= USER =================
  // agar user object he to name do ni to fallback "system"
  const userName = item.user?.name || "System";

   // ================= TIME =================
  //   agar createdAt he to
  const formattedTime = item.createdAt ? 

    new Date(item.createdAt).toLocaleString() // ye aega 

    : ""; // ni to ye 


  return (
    <Card className="p-3 hover:shadow-sm transition border-gray-200">

      <div className="flex gap-3">

        {/* ICON */}
        <div className="mt-1">
          {getIcon(item.type)}
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          {/* TOP ROW */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Avatar className="h-6 w-6">

                <AvatarFallback className="text-[10px]">

                  {userName.slice(0, 2).toUpperCase()}

                </AvatarFallback>

              </Avatar>

              <span className="text-sm font-medium text-gray-800">
                {userName}
              </span>

            </div>

            <span className="text-[11px] text-gray-400">
              {formattedTime}
            </span>

          </div>

          {/* MESSAGE */}
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">

            {getMessage(item)}

          </p>

        </div>

      </div>
    </Card>
    
  );

}