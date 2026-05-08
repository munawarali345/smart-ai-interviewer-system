import Task from "@/server/models/clickUp_Models/clickUp_Task";

/**
 * Attachments ko processed data ke sath update karna
 * Sirf extractedText add hota hai, baqi data same rehta hai
 */
export const finalizeTaskAttachments = async (
  taskId: string,
  processedFiles: any[]
) => {

  // Task fetch karo
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  // attachments ko update karo (merge logic)
  const updatedAttachments = task.attachments.map((att: any) => {

    // processed file match karo
    const processed = processedFiles.find(
      (p) => p.fileName === att.fileName
    );

    // purani values + extracted text add
   if (processed) {
    // New file: extractedText update karo
    return { ...att.toObject(), extractedText: processed?.extractedText || "" };

  } else {
    // Old file: waise ka waise raho
    return att.toObject();
  }

  });

  // DB update (single call)
  const updatedTask = await Task.findByIdAndUpdate(

    taskId,

    { attachments: updatedAttachments },

    { returnDocument: "after" }  // new: true ki jagah

  );

  return updatedTask;
};


// ...att.toObject(), ko
// plain JavaScript object me convert karta hai.

// ...att ye kun use ni kia
// Mongoose subdocument issues se bachne ke liye ...att ki jagah ...att.toObject() use kia taake plain object banaye aur merge sahi ho.

// toObject() Mongoose subdocument ko plain JavaScript object mein convert karta hai.


/*
==============================================================================
EXTRACTED ATTACHMENTS SAVE SERVICE - EXPLANATION & FLOW
==============================================================================

PURPOSE:
--------
Yeh service attachment processing ke baad extracted text ko DB mein save karta hai.
Processing (OCR/PDF/DOCX text extract) ke baad, yeh text ko task ke attachments mein add karta hai
taake review agent ko readable data mile.

FLOW DIAGRAM:
-------------
1. INPUT: taskId + processedFiles[] (extracted text wale)
2. FETCH TASK: DB se task fetch karo
3. MERGE DATA: Har attachment ko processed data se merge karo
4. UPDATE DB: Task ko updated attachments ke saath save karo
5. RETURN: Updated task return karo

DETAILED FLOW:
--------------
Frontend Upload → API Route → processAttachments → finalizeTaskAttachments → DB Update

1. processAttachments() calls:
   - extractFromImage() for images (Tesseract OCR)
   - extractFromPDF() for PDFs (PdfParse)
   - extractFromDocx() for DOCX (Mammoth)
   Returns: [{ fileName, extractedText }, ...]

2. finalizeTaskAttachments() ka kaam:
   - Task DB se fetch karo (attachments ke saath)
   - Loop: Har existing attachment ko match karo processed file se
   - Merge: ...att.toObject() + extractedText add karo
   - Update: Puri attachments array ko DB mein replace karo

KYUN att.toObject()?
-------------------
- Mongoose subdocument issues se bachne ke liye
- Plain object banata hai, merge safe hota hai
- Mongoose methods (_id getters, etc.) avoid hote hain

ERROR HANDLING:
---------------
- Task not found: Error throw
- File match nahi mila: extractedText = "" set hota hai

PERFORMANCE:
-----------
- Single DB call (findByIdAndUpdate)
- Attachments array replace (not individual updates)
- Memory efficient (no extra copies)

USAGE IN API:
-------------
app/api/tasks/attachments/route.ts mein:
const processed = await processAttachments(enrichedFiles);
const updatedTask = await finalizeTaskAttachments(taskId, processed);
return updatedTask.attachments; // Response mein

DEPENDENCIES:
-------------
- Task model (Mongoose)
- processedFiles format: [{ fileName: string, extractedText: string }]

TESTING:
--------
- Upload file → Console: "Processed attachments" log check
- DB: extractedText field add hua ya nahi
- Review trigger: Payload mein readable text hai

==============================================================================
*/