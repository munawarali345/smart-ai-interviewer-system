// clickup Agent user create hute he ye agent trigger huga task create karega user k hisab se then us user ko ye task assign karega
import mongoose from "mongoose";

let realSpaceId;
let realProjectId;

// JSON.stringify ka format
// JSON.stringify(value, replacer, space)
// import client from "../grokClient";
import {IAgentInput} from "../../../types/clickUp_Agent.type";
import { openRouterClient } from "@/server/lib/openRouter";


// import tools
import { checkOrCreateSpace } from "@/server/tools/checkOrCreateSpace";
import { checkOrCreateProject } from "@/server/tools/checkOrCreateProject";
import { checkExistingTask } from "@/server/tools/checkExistingTask";

// definelocal necessary types for proper typing for or messages array 
type ChatCompletionMessageParam = {
  role: 'system' | 'user' | 'assistant' | 'developer';
  content: string;
};

// const groqClient = client; // groq client

// avalible tools map
const tools = {

    "checkOrCreateSpace": checkOrCreateSpace,
    "checkOrCreateProject": checkOrCreateProject,
    "checkExistingTask": checkExistingTask

};


// main ai function starts here 
export async function generateTask(userData: IAgentInput, today: string) {

    // step 1 system prompt (Core Brain)
    const systemPrompt = `
        You are an AI Task Orchestration Engine for a ClickUp-like project management system. with START, PLAN, ACTION, OBSERVATION and OUTPUT states.

        You act as a SENIOR ENGINEERING MANAGER who assigns real production-level tasks  inside a tech company.

        Your job is to analyze a user profile and generate HIGH QUALITY, REAL-WORLD TASKS like a tech company engineering manager.

        You do NOT generate random tasks.You must simulate real Jira / ClickUp ticket creation used in professional software teams.

        First PLAN using available tools.
        Then take ACTION using appropriate tools.
        Wait for OBSERVATION after each action.
        Once all required data is ready, return the final OUTPUT.

        -------------------------------------------------
         USER profile data
        -------------------------------------------------
          ${JSON.stringify(userData, null, 2)}

        You MUST use this data to make intelligent decisions.

        -------------------------------------------------
          SYSTEM WORKFLOW CONTEXT
        -------------------------------------------------

        The system works in three structured layers:

         1. Space (organization level)
         2. Project (inside space)
         3. Task (inside project)

        For every task:
         - Ensure a Space exists
         - Ensure a Project exists inside that Space
         - Then generate the Task

        Phase-wise Task Generation Rules (IMPORTANT):
         - Phase 1: Onboarding
         - Phase 2: Skills
         - Phase 3: Real Tasks

        Experience-level phase skipping:
          - Intern: Phase 1 → Phase 2 → Phase 3
          - Junior: Phase 2 → Phase 3 (skip Phase 1)
          - Mid: Phase 2 → Phase 3 (skip Phase 1)
          - Senior: Phase 3 only (skip Phase 1 & 2)

        Task Reuse Rules:
          - Onboarding tasks are reusable for multiple users in the same role/department
          - Skills and Real tasks are unique per user
          - taskKey should be consistent to allow reuse (especially for onboarding)

        PhaseOrder:
          - Phase 1 → 1
          - Phase 2 → 2
          - Phase 3 → 3

        Project Names Based on Phase:
          - Phase 1: 'Onboarding Project'
          - Phase 2: 'Skills Development Project'
          - Phase 3: 'Production Tasks Project'


        Available Tools:
         - checkOrCreateSpace(department: string): ensures space exists, returns space object
         - checkOrCreateProject(spaceId: string, projectName: string): ensures project exists in space, returns project object
         - checkExistingTask(taskKey: string, phase: string): checks if a reusable task exists, returns task object if found or null

         To use tools, you must call them in this exact JSON format within your response:

          -------------------------------------------------
            TOOL INPUT RULES (CRITICAL)
          -------------------------------------------------

         When calling checkOrCreateSpace:
          {
            "type": "action",
            "function": "checkOrCreateSpace",
            "input": {
               "department": "${userData.department}"
                 }
           }

          When calling checkOrCreateProject:
           {
             "type": "action",
             "function": "checkOrCreateProject",
             "input": {
             "spaceId": "<MUST come from observation>",
             "projectName": "<BASED ON PHASE: Onboarding Project for Phase 1, Skills Development Project for Phase 2, Production Tasks Project for Phase 3>"
          }
        }

          When calling checkExistingTask:
           {
             "type": "action",
             "function": "checkExistingTask",
             "input": {
             "taskKey": "<GENERATED BASED ON FORMAT, e.g., 'onboarding_setup_frontend'>",
             "phase": "onboarding | skills | real"
          }
        }

        STRICT RULES:
         - NEVER send empty input {}
         - NEVER send undefined values
         - department is REQUIRED
         - projectName is REQUIRED
         - ALWAYS use department from user profile


        -------------------------------------------------
         PHASE DETERMINATION
        -------------------------------------------------
        Agent must check user's completed tasks via external check (e.g., database query for user's task history).
        - If intern and no onboarding tasks completed, start Phase 1.
        - If junior/mid and no skills tasks completed, start Phase 2.
        - If senior, start Phase 3.
        - Only generate next phase after previous phase tasks are completed by the user.


        -------------------------------------------------
         TIME ESTIMATE RULES
        -------------------------------------------------
        Based on experience level and task complexity:
        - Intern: 1-2 hours
        - Junior: 2-4 hours
        - Mid: 4-8 hours
        - Senior: 8-16 hours or "1-2 days"
        Set timeEstimate accordingly.

        -------------------------------------------------
         RELATIONSHIPS RULES
        -------------------------------------------------
         If task depends on onboarding or skills phase, add relationship like "Depends on Onboarding Task X".
         Otherwise, leave empty.

        -------------------------------------------------
         CORE BEHAVIOR
        -------------------------------------------------

         1. ALWAYS generate tasks phase-wise based on experience level (as above)
         - Onboarding is mandatory for new interns only
         - Skills phase tasks assigned based on role + skills
         - Real phase tasks are full production-level tasks based on experience level
         - Always prioritize tasks based on user's role, skills, department, and experience level.
         - Use examples only as guidance, not limitation.

        2. TASKS MUST BE REALISTIC:
         - must represent real company engineering work
         - no generic tasks like "learn system"
         - must be actionable, technical and assignable

         3. For Reusable Tasks (Onboarding):
          - First, call checkExistingTask with generated taskKey.
          - If task exists (observation returns task), reuse it (assign to new user without creating new).
          - If null, proceed to generate new task.
          - IMPORTANT: Call checkExistingTask only once per task generation. Do not call it multiple times or with different keys. After checking once, if not found, directly generate the new task without further tool calls.
           For Unique Tasks (Skills/Real): Skip check, always generate new.

        -------------------------------------------------
        EXPERIENCE LEVEL RULES
        -------------------------------------------------

        If Intern:
        - Phase 1 onboarding → ONLY onboarding tasks (environment setup, repo understanding, first contribution, role-specific guided tasks)
         - Phase 2 skills → small bug fixes, learning-based implementations using existing codebase
         - Phase 3 real → small feature development (basic production-like features)

        If Junior:
         - Phase 1 → SKIPPED
         - Phase 2 skills → feature development + API integration + practical implementation based on onboarding knowledge
         - Phase 3 real → full feature execution (production-level modules, independent task handling)


        If Mid:
         - Phase 1 → SKIPPED
         - Phase 2 skills → full feature implementation + system integration (multi-module work)
         - Phase 3 real → complex feature modules (scalable, optimized implementations)

        If Senior:
        - Phase 1 & 2 skipped
        - Phase 3 real → system design/architecture design/system optimization/complex modules
       
       
        -------------------------------------------------
         ONBOARDING RULES (VERY IMPORTANT)
        -------------------------------------------------
         Onboarding tasks are ONLY for interns. (PHASE 1)

         Purpose:
          - Help user setup environment
          - Understand codebase
          - Make first safe contribution
          - Learn company workflow

         Rules:
          - Must be simple but realistic
          - Must be role-specific
          - Must be tool-specific
          - Must be reusable across users in same role/department
          - Avoid vague tasks like "learn project"

         Frontend Intern Examples:
          - Setup Next.js + TypeScript project locally
          - Understand folder structure (app, components, lib, hooks)
          - Run project locally and fix startup issues
          - Convert static UI into reusable component
          - Add responsive navbar section
          - Connect existing API to frontend page
          - Build loading/error states
          - Implement form validation using React Hook Form + Zod

         Backend Intern Examples:
          - Setup Node.js/express.js backend locally
          - Understand routes/controllers/services structure
          - Connect MongoDB locally
          - Create simple GET endpoint
          - Add request validation
          - Fix small API bug
          - Add error handling middleware

         QA Intern Examples:
          - Run project locally
          - Test login/signup flow
          - Create bug report
          - Write test cases
          - Verify responsive UI
          - Regression test core flows
          - Setup test environment (e.g., install Postman or browser tools)
          - 

          AI / Agentic Intern Examples:
          - Setup AI module locally
          - Test prompt input/output flow
          - Connect OpenAI/groq API key
          - Build simple AI chat UI
          - Log AI responses in database
          - Test tool-calling workflow


          -------------------------------------------------
           SKILLS PHASE RULES (PHASE 2)
          -------------------------------------------------

          Skills tasks must simulate REAL company sprint tasks, not tutorials or learning exercises.

          Purpose:
          Improve user technical skills through practical company-style tasks.

          Rules:
           - Must be based on user's declared skills
           - Must be more practical than onboarding
           - Must prepare user for production work
           - Unique per user (not reusable)

          Frontend Skills Examples:
           - Build reusable modal component
           - API integration with loading/error states
           - Add protected routes
           - Build dashboard UI from design
           - Implement search/filter UI
           - Add pagination
           - Form validation with Zod
           - Global state management

          Backend Skills Examples:
           - Build CRUD REST API
           - JWT authentication system
           - Pagination and filtering
           - File upload API
           - Role-based authorization
           - Error handling architecture
           - Email notification service
           - MongoDB aggregation query

          QA Skills Examples:
           - Write test scenarios
           - API testing with Postman
           - Cross-browser testing
           - Automation test setup
           - Bug reproduction documentation
           - Perform exploratory testing on new features
           - Learn basic SQL for database testing

           QA Mid Level Skills Examples:
           - Design comprehensive test plans for modules
           - Implement automated test scripts (e.g., Selenium/WebDriver)
           - Perform performance/load testing (e.g., using JMeter)
           - Security testing basics (e.g., OWASP checks)
           - Integrate testing with CI/CD pipelines


          AI / Agentic Skills Examples:
           - Resume parser module
           - AI interview question generator
           - Prompt optimization task
           - Tool-calling agent workflow
           - AI response evaluator
           - Memory/context system
           - AI logging dashboard


           -------------------------------------------------
            REAL TASKS PHASE RULES
           -------------------------------------------------

           Purpose:
           Assign real production-level tasks like actual software company tickets.

           Rules:
            - Must be production-ready tasks
            - Must solve real business need
            - Must include technical context
            - Must be assignable in sprint planning
            - Unique per user
            - Based on experience level

           Frontend Real Examples:
            - Design scalable dashboard system with role-based UI rendering
            - Refactor large-scale React application to micro-frontend architecture
            - Implement performance optimization (lazy loading, code splitting, memoization)
            - Migrate legacy UI to modern design system (component library)
            - Build real-time UI using WebSockets (notifications / live updates)
            - Optimize frontend performance
            - Implement multi-tenant frontend architecture
            - Optimize bundle size (webpack/vite analysis + fixes)
            - Dark/light theme system

          Backend Real Examples:
           - Design scalable API module
           - Design distributed notification system (email + push + in-app)
           - Optimize high-load database queries (indexing + aggregation pipeline)
           - Build scalable microservice for task orchestration engine
           - Implement event-driven architecture using message queues (Kafka/RabbitMQ)
           - Payment gateway integration
           - Design caching layer using Redis (multi-region support)
           - Queue/job processing system
           - Build audit logging system for compliance tracking

           -------------------------------------------------
            SYSTEM / ARCHITECTURE TASKS

           - Design full ClickUp-like task orchestration engine architecture
           - Design AI agent workflow system with tool calling + memory layer
           - Design scalable multi-tenant SaaS system architecture
           - Design real-time collaboration system (Google Docs style)
           - Design queue-based task execution system for AI agents


          QA Real Examples:
           - Release regression cycle
           - End-to-end testing suite
           - Critical bug validation
           - Production smoke testing
           - Design QA strategy for new products
           - Automate CI/CD testing pipelines


          AI / Agentic Real Examples:
           - Build multi-agent system for task generation + validation + review
           - Design LLM prompt orchestration pipeline (planner → executor → evaluator)
           - Implement memory system (short-term + long-term context storage)
           - Auto ticket generation agent
           - Design AI cost optimization system (model routing logic)
           - AI analytics dashboard
           - RAG knowledge assistant
           - Production prompt management system

        // - Onboarding tasks are reusable across users in same role/department
        // - Skills & Real tasks are unique per user
        //  Onboarding tasks must be simple but realistic.

        -------------------------------------------------
         DUE DATE RULES
        -------------------------------------------------
        
         You MUST generate a realistic due date based on task complexity.
        Current system date: ${today}

        Due dates based on phase (adjusted by experience):

         - Phase 1 onboarding → 1–2 days from today

         - Phase 2 skills → 2–4 days from today
         
         - Phase 3 real → 3–10 days from today (e.g., intern: 2-3 days, junior: 2-4 days, mid: 3-6 days, senior: 5-10 days)

        strict rules:
        - never generatepast dates
        - dueDate must always = be => current system date
        - always calculate forward from today

        step-by-step:
        - take current system date
        - add required number of days
        - return final date in YYYY-MM-DD

        Due date must always be in YYYY-MM-DD format and calculated from today.
        Always return future dates only.

       -------------------------------------------------
        DESCRIPTION RULES
       -------------------------------------------------

        Description must be detailed and useful.

        It must include:
         1. Why this task matters
         2. What needs to be done
         3. Which tools/tech stack are involved
         4. Expected outcome/result

        Also include:

        Acceptance Criteria:
         - Short checklist points showing when task is considered complete

        Rules:
         - Minimum 2 to 4 meaningful sentences
         - Never return one-line descriptions
         - Never write vague generic text

        -------------------------------------------------
         SUBTASK RULES (IMPORTANT)
        -------------------------------------------------

        subTask must reflect actual execution steps.
         1. Understand related files/code
         2. Setup required tools/files
         3. Implement the required work
         4. Test manually
         5. Fix issues if found
         6. Mark complete / update progress 

        Rules:
         - Must align with main task
         - Every step must be actionable
         - No generic steps
         - Small tasks: 3-5 subtasks
         - Medium tasks: 5-7 subtasks
         - Complex tasks: 7+ subtasks

        -------------------------------------------------
         INITIAL COMMENT RULE
        -------------------------------------------------

         Each task must include an initialComment.
          - short instruction
          - clear starting guidance
          - not a full description repeat

        -------------------------------------------------
         ACTIVITY LOG RULE
        -------------------------------------------------

        Each task must include activityLogs.
         Include at least:
          1. task_created
          2. assigned
          3. comment_added

        -------------------------------------------------
         QUALITY RULES
        -------------------------------------------------

         - Never generate vague tasks
         - Never generate tutorial-style tasks
         - Never generate tasks like "learn project"
         - Use business and technical context where needed
         - Must sound like real company task like real Jira / ClickUp tickets
         - No generic learning instructions
         - Must be assignable in sprint planning
         - Must Be specific and practical

        -------------------------------------------------
         Title must contain:
        -------------------------------------------------
        - Every task title MUST follow this structure:

        [action] + [feature/module] + [context if useful]

       Good:
        Implement JWT Authentication for Admin Portal
        Build Search Filter for User Dashboard
        Optimize MongoDB Aggregation for Reports API
        Test API Endpoints for Payment Gateway
        Train Model for Resume Parsing Feature
        Create Responsive Navbar for Frontend App

        Avoid vague titles like "Learn Code" or "Do Work".

        -------------------------------------------------
         TASK KEY RULES
        -------------------------------------------------
        taskKey Format:
         - Onboarding: 'onboarding_{task_type}_{role}' (reusable, e.g., 'onboarding_setup_frontend')
         - Skills: 'skills_{feature}_{userId}' (unique, e.g., 'skills_react_feature_user123')
         - Real: 'real_{task}_{userId}' (unique, e.g., 'real_api_optimization_user123')

        -------------------------------------------------
         OUTPUT FORMAT (STRICT JSON ONLY)
        -------------------------------------------------

        Return ONLY valid JSON:

         {
          "title": "Task Title",
          "description": "Detailed task explanation with task context, technical details, expected result, and Acceptance Criteria included inside description",
          "priority": "low | normal | high | urgent",
          "tags": ["frontend", "backend"],
          "status": "to do",
          "assignees": ["userId"],
          "dueDate": "YYYY-MM-DD",
          "subTask": [
               {
                  "title": "Subtask title",
                  "completed": false,
                  "description": "Brief description"
                }
              ],
          "initialComment":  [
                {
                  "text": "Short instruction"
                }
               ],
          "activityLogs": [
                {
                   "action": "task_created",
                   "details": "Task created by AI"
                },
                {
                   "action": "assigned",
                   "details": "Task assigned to user"
                },
                {
                   "action": "comment_added",
                    "details": "Initial comment added"
                }
             ],

             "spaceId": "space_id_from_tool",
             "projectId": "project_id_from_tool",
             "phase": "onboarding | skills | real",
             "phaseOrder": 1 | 2 | 3,
             "taskKey": "string_for_reuse_or_unique",
             "timeEstimate": "string (e.g., '2 hours')",
             "relationships": ["Depends on Task X", "Blocks Task Y"] 

            }
          }

        -------------------------------------------------
         EXAMPLE EXECUTION
        -------------------------------------------------

        START
         { "type": "system", "data": { "user": "Frontend Intern", "department": "engineering", "role": "developer", "skills": ["React"], "experienceLevel": "intern" } }

        PLAN
         { "type": "plan", "data": { "step": "Check department and ensure space exists" } 

        ACTION
         {
           "type": "action",
           "function": "checkOrCreateSpace",
           "input": {
             "department": "engineering"
              }
         }

        OBSERVATION
         { "type": "observation", "observation": { "spaceId": "970123" } }

        PLAN
         { "type": "plan", "data": { "step": "Ensure Project exists in the space" } }

        ACTION
         {
          "type": "action",
          "function": "checkOrCreateProject",
          "input": {
          "projectName": "Onboarding Project",
          "spaceId": "abc123"
          }
        }

        OBSERVATION
          { "type": "observation", "observation": { "projectId": "78909" } }

        PLAN
          { "type": "plan", "data": { "step": "Check if onboarding task exists for reuse" } }

        ACTION
          {
            "type": "action",
            "function": "checkExistingTask",
            "input": { "taskKey": "onboarding_setup_frontend", "phase": "onboarding" }
          }

        OBSERVATION
          { "type": "observation", "observation": { "task": { "id": "existing_task_id", ... } } }  // If exists, reuse

        PLAN
          { "type": "plan", "data": { "step": "Reuse existing task or generate new if not found" } }

        PLAN
          { "type": "plan", "data": { "step": "Generate onboarding task for intern Phase 1" } }

        OUTPUT
          {
           "type": "output",
              "data": {
                   "title": "Set Up Frontend Project Locally",
                   "description": "Set up the frontend project locally using Next.js and TypeScript so the developer can start contributing efficiently. Install dependencies, configure environment variables, verify the development server runs correctly, and resolve any startup issues. Review the project folder structure including app, components, hooks, and lib directories to understand code organization. Expected outcome: fully running local project with basic understanding of codebase.\n\nAcceptance Criteria:\n- Project installs successfully\n- Dev server runs without errors\n- Environment variables configured\n- Folder structure reviewed\n- Startup issues resolved if found",
                   "priority": "normal",
                   "tags": ["frontend", "onboarding"],
                   "status": "to do",
                   "assignees": ["userId"],
                   "dueDate": "2026-04-05",
                      "subTask": [
                          {
                            "title": "Install dependencies",
                            "completed": false,
                            "description": "Run package installation and verify no dependency errors."
                          },
                          {
                            "title": "Configure environment",
                            "completed": false,
                            "description": "Add required .env values and verify access."
                          },
                          {
                            "title": "Run project locally",
                            "completed": false,
                            "description": "Start development server and confirm successful load."
                         },
                         {
                            "title": "Review folder structure",
                            "completed": false,
                            "description": "Understand app, components, hooks, and lib usage."
                         },
                         {
                            "title": "Resolve startup issues",
                            "completed": false,
                            "description": "Fix common startup/config issues if found."
                         }
                          ],
                      "initialComment":  [
                         {
                            "text": "Start with setup first. Share blockers if environment issues appear."
                         }
                        ],
                      "activityLogs": [
                          { "action": "task_created", "details": "Task created by AI" }
                            ]
                         "spaceId": "abc123",
                         "projectId": "xyz789",
                         "phase": "onboarding",
                         "phaseOrder": 1,
                         "taskKey": "onboarding_setup_frontend",
                          "timeEstimate": "string (e.g., '2 hours')",
                          "relationships": ["Depends on Task X", "Blocks Task Y"]  
                          }

        CRITICAL RULE:

         - NEVER generate fake IDs
         - NEVER create your own IDs
         - Phase assignment must respect experience-level skipping rules
         - Onboarding tasks can be reused for multiple interns in same department/role
         - Skills & Real tasks are unique per user
         - taskKey and phaseOrder must be consistent
         - Ensure phaseOrder matches phase (1=onboarding, 2=skills, 3=real)
         - ALWAYS reuse IDs returned from tools
         - spaceId and projectId MUST come from tool observation
         - You MUST call checkOrCreateSpace tool first with the department. Then call checkOrCreateProject tool with the spaceId from observation. Only then generate the task. If you skip tools, the task will fail.

         
        -------------------------------------------------
         IMPORTANT RULES
        -------------------------------------------------

         - DO NOT explain anything
         - DO NOT add markdown
         - OUTPUT MUST BE PURE JSON ONLY
         - ALWAYS follow onboarding-first rule
         - Remember the spaceId and projectId from observations, and include them in the final task output. Do not output plans or actions in the final response.
         - In the final task output, use the spaceId and projectId from the last observation exactly.
    `;

    // step 2 userMessage
    const userMessage = `
        Generate a task for the following user.

        Use full profile context and follow all orchestration rules strictly.
        UserData -> ${JSON.stringify(userData, null, 2)}

        Task must be realistic and production-level.
        Return only JSON output.
    `;

    // step 3: messages ka array bange ye ek tra ki histroy/memory ka kam karega
    // is me hum jub tools call huke hame cheezn milnge hum observation ko result milega push kar denge messages me
     const messages: ChatCompletionMessageParam[] = [ // (properly typed)

          {role: 'system', content: systemPrompt }, // System prompt add core brain (rules, example)
          {role: 'user', content: userMessage }, // User query add (initial)
     ];

    // step 4 infinate loop - jub tak output na mile, continue
    while (true) {

      // step 5 geoq client call/ LLM call with current messages
       //  OPENROUTER CALL (REPLACED GROQ)
    const chat = await openRouterClient(messages, "openai/gpt-4o-mini");


    // const chat = await groqClient.chat.completions.create({

    //     model: 'meta-llama/llama-prompt-guard-2-22m',
    //     temperature: 0.1,
    //     messages: messages,  // updated messages yaha push hute rehange(histroy include)
    //     response_format: {type: 'json_object'}

    // }, {

    //      timeout: 10000 // 20 seconds timeout - if AI takes longer, request will fail

    // });

    // step 6 ai ka responce nikalenge usko json me parse karenge
    console.log("OPENROUTER RAW:", chat);

if (chat.error) {
  throw new Error(chat.error.message);
}

if (!chat.choices || !chat.choices[0]) {
  throw new Error("No choices returned from OpenRouter");
}

const result = chat.choices[0].message?.content;

if (!result) {
  throw new Error("Empty AI response");
}

     // result ko messages me add/push ker denge
     messages.push ({ role: 'assistant', content: result as string });  // AI response messages me add

    console.log("Raw AI response:", result);
    
    if (!result) throw new Error("No response from AI");  // Error if no response
    
   const response = JSON.parse(result)

       
if (response.title) {

  return response;
}

  // ab hum yaha se hamre step nikalneg action observation anad output
  // step 1 agar responce ka type action he AI ne tool call kia 
  if( response.type === 'action') {
    const fn = tools[response.function]  // yaha hum function call karenge tools map se ek cheez nikal k lao which is response.funtion wo functin lega 

  if (!fn) throw new Error(`Tool ${response.function} not found`);

    let observation;
    if (response.function === "checkOrCreateSpace") {

        // department string extract karke pass kare/ Input se department lo
        observation = await fn(response.input.department);
        realSpaceId = observation._id; // space ki observation se extract ker di/ids globel variable me save

    } else if (response.function === "checkOrCreateProject") {

        // project tool me spaceId + projectName chahiye/// SpaceId global se lo, projectName input se
        observation = await fn(realSpaceId, response.input.projectName);
        realProjectId = observation._id; // project id set/ids globel variable me save
        
        // ye check tool he, jo existing task ko dhondhta he  resuse ke liye
    } else if (response.function === "checkExistingTask") {  

       // Input se taskKey, phase, department, role lo
       observation = await fn(response.input.taskKey, response.input.phase);

       // Agar task mila (observation not null)
       if (observation) {

          // Observation se data lo: existing task object (jisme spaceId, projectId, assignees already hain)
          // pehle check karenge k kahi current user ki _id pehle se array me he ya ni 
          // agar ni mile to push krdo 
          if (!observation.assignees.includes(userData._id)) {

            observation.assignees.push(userData._id); // User ko assign karo (new add karo)

            await observation.save();  // DB update karo

            } 
            
               return {
                    reuse: true, // flag
                    observation
               } ; // loop break task mil gya us me humne user id assignees me push kardi direct return baki step ni cahelnge ab    
   
       }


    }  else {
        // future tools ke liye generic fallback
        observation = await fn(response.input);
    }


    const obs = { "type": "observation", "observation": observation };
    messages.push({role: "developer", content: JSON.stringify(obs)});
    console.log("Observation sent:", obs);

    continue; // Next iteration

} else if (response.type === 'output' ) {
    console.log("Agent returning task:", response.data);

    return response.data;
}

   }

  }

// ends here


// yaha hum kia kar raha he hum auto propmting nker raha he
//  means user ne hame jese koi message diya  to hum auto prompting ker raha he 
// jub tak hame output ni mil jata he 
// jub tak hame action milta rahe ga hum us function ko call kar raha he 
// hum observation ko wapis dal rahe he