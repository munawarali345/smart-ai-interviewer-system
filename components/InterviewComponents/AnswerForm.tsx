'use client'

// imports
// Performance: skip re-render if props unchanged
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API_URL from "@/config/api";

import { Bot, ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


// interfaces
interface Question {
  questionText: string;
  answerText?: string;
};

interface InterviewData {
  _id: string;
  questions: Question[];
  status: string;
};

// props interface
interface AnswerFormProps {
  initialInterview: InterviewData;
};

// main component function
// Performance: skip re-render if props unchanged
function AnswerForm({initialInterview}: AnswerFormProps){
    const router = useRouter(); 

    // clint side state hydiration 
    const [interview, setInterview] = useState(initialInterview);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // main submit answer component function
    // Input sanitization: trim whitespace and validate
    const handleSubmitAnswer = async () => {
      
        // Step 1: Trim the answer to remove extra spaces
        const sanitizedAnswer = answer.trim();
        
        // Step 2: Check if empty after trimming
        if(!sanitizedAnswer) {
            toast.error("Please enter an answer before submitting.");
            return;
        }
        
        setSubmitting(true);
        

    try{
        const res = await fetch(`${API_URL}/api/interview/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ interviewId: interview._id, answer: sanitizedAnswer}),
        });

        if(!res.ok) {
            throw new Error ("Failed to submit");
        }

        const data = await res.json();

        setInterview((prev) => {
            if (!prev) return prev;
            const updatedQuestions = [...prev.questions];
            updatedQuestions[updatedQuestions.length - 1].answerText = answer;

            if(data.data?.question){
                updatedQuestions.push({ questionText: data.data.question });
            }

            return {
                ...prev,
                questions: updatedQuestions,
                status: data.data?.completed ? "completed" : prev.status,
            };
        });

        setAnswer("");

        if(data.data?.completed){
            toast.success("Interview Completed! Well done.");
            router.push("/");
        };

    }  catch (err) {
        toast.error("Failed to submit answer. Please try again.");
    } finally {
       setSubmitting(false);
    }     
  };

    // JSX work start form here
    return (
  <main className="min-h-screen bg-gray-50">
      {/* Header with black background and radius on all corners */}
      <header className="bg-black shadow-lg rounded-[15px] mx-4 mt-4">
          <div className="max-w-500 mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

             {/* Center - AI Interview title */}
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-full shadow">
                   <Bot className="h-6 w-6 text-black" />
                 </div>
                 <div>
                   <h1 className="text-xl font-bold text-white tracking-wide">AI Interview</h1>
                   <p className="text-xs text-gray-400">
                     Question {interview.questions.length}
                   </p>
                 </div>
              </div>
              
              {/* Left side - empty */}
              <div className="w-24" />

              {/* right side - Back button */}
              <div className="w-24 flex justify-end">
              <Button
               onClick={() => router.back()}
                 variant="ghost"
                 size="sm"
                 className="text-white hover:text-gray-300 hover:bg-gray-800 flex items-center gap-2"
               >
                <ArrowLeft className="h-5 w-5" /> Back
                 
              </Button>
              </div>
          </div>
          </div>
      </header>

       <div className="max-w-240 mx-auto px-4 py-8 space-y-6">
         {/* Map all questions */}
         {interview.questions.map((q, idx) => (
           <div key={idx} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-3">
                <h2 className="text-lg font-semibold text-white">Question {idx + 1}</h2>
            </div>
              <div className="p-6 space-y-4">
              <p className="text-lg text-gray-800 whitespace-pre-wrap">{q.questionText}</p>
             {q.answerText && (
                 <div className="bg-gray-100 p-4 rounded-lg text-gray-700 border-l-4 border-black">
                   <strong className="text-black">Your Answer:</strong> {q.answerText}
                 </div>
               )}
             </div>
           </div>
         ))}

         {/* Input only if interview not completed */}
         {interview.status !== "completed" && (
           <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-3">
              <h2 className="text-lg font-semibold text-white">Your Answer</h2>
             </div>
             <div className="p-6 space-y-4">
               <Textarea
                 value={answer}
                 onChange={(e) => setAnswer(e.target.value)}
                 placeholder="Type your answer here..."
                 className="min-h-[200px] border-2 border-gray-200 focus:border-black focus:ring-gray-300"
                 disabled={submitting}
               />

               <div className="flex justify-end">
                 <Button
                   onClick={handleSubmitAnswer}
                   disabled={submitting || !answer.trim()}
                   className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                 >
                   {submitting ? (
                     <>
                       <Loader2 className="h-4 w-4 animate-spin" />
                       Submitting...
                     </>
                   ) : (
                     <>
                       <Send className="h-4 w-4" />
                       Submit Answer
                     </>
                   )}
                 </Button>
               </div>
             </div>
           </div>
         )}
       </div>
  </main>
  )
}

// Performance: skip re-render if props unchanged (initialInterview)
export default React.memo(AnswerForm);
