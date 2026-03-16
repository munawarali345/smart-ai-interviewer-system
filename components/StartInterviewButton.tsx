'use client';


import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StartInterviewButtonProps {
    candidateId: string;
}

// Performance: skip re-render if props unchanged
function StartInterviewButton({ candidateId }: StartInterviewButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false); //ui k liye 
    // Ref to track if request is in progress - survives re-renders
    const isRequestInProgress = useRef(false);

    const handleStartInterview = async () => {
        // Step 1: Agar pehle se request chal rahi hai, to return karo
        if (isRequestInProgress.current) {
            return;
        }
        
        // Step 2: Mark request as in progress jub button click huta he
        // Check - kya pehle se chal raha hai? 
        isRequestInProgress.current = true;
        setLoading(true);
        
        try {
            const res = await fetch('/api/interview/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateId }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to start interview');
            }
            
            // Step 3: Interview page pe redirect karo
            router.push(`/interview/${data.data.interviewId}`);
            
        } catch (error) {
            // Step 4: Error aaya - loading hatao
            toast.error('Failed to start interview. Please try again.');
            isRequestInProgress.current = false; // jab error ata he false huga take user again try ker sake
            setLoading(false);
        }
        // Note: Success case me hum loading ko false nahi karte
        // kyunki navigation ho jata hai aur naya page load hota hai
    };

    return (
        <Button 
            onClick={handleStartInterview}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400"
        >
            {loading ? (
                // Jab loading true ho to ye chale
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Starting...
                </>
            ) : (

                // Jab loading false ho to ye 
                <>
                    <Play size={20} />
                    Start Interview
                </>
            )}
        </Button>
    );
}

// Performance: react.memo use kia he ye karega skip re-render if props unchanged
export default React.memo(StartInterviewButton);
