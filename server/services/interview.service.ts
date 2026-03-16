// Interview service - interview start karne ka logic
// Yeh service naya interview create karti hai aur AI se question generate karti hai

import Candidate from "@/server/models/candidate";
import { generateQuestion } from "@/server/lib/ai/grokinterview";
import Interview from "@/server/models/interview";
import { connectDB } from "@/server/lib/db";
import logger from "@/server/lib/logger";

/**
 * startInterview - Naya interview create karta hai
 * @param candidateId - Candidate ki ID jiska interview start karna hai
 * @returns interviewId aur pehla question
 */
export async function startInterview(candidateId: string) {
    
    // Step 1: Database connect karte hain
    await connectDB();
    
    // Step 2: Candidate ko find karte hain using ID
    const candidate = await Candidate.findById(candidateId);

    // Step 3: Validation - agar candidate nahi mila to error throw karte hain
    if(!candidate){
        throw new Error("Candidate not found")
    };

    // Step 4: Interview start log karte hain
    logger.info('Starting interview', { candidateId });

    // Step 5: AI ko resume text bhejte hain aur question generate karvate hain
    const aiResponse = await generateQuestion(candidate.resumeText);

    // Step 6: AI response validate karte hain
    if (!aiResponse || !aiResponse.question || !aiResponse.difficulty) {
        logger.error('Invalid AI Response', { aiResponse });
        throw new Error("AI failed to generate a valid question. Please try again.");
    }

    // Step 7: Interview document create karte hain database me
    const interview = await Interview.create({
        candidateId,
        resumeText: candidate.resumeText,
        questions: [{
            questionText: aiResponse.question,
            difficulty:   aiResponse.difficulty,
        }],
    });

    // Step 8: Interview ID aur question return karte hain
    return {
        interviewId: interview._id,
        question:    aiResponse.question,
    };

}
