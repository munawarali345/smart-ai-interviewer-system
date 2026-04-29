"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { addComment } from "@/lib/api/addComments";


interface AddCommentPayload {
  taskId: string;
  userId: string;
};


export default function CommentBox( {taskId, userId}: AddCommentPayload  ) {

  const [text, setText] = useState("");

  // loading state for send button
  const [loading, setLoading] = useState(false);  // API call ke time loading show karne ke liye

  const handleSend = async () => {
    if (!text.trim()) return;

      if (!userId) return; // task null check


      setLoading(true);  // loading start

    try {
      // API call karo comment add karne ke liye
      await addComment({ taskId, comment: text, userId });
      
      // success pe text clear karo
      setText("");
      
      // // callback call karo (task refetch ke liye, feed update ke liye)
      // onCommentAdded();

    } catch (error) {
      // error handle karo
      console.error("Error adding comment:", error);

      alert("Failed to add comment. Please try again.");

    } finally {

      // loading end
      setLoading(false);

    }

  };

  return (
    <div className="space-y-2"> {/* spacing ke liye */}

      {/* TEXTAREA for comment input */}
      <Textarea
        placeholder="Write a comment..."
        value={text} // controlled value
        onChange={(e) => setText(e.target.value)} // change handler
        className="resize-none" // resize disable
        disabled={loading || !userId}  // loading me disable karo
      />

      {/* BUTTON ROW */}
      <div className="flex justify-end">

        <Button size="sm" 
          onClick={handleSend}
          disabled={loading || !userId}  // loading me disable
          className="gap-2"
         >

          <Send className="w-4 h-4" /> {/* send icon */}

           {loading ? "Sending..." : "Send"}  {/* dynamic text */}

        </Button>

      </div>

    </div>
  );
}