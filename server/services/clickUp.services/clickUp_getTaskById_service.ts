
// ============================================================================
// GET SINGLE TASK SERVICE
// Purpose: ek task lana + populate + activity feed banana
// ============================================================================

// Main Task model
import Task from "@/server/models/clickUp_Models/clickUp_Task";  

// Related models register karwa rahe hain taake populate work kare
import "@/server/models/clickUp_Models/clickUp_User";  
import  "@/server/models/clickUp_Models/clickUp_Space";
import  "@/server/models/clickUp_Models/clickUIp_Projects"

// import buildActivityFeed service
import buildActivityFeed from "./buildActivityFeed";

export const getTaskByIdService = async (taskId: string) => {  // Function: taskId le kar task lao

  try {

    // =====================================================
    // FIND TASK BY ID + POPULATE
    // =====================================================
    const task = await Task.findById(taskId)  // MongoDB query: _id se task find karo

      // Yeh subdoc paths ko populate karne ki ijazat deta hai.
      .setOptions({ strictPopulate: false }) 

      // spaceId → object ban jayega (sirf name chahiye)
      .populate("spaceId", "name")  // spaceId (ObjectId) ko populate karo, sirf 'name' field lao

      // projectId → object ban jayega (sirf name chahiye)
      .populate("projectId", "name")  // projectId (ObjectId) ko populate karo, sirf 'name' field lao
        
      // assignees → object ban jayega (name or email b chaiye hame )
       .populate("assignees", "name email")


      //  ye papulate hu raha he activity panel k liye waha sab ye show huga
      // for comments yaha comments._userId ko hum object me converr ker raha he 
      // or uska name or role add ker rehe he object main
      .populate("comments.userId", "name role")

      // for activity yaha b hum wai ker raha he activityLog.performedBy  ko hum object me converr ker raha he 
      // or uska name or role add ker rehe he object main
      .populate("activityLogs.performedBy", " name role")

      // for attcahmenets 
      // attachments.uploadedBy.userId → uploader user
      .populate("attachments.uploadedBy.userId", "name");

    // =====================================================
    // ERROR CASE (task not found)
    // =====================================================
    if (!task) {
      throw new Error("Task not found");  // Agar task na mile, error throw
    }

    // =====================================================
    // Activity feed build karo
    // =====================================================
     const activityFeed = buildActivityFeed(task);

    // =====================================================
    // RETURN FULL TASK OBJECT
    // =====================================================
    return {

      ...task.toObject(),   // yaha Task ki sari existing fields copy ho ker agyi
      activityFeed,         // sqth me ye new feild add
    };

  } catch (error) {

    console.log(" Error in getTaskByIdService:", error);  // Error log
    throw error;  // Error re-throw karo

  }
};



// Task.findById()
//    ↓
// populate()
//    ↓
// task mil gaya
//    ↓
// buildActivityFeed(task)
//    ↓
// comments + files + logs merge
//    ↓
// sort by latest
//    ↓
// return task + activityFeed

// task.toObject() kyun?:
        //  Mongoose document ko plain JS object banata hai taake hum spread use kar saken ...task.toObject() sirf data nikal lo task me objects me se
        // Mongoose document ko simple JS object bana deta hai.
            // {
            // _id,
            //  title,
            //  comments,
            //  attachments
            // }

            // No mongoose methods.

          // ye is liye kun ki hum extra feild add kar raa he activityFeed

