// Submit Answer service - candidate ka answer submit karta hai
// Yeh answer save karta hai, AI se evaluate karvata hai, aur next question generate karta hai

import Interview from "@/server/models/interview";
import { generateQuestion } from "@/server/lib/ai/grokinterview";
import { evaluateAnswer } from "@/server/lib/ai/evaluateAnswer";


/**
 * submitAnswer - Candidate ka answer submit karta hai
 * @param interviewId - Interview ki ID
 * @param answer - Candidate ka answer
 * @returns next question ya interview completed message
 */
export async function submitAnswer (interviewId: string, answer: string) {
    
    // STEP 1: Database se interview find karte hain
    const interview = await Interview.findById(interviewId);

    // Agar interview nahi mila to error throw karte hain
    if(!interview) throw new Error ("Interview Not Found");

    // Agar interview pehle se completed hai to error throw karte hain
    if (interview.status === "completed") {
        throw new Error("Interview is already completed");
    }

    // STEP 2: Questions check karte hain
    if (interview.questions.length === 0) {
       throw new Error("No questions in this interview");
    };
    
    // Current question (sabse latest) nikalte hain
    const currentQuestion = interview.questions[interview.questions.length - 1];
    
    // Answer aur timestamp save karte hain
    currentQuestion.answerText = answer;
    currentQuestion.answeredAt = new Date();

    // STEP 3: Previous Q&A data banate hain AI ke liye
    // Ye generateQuestion ke liye zaroori hai
    const previousQA = interview.questions
      .filter((q: { answerText?: string }) => q.answerText)        
      .map((q: { questionText: string; answerText?: string; difficulty: string; score: number; nextDifficulty: string}) => ({ 
        question: q.questionText,
        answer: q.answerText,
        difficulty: q.difficulty,
        score: q.score,
        nextDifficulty: q.nextDifficulty
    }));

    // STEP 4: Parallel AI calls - dono ek saath chalte hain (50% faster!)
    const [evaluation, nextQuestion] = await Promise.all([
        // CALL 1: Answer evaluate karo (score, quality, nextDifficulty)
        evaluateAnswer(
            interview.resumeText, 
            currentQuestion.questionText,
            answer
        ),
        
        // CALL 2: Next question generate karo (based on previous Q&A)
        generateQuestion(
            interview.resumeText, 
            JSON.stringify(previousQA)
        )
    ]);

    // STEP 5: Current question ko evaluation results se update karte hain
    currentQuestion.score = evaluation.score;
    currentQuestion.quality = evaluation.quality;
    currentQuestion.nextDifficulty = evaluation.nextDifficulty;
    currentQuestion.reason = evaluation.reason;

    // STEP 6: Check karte hain - kya 5 questions ho gaye?
    const totalQuestions = interview.questions.length;

    if(totalQuestions >= 5){
        // Interview completed - status update karte hain
        interview.status = "completed";
        interview.completedAt = new Date();
        await interview.save();

        return{
            completed: true,
            message: "Interview Completed"
        };
    }

    // STEP 7: Naya question add karte hain interview me
    interview.questions.push({
        questionText: nextQuestion.question,
        difficulty: nextQuestion.difficulty,
    });

    // Database me save karte hain
    await interview.save();

    // Next question return karte hain frontend ko
    return {
        question: nextQuestion.question,
        completed: false
    };

}
