// yaha is service me hum kia karenge k jo humne attachmnets ki details he usko db me save karenge 

// imports 
import Task from "@/server/models/clickUp_Models/clickUp_Task";
import { connectDB } from "@/server/lib/db";

/**
 * Save task attachments into database
 *  taskId - task jisme files attach honi hain
 *  savedFiles - file metadata array
 */

// main function 
const saveTaskAttachments = async ( taskId: string, enrichedFiles: any[] ) => {

      // ====================================================
     // STEP 1: Database connection ensure karna
    // ====================================================
      await connectDB();

   // ====================================================
   // STEP 2: Validation (safety check)
   // Agar files hi nahi hain to kuch save nahi hoga
   // ====================================================
      if (!enrichedFiles || enrichedFiles.length === 0) {
       throw new Error("No attachments to save");
      }

   // ====================================================
   // STEP 3: Task update karna (MongoDB)
   //
   // $push + $each:
   // - existing attachments array me new files add karega
   // - har object individually insert hoga
   // ====================================================
      const updatedTask = await Task.findByIdAndUpdate( taskId,
       {
        $push: {               // - existing attachments array me new files add karega 
                          
          attachments: {
           $each: enrichedFiles  // - har object individually insert hoga
           }

         }

       },

         {
         //  new: true // updated document return karega -> ye old hu gya he 
            returnDocument: "after" // updated document return karega -> latest tareeqa
         }

      );


   // ====================================================
   // STEP 4: Return updated task
   // (frontend / route ko updated data mil jaye)
   // ====================================================
      return updatedTask;

};

export default saveTaskAttachments;


// saveAttachments() (file system)
//         ↓
// returns savedFiles[] (metadata)
//         ↓
// saveTaskAttachments()
//         ↓
// connectDB()
//         ↓
// find task by taskId
//         ↓
// $push + $each savedFiles into attachments “array ke har file object ko DB me add karo”
//         ↓
// DB updated task returned

// File → Disk
// Metadata → DB
// Task → Container
// Attachments → Array inside Task
    