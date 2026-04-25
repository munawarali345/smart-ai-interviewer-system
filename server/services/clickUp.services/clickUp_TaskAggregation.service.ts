// ============================================================================
// ClickUp Task Aggregation Service
// Purpose: Tasks ko UI ke liye group karna (Space → Project → Status → Tasks)
// NOTE: Ye frontend ke liye optimized structure return karega (ClickUp jesa)
// ============================================================================

import mongoose from "mongoose";
import Task from '@/server/models/clickUp_Models/clickUp_Task';


export const getUserTasAggregatedData = async (userId: string) => {

  console.log("🔥 SERVICE START");
  console.log("🔥 SERVICE HIT USER:", userId);
    //Convert userId to ObjectId for MongoDB.
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Start aggregation pipeline.
  const data = await Task.aggregate([

    // step 1: MATCH → sirf user ke tasks
    // {
    //   $match: {
    //     assignees: userObjectId //Match tasks where assignees include the user.
    //   }
    // },

    // step 2: Lookup space collection and unwind (join space).
    {
      $lookup: {
        from: "clickupspaces", // tumhare space model ka collection
        localField: "spaceId",
        foreignField: "_id",
        as: "space"
      }
    },

    {  $unwind: {
    path: "$space",
    preserveNullAndEmptyArrays: true
   }

  },

    // step 3: Lookup project collection and unwind (join project).
    {
      $lookup: {
        from: "projects", // ✔ tumhara project model
        localField: "projectId",
        foreignField: "_id",
        as: "project"
      }
    },

    { $unwind: {
    path: "$project",
    preserveNullAndEmptyArrays: true
  }

 },

   // 3.5 USER LOOKUP (convert assignee IDs → full user objects)
    {
      $lookup: {
        from: "clickupusers",
        localField: "assignees",
        foreignField: "_id",
        as: "assignees"
      }
    },


    // step 4: GROUP by → (space + project + status) pushing task
    {
      $group: {
        _id: {
          spaceId: "$space._id",
          spaceName: "$space.name",

          projectId: "$project._id",
          projectName: "$project.name",

          status: "$status"
        },

        // ============================
        // TASK ARRAY BUILDING
        // ============================
        tasks: {
          $push: {

            // TASK BASIC FIELDS
            _id: "$_id",
            title: "$title",
            description: "$description",
            priority: "$priority",
            status: "$status",
            dueDate: "$dueDate",

            // ============================
            // ASSIGNEES TRANSFORMATION
            // ============================
            assignees: {
              $map: {
                input: "$assignees", // array of users from lookup
                as: "user",

                in: {
                  _id: "$$user._id",
                  name: "$$user.name",
                  email: "$$user.email"
                  
                }
              }
            }
          }
        }
      }
    },


    // step 5: GROUP by → (space + project) pushing statuses
    {
      $group: {
        _id: {
          spaceId: "$_id.spaceId",
          spaceName: "$_id.spaceName",

          projectId: "$_id.projectId",
          projectName: "$_id.projectName"
        },

        statuses: {
          $push: {
            status: "$_id.status",
            tasks: "$tasks"
          }
        }
      }
    },

    // step 6:  Project final structure without _id, with space/project names and statuses array.
    {
      $project: {
        _id: 0,
        spaceId: "$_id.spaceId",
        spaceName: "$_id.spaceName",
        projectId: "$_id.projectId",
        projectName: "$_id.projectName",
        statuses: 1
      }
    }

  ]);

  return data; //Return the data.
};

// Route now calls getUserTasAggregatedData and returns { success: true, tasks }, which is correct.