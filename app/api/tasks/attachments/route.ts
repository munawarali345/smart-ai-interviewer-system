// ye task attachmnets upload wala route he attachmnets upload hugi folder me server me sabe then db me save 

// imports 
import { NextRequest, NextResponse } from "next/server";
import logger from "@/server/lib/logger";
import { saveAttachments } from "@/server/lib/clickUpTaskAttachmentsUploads/TaskAttachmentsUploads";
import saveTaskAttachments from "@/server/services/clickUp.services/saveTaskAttachments_service" 

import { processAttachments } from "@/server/services/clickUp.services/attachmentProcessor.service";
import { finalizeTaskAttachments } from "@/server/services/clickUp.services/extractedAttachmentsSaveSb"; 

// main POST Api function
export async function POST(req: NextRequest) {
  try {
    // Step 1: frontend se multipart form data read karo
    const formData = await req.formData();

    // Step 2: taskId lo
    const taskId = formData.get("taskId") as string;

    // step 3: uploder ki id lo
    const uploadedById = formData.get("uploadedById") as string;

    // step 4: uploder ka name lo
    const uploadedByName = formData.get("uploadedByName") as string;

    // Step 5: saari uploaded files lo
    const files = formData.getAll("attachments") as File[];
    

    // Step 6: taskId required hai
    if (!taskId) {
      return NextResponse.json(
        { error: "TaskId is required" },
        { status: 400 }
      );
    }

    // Step 7: kam az kam 1 file honi chahiye
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Step 8: files ko folder me save karo
    // return karega saved paths array
    const savedFiles = await saveAttachments(files, taskId);

    // Example:
    // [
    //   { fileName: "design.png", filePath: "/uploads/tasks/123/design.png" }
    // ]

    // Step 8: metadata me extra info add kar rahe hain
    // Enrich = Data ko aur useful banana / extra info add karna
    // ...file + uploadedBy
     const enrichedFiles = savedFiles.map((file) => ({

      ...file, // purani file details copy ( porani sari feilds copy ) 

      // kis user ne upload kiya
      // saveAttachments se hame jo metadata mil raha tha savedFiles me 
      // hum ye exta data enrich kar raha he 
       uploadedBy: {
       userId: uploadedById,
       name: uploadedByName,
       },

        uploadedAt: new Date(),

      }));


    // Step 10: DB me task ke sath save karo
     await saveTaskAttachments(taskId, enrichedFiles);

    // Step 11: success log
    logger.info("Attachments uploaded successfully", {
      taskId,
      totalFiles: savedFiles.length
    });

    
    // ==============================================
   // STEP 12: PROCESS ATTACHMENTS (OCR / PDF / DOCX)
  // Yahan file ka REAL content extract hota hai
  // isko file pahs caiye he jo  enrichedFiles me ha
  // ==============================================
    const processedFiles = await processAttachments(enrichedFiles);


     // ==============================================
   // STEP 13: extracted attchments yaha se save ker re he 
  // ==============================================
    const updatedTask = await finalizeTaskAttachments(taskId, processedFiles);


    // Step 14: frontend ko response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Attachments uploaded successfully",
        attachments: updatedTask.attachments
      },
      { status: 201 }
    );

  } catch (error: unknown) {

    // Error log
    logger.error("Attachment upload error", {
      error: error instanceof Error ? error.message : error
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload attachments"
      },
      { status: 500 }
    );
  }
}