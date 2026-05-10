// ======================================================
// SERVICE: Get User Progression Context
// Purpose:
// Calculate user's learning/task progression state
// Used by:
// Main AI agent for next task generation
// user ka “career/task progression memory” bana rahi he.
// ======================================================

// imports 
import Task from "@/server/models/clickUp_Models/clickUp_Task";
import ClickUpUser from "@/server/models/clickUp_Models/clickUp_User";


// service starts here
export const getUserProgressionContextService = async ( userId: string ) => {

    try {

      // =====================================================
      // STEP 1:
      // Fetch all completed tasks of current user
      // =====================================================
      const completedTasks = await Task.find({ // Sirf wo tasks lao


        // task assigneed to this User
        assignees: userId, // jinme current user assigned he.
        
        // only completed tasks
        status: "completed" // Sirf completed tasks chahiye

      }).sort({ createdAt: 1 }); // oldest completed task first  helps maintain proper progression order


       // =====================================================
      // STEP 2:
     // Get current user from task assignee
    // =====================================================

     // fetch full user profile
     const currentUser = await ClickUpUser.findById(userId);

      if (!currentUser) {
        throw new Error("User not found");
      }


       // =====================================================
      // STEP 3:
      // Separate tasks phase-wise
      // =====================================================

      // completedTasks me se sirf onboarding tasks nikal raha he.
      const onboardingTasks = completedTasks.filter(
        (task) => task.phase === "onboarding"
      );

      // completedTasks me se sirf skills tasks nikal raha he.
      const skillsTasks = completedTasks.filter(
        (task) => task.phase === "skills"
      );

      // completedTasks me se sirf skills tasks nikal raha he.
      const realTasks = completedTasks.filter(
        (task) => task.phase === "real"
      );


      // =====================================================
      // STEP 4:
      // Count completed tasks phase-wise
      // hame phase-wise counts chahiye.
      // =====================================================

      const onboardingCompletedCount = onboardingTasks.length;

      const skillsCompletedCount = skillsTasks.length;

      const realCompletedCount = realTasks.length;

      
       // =====================================================
      // STEP 5:
      // Determine phase completion rules
      // =====================================================

      // ======================================================
     // TASK PHASE CONFIG
     // Controls how many tasks are required per phase
    // ======================================================

       const TASK_PHASE_CONFIG = {

        intern: {
           onboardingTasksRequired: 8,
           skillsTasksRequired: 12,
          },

        junior: {
          onboardingTasksRequired: 0,
          skillsTasksRequired: 15,
         },

        mid: {
          onboardingTasksRequired: 0,
          skillsTasksRequired: 20,
        },

        senior: {
          onboardingTasksRequired: 0,
          skillsTasksRequired: 25,
        }

      };

      const phaseConfig =
         TASK_PHASE_CONFIG[
            currentUser.experienceLevel as keyof typeof TASK_PHASE_CONFIG
          ];

      // onboarding completion
      const onboardingCompleted =
         onboardingCompletedCount >=
         phaseConfig.onboardingTasksRequired;

      // skills completion
     const skillsCompleted =
         skillsCompletedCount >=
         phaseConfig.skillsTasksRequired;

      // =====================================================
      // STEP 6:
      // Determine current active phase
      // =====================================================

      //   defult phase
      let currentPhase = "onboarding";

    //   if onboarding completed to 
    if ( onboardingCompleted ) {

        currentPhase = "skills"; // currentPhase skills hu jaiga

    }

    // if onborading or skills duno completed he to
    if ( onboardingCompleted && skillsCompleted ) {

        currentPhase = "real"; // currentPhase real hu jaiga 

    }


     // =====================================================
      // STEP 7:
      // Get latest completed task
      // =====================================================

      // last completed task nikal raha he.
      const latestCompletedTask = completedTasks[ completedTasks.length - 1 ] || null;


      // =====================================================
      // STEP 8:
      // Get latest review result
      // Purpose:
      // Helps AI understand latest performance
      // =====================================================

      // latestCompletedTask? exist karta he to uska reviewResult nikalo
      const latestReviewResult = latestCompletedTask?.reviewResult || null;


         // =====================================================
      // STEP 9:
      // Build completed task summary
      // IMPORTANT:
      // Helps AI avoid repeated tasks
      // =====================================================
      const completedTasksSummary = completedTasks.map(

        (task) => ({

             title: task.title,

             description: task.description,

             phase: task.phase,

             phaseOrder: task.phaseOrder,

             priority: task.priority,

             tags: task.tags,

             status: task.status,

             reviewDecision: task.reviewResult?.decision || null,

             reviewConfidence: task.reviewResult?.confidence || null,

             feedback: task.reviewResult?.feedback || null,

             missingItems: task.reviewResult?.missingItems || [],

            completedAt: task.updatedAt
        })
      );


      // =====================================================
      // STEP 10:
      // Return progression context
      // =====================================================
      return {


        // overall stats
         totalCompletedTasks: completedTasks.length,



         // phase counts
         onboardingCompletedCount,

         skillsCompletedCount,

         realCompletedCount,



         // phase completion status
         onboardingCompleted,

         skillsCompleted,



         // current active phase
         currentPhase,



         // latest task info
         latestCompletedTask,

         latestReviewResult,



         // history/context
         completedTasksSummary,

         // user details
         user: {
           _id: currentUser._id,
           name: currentUser.name,
           department: currentUser.department,
           role: currentUser.role,
          skills: currentUser.skills,
          experienceLevel: currentUser.experienceLevel,
          manager: currentUser.manager // Add manager field

        }


      };



    }  catch (error: any) {

      throw new Error(

         `Error getting progression context: ${error.message}`

      );
   }

}