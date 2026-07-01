"use client";

import MarkdownRenderer from "./MarkdownRenderer";
import { ChatMessage } from "@/types/chat";

interface Props {
  message: ChatMessage;
}

export default function ChatMessageItem({
  message,
}: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-4xl rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-card"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <MarkdownRenderer
            content={message.content}
          />
        )}
      </div>
    </div>
  );
}