import client from "../grokClient";

const grokClient = client;

export async function generateQuestion (resumeText: string, previousQA: string = "[]") {
    
    // Simple and short prompt
 const systemPrompt = `
You are a Senior AI Technical Interviewer conducting a real MERN Stack interview.

You must generate ONE technical interview question at a time.

-----------------------------
CANDIDATE RESUME TEXT
-----------------------------
${resumeText}

-----------------------------
PREVIOUS QUESTIONS & ANSWERS (WITH EVALUATION)
-----------------------------
${previousQA}

FOLLOW-UP PRIORITY RULE:

When generating a question:

1. FIRST try to create a follow-up question from the LAST answer.

A follow-up may include:
- deeper concept explanation
- implementation details
- performance considerations
- edge cases
- real-world scenario

2. If follow-up is NOT possible → generate a new question from resume.

-----------------------------
IMPORTANT INSTRUCTIONS
-----------------------------

1. Carefully read the candidate resume above.
2. All questions MUST come from the resume content.
3. Do NOT invent technologies that are not present in the resume.
4. Questions may come from:
   - skills
   - projects
   - work experience
   - tools
   - responsibilities
   - technologies
5. Avoid repeating previous questions listed above.
6. This is a MERN stack interview, so focus on web development topics if they appear in the resume.

-----------------------------
QUESTION GENERATION RULES
-----------------------------

• Generate EXACTLY ONE interview question  
• Question must be technical  
• Question must be relevant to the candidate resume  
• Question must NOT repeat previous questions  

-----------------------------
DIFFICULTY RULES (Use from previousQA)
-----------------------------

- Each previous answer comes with a 'nextDifficulty' field
- DO NOT evaluate the answer yourself - use the nextDifficulty that was provided
- The nextDifficulty was already calculated by the evaluator AI

If nextDifficulty = "easy" → use "easy"  
If nextDifficulty = "medium" → use "medium"  
If nextDifficulty = "hard" → use "hard"

-----------------------------
DIFFICULTY DEFINITIONS
-----------------------------

easy:
- basic definitions
- simple concept explanation
- beginner level

medium:
- practical usage
- implementation questions
- small scenarios

hard:
- architecture questions
- performance optimization
- security
- edge cases
- debugging scenarios

If no previous answers exist → use "medium"

-----------------------------
STRICT OUTPUT FORMAT
-----------------------------

Return ONLY a JSON object.

No explanation.
No markdown.
No extra text.

Output format:

{
 "question": "Interview question based on resume",
 "difficulty": "easy | medium | hard"
}
 `;

const userMessage = `
Resume: ${resumeText}

Previous Q&A: ${previousQA}

Generate one technical interview question. Return JSON only.
`;

    const completion = await grokClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
    }, {
        timeout: 10000 // 10 seconds timeout - if AI takes longer, request will fail
    });
    
    const rawContent = completion.choices[0]?.message?.content;
    
    if (!rawContent) throw new Error("No response from AI");
    
    let result;
try {
    result = JSON.parse(rawContent);
} catch {
    // Agar invalid chars aayen ya extra text, sirf JSON part extract karo
    const startIdx = rawContent.indexOf("{");
    const endIdx = rawContent.lastIndexOf("}");
    result = JSON.parse(rawContent.substring(startIdx, endIdx + 1));
}

   return result;
}







// IMPORTANT - USE THIS LOGIC:

// 1. For EACH previous answer, check if a follow-up question can be asked:
//    - If candidate mentioned a technology/concept, ask deeper about it
//    - If candidate gave incomplete answer, ask them to elaborate
//    - If candidate gave example, ask about edge cases

// 2. If NO follow-up possible from previous answers → generate new question from resume using nextDifficulty level