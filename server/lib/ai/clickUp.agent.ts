// clickup Agent user create hute he ye agent trigger huga task create karega user k hisab se then us user ko ye task assign karega
import mongoose from "mongoose";

let realSpaceId;
let realProjectId;

// JSON.stringify ka format
// JSON.stringify(value, replacer, space)
import client from "../grokClient";
import {IAgentInput} from "../../../types/clickUp_Agent.type";

// import tools
import { checkOrCreateSpace } from "@/server/tools/checkOrCreateSpace";
import { checkOrCreateProject } from "@/server/tools/checkOrCreateProject";

// definelocal necessary types for proper typing for or messages array 
type ChatCompletionMessageParam = {
  role: 'system' | 'user' | 'assistant' | 'developer';
  content: string;
};

const groqClient = client; // groq client

// avalible tools map
const tools = {

    "checkOrCreateSpace": checkOrCreateSpace,
    "checkOrCreateProject": checkOrCreateProject

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

        Available Tools:
         - checkOrCreateSpace(department: string): ensures space exists, returns space object
         - checkOrCreateProject(spaceId: string, projectName: string): ensures project exists in space, returns project object

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
             "projectName": "Onboarding Project"
          }
        }

        STRICT RULES:
         - NEVER send empty input {}
         - NEVER send undefined values
         - department is REQUIRED
         - projectName is REQUIRED
         - ALWAYS use department from user profile

        -------------------------------------------------
         CORE BEHAVIOR
        -------------------------------------------------

        1. ALWAYS generate ONBOARDING TASKS for new users first
         - onboarding is mandatory for every user
         - onboarding is independent of role or experience level
         - onboarding = system introduction + setup + understanding

        2. AFTER ONBOARDING CONTEXT:
         - generate tasks strictly based on role + skills + experience level
         - tasks must feel like real company Jira/ClickUp tickets

        3. TASKS MUST BE REALISTIC:
         - must represent real company engineering work
         - no generic tasks like "learn system"
         - must be actionable, technical and assignable

        -------------------------------------------------
        EXPERIENCE LEVEL RULES
        -------------------------------------------------

        If Intern:
         - simple guided tasks
         - setup, small bug fixes, basic learning implementation

        If Junior:
         - small feature development
         - API integration/API Work
         - bug fixing

        Is Mid:
         - full feature implementation/Development
         - system integration tasks

        If Senior:
         - system Design 
         - architecture design
         - system optimization
         - complex modules

        -------------------------------------------------
         ONBOARDING RULES (VERY IMPORTANT)
        -------------------------------------------------

        If user is new:
        You MUST assign onboarding tasks first such as:
         - environment setup
         - project structure understanding
         - repo understanding
         - repository setup
         - system overview
         - first simple contribution

         Onboarding tasks must be simple but realistic.

        -------------------------------------------------
         DUE DATE RULES
        -------------------------------------------------
        
        You MUST generate a realistic due date based on task complexity.
        you must generate dueDate based on current system date

        CURRENT SYSTEM DATE: ${today}

        This is the ONLY valid reference date.
        All due dates must be calculated from this date.

        rules:
         - onboarding tasks → 1–2 days from today
         - intern tasks → 2–3 days from today
         - junior tasks → 2–4 days from today
         - mid tasks → 3–6 days from today
         - senior tasks → 5–10 days from today

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
         SUBTASK RULES (IMPORTANT)
        -------------------------------------------------

        subTask must reflect actual execution steps.
         - small/simple tasks → 3-5 subtasks
         - medium tasks → 5-7 subtasks
         - large/complex tasks → 7+ subtasks

        Rules:
         - must be actionable steps
         - must align with main task
         - must follow real development workflow
         - no generic steps

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

         - No vague tasks
         - Must sound like real company task
         - No generic learning instructions
         - Must be assignable in sprint planning
         - Must include technical context where needed
         - Must be specific and not abstract

        -------------------------------------------------
         OUTPUT FORMAT (STRICT JSON ONLY)
        -------------------------------------------------

        Return ONLY valid JSON:

         {
          "title": "Task Title",
          "description": "Detailed explanation",
          "priority": "low | normal | high | urgent",
          "tags": ["frontend", "backend"],
          "status": "to do",
          "assignees": ["userId"],
          "dueDate": "YYYY-MM-DD",
          "subTask": [
               {
                  "title": "Subtask title",
                  "completed": false
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
          "projectName": "Project 1",
          "spaceId": "abc123"
          }
        }

        OBSERVATION
          { "type": "observation", "observation": { "projectId": "78909" } }

        PLAN
          { "type": "plan", "data": { "step": "Generate onboarding task based on user details" } }

        OUTPUT
          {
           "type": "output",
              "data": {
                   "title": "Setup Frontend Project",
                   "description": "Initialize project using Vite",
                   "priority": "normal",
                   "tags": ["frontend"],
                   "status": "to do",
                   "assignees": ["userId"],
                   "dueDate": "2026-04-05",
                     "subTask": [
                         { "title": "Install Vite", "completed": false }
                            ],
                      "initialComment":  [
                         {
                            "text": "Short instruction"
                         }
                        ],
                      "activityLogs": [
                          { "action": "task_created", "details": "Task created by AI" }
                            ]
                          "spaceId": "abc123",
                         "projectId": "xyz789"
                          }

        CRITICAL RULE:

         - NEVER generate fake IDs
         - NEVER create your own IDs
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
    const chat = await groqClient.chat.completions.create({

        model: 'moonshotai/kimi-k2-instruct',
        temperature: 0.1,
        messages: messages,  // updated messages yaha push hute rehange(histroy include)
        response_format: {type: 'json_object'}

    }, {

         timeout: 10000 // 20 seconds timeout - if AI takes longer, request will fail

    });

    // step 6 ai ka responce nikalenge usko json me parse karenge
     const result = chat.choices[0]?.message?.content;

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
        // department string extract karke pass kare
        observation = await fn(response.input.department);
        realSpaceId = observation._id; // space ki observation se extract ker di 
    } else if (response.function === "checkOrCreateProject") {
        // project tool me spaceId + projectName chahiye
        observation = await fn(realSpaceId, response.input.projectName);
        realProjectId = observation._id; // project id set
        
    } else {
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