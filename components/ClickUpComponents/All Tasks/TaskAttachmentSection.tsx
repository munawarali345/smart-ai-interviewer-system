// ye task attachment section he yaa sara uploas wala kam hu raha he 

import React, { useRef, useState } from 'react';
import { Paperclip, Upload, FileText, Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { toast } from "sonner";
import API_URL from '@/config/api';


// ================================
// Props interface
// taskId → kis task ke attachments hain
// assignees → task ke users (populated)
// ================================
type Props = {
  taskId: string;
  assignees: any[]; 
};

// ================================
// Main Component
// Attachment upload + UI handling
// ================================
export default function TaskAttachmentsSection( {taskId, assignees}: Props ) {

   // file input ko manually open karne ke liye reference
  const inputRef = useRef<HTMLInputElement>(null);

  // selected files ka state (frontend memory only)
  const [files, setFiles] = useState<File[]>([]);

  // button click → hidden input open
    const handleClick = () =>{
        inputRef.current?.click();
    };

  // MAIN FUNCTION: jab user files select karta hai
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     
         // selected file get karo
        //  Convert FileList into normal array
        // FileList (not array) → array me convert
        const fileSelected = Array.from(e.target.files || []) as File[];

        // If no file selected, stop here
        // agar koi file nahi aayi to retrun yahi se
        if(!fileSelected) {

           toast.error("No files selected");

            return;
        };

         // LOOP #1: validation loop (har file check karna)
         // check each file before upload
    for (let file of fileSelected) {

      // example validation: file size check
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 20MB)`);
        return; // stop whole process if invalid file found
      }
    };

    // UI update (optimistic rendering)
    // Add new files to UI list (so user sees them immediately)
    // react state me set hu rahi he ui per show krenge is se jo file select karenge 
    setFiles((prev) => [...prev, ...fileSelected]);

    // Create FormData to send files to backend (file upload container)
    const formData = new FormData();

     // LOOP #2: append loop
    //  yaha har file ko formData me attach kar rahe hain
     fileSelected.forEach((file) => {

      /*
        WHY LOOP HERE?

        FormData ek "key-value" structure hai.
        Agar multiple files bhejni hain to same key repeat hoti hai:

        attachments: file1
        attachments: file2
        attachments: file3
      */

      formData.append("attachments", file);

    });

    // taskId attach kar rahe hain taake backend ko pata ho file kis task ki hai
    formData.append("taskId", taskId);

    // yaha hum uploadedBy ka kam kar raha he k ye upload kis ne kia he 
    // abi k lie ase kar raha he temprory jub auth system lagega to us se handle huga ye kam
    const selectedUser = assignees?.[0];

    formData.append("uploadedById", selectedUser._id);
    formData.append("uploadedByName", selectedUser.name);
    
  
     try {

         //  Upload API call
         const res = await fetch(`${API_URL}/api/tasks/attachments`, {
            method: "POST",
            body: formData,
         });

         //  If server fails
          if (!res.ok) {
           toast.error("Failed to upload attachments");
           return;
         }

          const data = await res.json();

          //  Success message
           toast.success("Attachments uploaded successfully");

          console.log("Uploaded:", data);

        } catch (err) {

         // Network / server error
         toast.error("Something went wrong while uploading");

       }

     };
 


  // remove file from UI only (frontend state)
  const removeFile = (index: number) => {

    setFiles((prev) => prev.filter((_, i) => i !== index));

    toast.success("File removed");
  };


  //  file type ke hisaab se icon select karna
  const iconFor = (name: string) => {

    //  image files check
    if (/png|jpg|jpeg|gif|webp/i.test(name)) {
      return <ImageIcon className="w-4 h-4" />;
    }

    //  default file icon
    return <FileText className="w-4 h-4" />;

  };

  return (
        
    <div className='mt-6 border border-gray-200 rounded-2xl bg-white p-4'>

        {/* HEADER SECTION */}
      <div className='flex items-center gap-2 mb-4'>

        <Paperclip className='w-4 h-4 text-gray-500' />

        <h3 className='text-sm font-semibold text-gray-800'>
            Attachments
        </h3>

      </div>

        {/* hidden file input */}
      <input ref={inputRef} type='file' multiple className='hidden' onChange={handleFileChange} />

        {/* UPLOAD Button */}
      <button onClick={handleClick} className='w-full border border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition flex flex-col items-center gap-2'>

        <Upload className='w-5 h-5 text-gray-500' />

        <span className='text-sm text-gray-700'>Upload files or drag & drop</span>

        <span className='text-xs text-gray-400'>PNG, JPG, PDF, DOCX, ZIP</span>

      </button>

        {/* FILE LIST SECTION */}
      <div className='mt-4 space-y-2'>

        {/*  CONDITIONAL RENDERING */}
        {files.length === 0 ? (

          <p className='text-sm text-gray-500'>
            No attachments yet
          </p>

         // LOOP #3: UI rendering loop
         //  har file ko UI me show karna
        ) : files.map((file, index) => (

          <div key={index} className='flex items-center justify-between gap-3 p-3 
          rounded-xl border border-gray-200 hover:bg-gray-50'>

            {/* LEFT SIDE: file info */}
            <div className='flex items-center gap-3 min-w-0'>

                {/* icon based on file type */}
              <div className='p-2 bg-gray-100 rounded-lg'>

                {iconFor(file.name)}

            </div>

              <div className='min-w-0'>

               <p className='text-sm font-medium text-gray-800 truncate'>{file.name}</p>

                <p className='text-xs text-gray-500'>{(file.size / 1024).toFixed(1)} 
                    KB
                </p>

              </div>

            </div>

            {/* RIGHT SIDE: actions */}
            <div className='flex items-center gap-2'>

               {/* download (UI only for now) */}
              <button className='p-2 rounded-lg hover:bg-gray-100'>

                <Download className='w-4 h-4 text-gray-500' />

              </button>
              
              {/* delete file */}
              <button onClick={() => removeFile(index)} 
              className='p-2 rounded-lg hover:bg-red-50'>
                
                <Trash2 className='w-4 h-4 text-red-500' />
              
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
