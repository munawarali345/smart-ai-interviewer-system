'use client'

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import StartInterviewButton from "./StartInterviewButton";

// main resume upload function
function ResumeFileUpload(){

    // uploading state → button disable + loading UI
    const [isUploading, setIsUploading] = useState(false);

     // file input ko manually trigger karne ke liye ref
    const inputRef = useRef<HTMLInputElement | null>(null);

        // backend se aane wala candidate ID store hoga
    const [candidateId, setCandidateId] = useState<string | null>(null);

    // button click → hidden input open
    const handleClick = () =>{
        inputRef.current?.click();
    };

    // file select hone par ye function run hota hai
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{

        // selected file get karo
        const file = e.target.files?.[0];
        if(!file) return;

        // allowed file types (security + validation)
        const allowedTypes = [
            "application/pdf", 
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        // invalid file type reject
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

        // UI loading start
        setIsUploading(true);

        // form-data create (file upload ke liye required)
        // ek empty “parcel box” ban gaya
        const formData = new FormData();

        // backend key: "resume"
        // Backend me isi naam se file receive hogi
        formData.append("resume", file)

        // backend API call (resume upload endpoint)
        try{
            const res = await fetch('/api/resume',{
                method: 'POST',
                body: formData,
            });

            // agar response fail ho jaye
            if(!res.ok) throw new Error(res.statusText);

             // backend response parse
            const data = await res.json();
            
            // candidate ID store (interview start ke liye use hoga)
            setCandidateId(data.candidate.id);
            
            toast.success("Resume uploaded successfully!");

        } catch (err){
            // error handling
            toast.error("Error uploading resume. Try again.");

        } finally {

            // loading off
            setIsUploading(false);
        }
    }; 


    // main UI part
    return (

        <div className="flex flex-col items-center justify-center h-full p-4 bg-white rounded shadow border border-gray-200">

            {/* hidden file input */}
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={inputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* upload button */}
            <Button
                onClick={handleClick}
                className="flex items-center gap-2"
                disabled={isUploading || !!candidateId}
            >
                <Upload size={20} />

                {/* dynamic button text */}
                {isUploading ? "Uploading..." : candidateId ? "Uploaded ✓" : "Upload Resume"}

            </Button>

            {/* upload ke baad interview start button show hota hai */}
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
