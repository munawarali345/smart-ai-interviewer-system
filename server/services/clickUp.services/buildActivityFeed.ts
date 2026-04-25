// ============================================================================
// HELPER FUNCTION
// Purpose:
// comments + attachments + activityLogs ko merge karke
// ek single timeline feed banana
//  ============================================================================

// is function me hum reshap is liye kar raha he kun ki task me hamre pas jo he
// task object me comments attachmnets activitylogs alag alag he hame ek list me chaiye
// to sabko pehle reshap kia take sab ki feilds same hu jai or murge me asani ho then
// step 4 me hum murge ker raha he 
const buildActivityFeed = (task: any) => {

  // --------------------------------------------------
  // 1) Comments ko common shape me convert karo
  // --------------------------------------------------
  const comments = task.comments.map((comment: any) => ({
    type: "comment",                 // item type
    createdAt: comment.createdAt,   // kab create hua
    user: comment.userId,           // populated user object
    text: comment.text,             // comment message
  }));


  // --------------------------------------------------
  // 2) Attachments ko common shape me convert karo
  // --------------------------------------------------
  const attachments = task.attachments.map((file: any) => ({
    type: "attachment",                     // item type
    createdAt: file.uploadedAt,            // upload time
    user: file.uploadedBy?.userId,         // uploader user
    fileName: file.fileName,               // file name
    fileType: file.fileType,               // mime type
    fileSize: file.fileSize,               // size
    filePath: file.filePath,               // path
  }));


  // --------------------------------------------------
  // 3) Activity logs ko common shape me convert karo
  // --------------------------------------------------
  const logs = task.activityLogs.map((log: any) => ({
    type: "activity",                // item type
    createdAt: log.createdAt,       // activity time
    user: log.performedBy,          // populated performer
    action: log.action,             // e.g status_changed
    details: log.details,           // extra details
  }));


  // --------------------------------------------------
  // 4) Sab arrays ko ek array me merge karo
  // --------------------------------------------------
  const merged = [...comments, ...attachments, ...logs];


  // --------------------------------------------------
  // 5) Latest item sabse upar lane ke liye sort
  // Sab items ko date ke hisaab se sort karo.
  // Newest first
  // b - a --> Descending order = latest top pe.
  // --------------------------------------------------
  merged.sort((a, b) =>
    
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );


  // --------------------------------------------------
  // 6) Final ready feed return
  // --------------------------------------------------
  return merged;
};

export default buildActivityFeed