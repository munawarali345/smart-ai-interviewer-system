// SSR page

// imports
import { Suspense } from "react";
import AnswerForm from "@/components/InterviewComponents/AnswerForm";
import getInterviewById from "@/lib/api/apiHelper";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: { id: string }; // URL se interviewId
}

// main server component
export default async function InterviewPage(props: PageProps) {
  // params se interviewid nikal lenge
  // Next.js 15 mein params async ho sakta hai
  const { id: interviewId } = await props.params;

  // Agar interviewId nahi mili to error throw karein
  if (!interviewId) {
    throw new Error("Interview ID not found in URL. Please start a new interview.");
  }

  // interviewId k liye SSR fetch 
  // yahin pe backend se data aa jata hai
  // page load se pehle 
  const interview = await getInterviewById(interviewId);
    
  //jsx return
  return (
    <div className="max-w-400 mx-auto ">     

      {/* Show skeleton while AnswerForm loads - better UX than plain text */}
      <Suspense
        fallback={
          <div className="space-y-4 p-4">
            {/* Question placeholder */}
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            {/* Answer box placeholder */}
            <Skeleton className="h-32 w-full" />
            {/* Button placeholder */}
            <Skeleton className="h-10 w-40" />
          </div>
        }
      >
        <AnswerForm initialInterview={interview} />
      </Suspense>
    </div>
  );
}
