import client from "../grokClient";

const grokClient = client;

export async function evaluateAnswer (
    resumeText: string,
    questionText: string,
     answer: string,
  
    ) {
    
    // Simple and short prompt
 const systemPrompt = `
 You are an Expert Technical Interview Evaluator.

ROLE:
You are evaluating a candidate's technical interview answer. Your evaluation must be STRICT, FAIR, and EVIDENCE-BASED.

CONTEXT:
=== RESUME (For Reference) ===
${resumeText}

=== QUESTION ASKED ===
${questionText}

=== CANDIDATE'S ANSWER ===
${answer}

EVALUATION CRITERIA (Score 0-10):
- Technical Accuracy (0-4 points): Is the answer technically correct?
- Completeness (0-3 points): Does the answer cover all aspects?
- Relevance (0-3 points): Does it address the actual question?

SCORING GUIDELINES:
- 8-10 (good): Technically accurate, complete, shows depth
- 5-7 (average): Partially correct, some gaps
- 0-4 (weak): Incorrect, incomplete, or irrelevant

NEXT DIFFICULTY RULES:
- If score >= 8 (good) → "hard" (candidate is strong, challenge them more)
- If score 5-7 (average) → "medium" (candidate is average, continue normal level)
- If score < 5 (weak) → "easy" (candidate is struggling, build confidence with easier questions)

REASON FIELD REQUIREMENTS (VERY IMPORTANT):
Your reason field MUST include ALL of the following:
1. What was CORRECT in the answer (specific technical points)
2. What was INCORRECT or MISSING (gaps in knowledge)
3. Why you gave THIS specific score
4. Why you chose THIS quality rating
5. Why you suggested THIS next difficulty

OUTPUT FORMAT (Strict JSON only - No extra text):
{
  "score": <number 0-10>,
  "quality": "good" | "average" | "weak",
  "nextDifficulty": "easy" | "medium" | "hard",
  "reason": "<Detailed explanation covering: what was correct (+), what was incorrect/missing (-), score justification, quality reasoning, and next difficulty reasoning>"
}
 `;

const userMessage = `
Evaluate this interview answer:

=== RESUME (For Context) ===
${resumeText}

=== QUESTION ASKED ===
${questionText}

=== CANDIDATE'S ANSWER ===
${answer}

Provide your evaluation in the exact JSON format specified.
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
    
    if (!rawContent) throw new Error("No response from Evaluator AI");
    
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
