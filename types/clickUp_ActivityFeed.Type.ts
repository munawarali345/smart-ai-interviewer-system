// ye humne banaya he ye asala me ui k liye he is me extra feilds add ki he jo wo dal ker bej raah he na jo uske liye types he 

import { IClickUpTask } from "./clickUp_Task.Type";

export interface IActivityFeedItem {
  type: "comment" | "attachment" | "activity";
  createdAt: Date;
  user?: any;

  text?: string;
  fileName?: string;
  filePath?: string;

  action?: string;
  details?: string;
}

export interface IClickUpTaskWithFeed extends IClickUpTask {
  activityFeed: IActivityFeedItem[];
}

// extends IclickupTask means hum extand ker re he is me ye feild add ker rahe he 
// activityFeed: IActivityFeedItem[]; ye jo uper interface banya he 