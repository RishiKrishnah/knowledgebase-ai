"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  onSend: (message: string) => void;
}

export default function MessageInput({
  loading,
  onSend,
}: Props) {
  const [message, setMessage] = useState("");

  function submit() {
    const text = message.trim();

    if (!text || loading) return;

    onSend(text);

    setMessage("");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key !== "Enter") return;

    if (e.shiftKey) return;

    e.preventDefault();

    submit();
  }

  return (
    <div className="border-t bg-background p-6">

      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-card p-3 shadow-sm">

        <TextareaAutosize
          value={message}
          minRows={1}
          maxRows={8}
          placeholder="Message KnowledgeBase AI..."
          className="flex-1 resize-none border-0 bg-transparent outline-none focus-visible:ring-0"
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <Button
          onClick={submit}
          disabled={!message.trim() || loading}
          size="icon"
        >
          <SendHorizonal size={18} />
        </Button>

      </div>

    </div>
  );
}