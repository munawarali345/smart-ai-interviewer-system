// Review AI Agent Service
// Yeh service task review ke liye AI model ko call karti hai

import {
  ReviewAgentPayload,
  ReviewAgentResponse,
} from "@/types/reviewAgent.type";

import { openRouterClient } from "@/server/lib/openRouter";


// Review AI function
export const reviewTaskWithAI = async (
  payload: ReviewAgentPayload
): Promise<ReviewAgentResponse> => {

  // ================= SYSTEM PROMPT =================
  // AI ko role aur behavior define kar rahe hain

  const systemPrompt = `
You are a professional AI task review agent.

Your responsibility:
- Review submitted task work carefully
- Analyze subtasks completion (list which are done)
- Analyze attachments/proof
- Analyze comments
- Analyze time tracking
- Detect incomplete or fake work
- Decide PASS or FAIL professionally

Rules:
- PASS only if work is properly completed
- FAIL if important work is missing
- Give short technical reason
- Give missing items list
- Give helpful feedback
- Return ONLY valid raw JSON.
- Do not use markdown.
- Do not use code blocks.
- Do not explain anything.

Always return valid JSON only.

Response format:

{
  "decision": "PASS or FAIL",
  "reason": "short reason including subtasks status",
  "missingItems": [],
  "feedback": "helpful feedback"
  "confidence": 95 

}
`;



  // ================= USER PROMPT =================
  // Actual task context AI ko yahan diya ja raha hai

  const userPrompt = `

        TASK REVIEW DATA

         ${JSON.stringify(payload, null, 2)}
     `;

     const messages = [ // (properly typed)

          {role: 'system', content: systemPrompt }, // System prompt add core brain (rules, example)
          {role: 'user', content: userPrompt }, // User query add (initial)
     ];

     //  OPENROUTER CALL (REPLACED GROQ)
         const chat = await openRouterClient(messages, "poolside/laguna-xs.2:free");


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

    console.log("Raw AI response:", result);
    
    if (!result) throw new Error("No response from AI");  // Error if no response
    
   try {

  // AI JSON response ko object me convert karo
  const response: ReviewAgentResponse =
    JSON.parse(result);

  // Final parsed response return karo
  return response;

} catch (parseError) {

  // Parse fail hua to error log karo
  console.error("JSON parse error:", parseError);

  // Custom error throw karo
  throw new Error("Invalid AI response format");
}

};