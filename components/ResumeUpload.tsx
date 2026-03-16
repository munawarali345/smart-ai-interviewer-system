'use client'

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import StartInterviewButton from "./StartInterviewButton";

// Performance: skip re-render if props unchanged
function ResumeFileUpload(){
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [candidateId, setCandidateId] = useState<string | null>(null);

    const handleClick = () =>{
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if(!file) return;

        const allowedTypes = [
            "application/pdf", 
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        
        if(!allowedTypes.includes(file.type)){
            toast.error("Only PDF / DOC / DOCX files allowed");
            return;
        };

        // File size validation (max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        };

        setIsUploading(true);

        const formData = new FormData();
        formData.append("resume", file)

        try{
            const res = await fetch('/api/resume',{
                method: 'POST',
                body: formData,
            });

            if(!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            
            // Set candidate ID from response
            setCandidateId(data.candidate.id);
            
            toast.success("Resume uploaded successfully!");

        } catch (err){
            toast.error("Error uploading resume. Try again.");
        } finally {
            setIsUploading(false);
        }
    }; 

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-white rounded shadow border border-gray-200">
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={inputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            <Button
                onClick={handleClick}
                className="flex items-center gap-2"
                disabled={isUploading || !!candidateId}
            >
                <Upload size={20} />
                {isUploading ? "Uploading..." : candidateId ? "Uploaded ✓" : "Upload Resume"}
            </Button>

            {candidateId && (
                <div className="mt-4">
                    <StartInterviewButton candidateId={candidateId} />
                </div>
            )}

            <p className="text-gray-500 text-xs mt-2">
                Only PDF / DOC / DOCX files supported (max 5MB)
            </p>
        </div>
    );
}

export default ResumeFileUpload;
