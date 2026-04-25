"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function CommentBox() {

  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    console.log("Send comment:", text);

    setText("");
  };

  return (
    <div className="space-y-2">

      {/* TEXTAREA */}
      <Textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="resize-none"
      />

      {/* BUTTON ROW */}
      <div className="flex justify-end">

        <Button size="sm" onClick={handleSend} className="gap-2">
          <Send className="w-4 h-4" />
          Send
        </Button>

      </div>

    </div>
  );
}