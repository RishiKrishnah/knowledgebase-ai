"use client";

import { useEffect, useRef } from "react";

import { sendMessage } from "@/services/chat";
import { useChatStore } from "@/store/chatStore";

import ChatMessageItem from "./ChatMessage";
import EmptyState from "./EmptyState";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
  sessions,
  currentSessionId,
  loading,
  addMessage,
  setLoading,
} = useChatStore();

const currentSession = sessions.find(
  (session) => session.id === currentSessionId
);

const messages = currentSession?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(question: string) {
    addMessage(currentSessionId, {
    id: crypto.randomUUID(),
    role: "user",
    content: question,
    timestamp: new Date().toISOString(),
    });

    setLoading(true);

    try {
      const response = await sendMessage({
        session_id: currentSessionId,
        question,
      });

      addMessage(currentSessionId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
        });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">

      <div className="flex-1 overflow-y-auto">

        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-6 p-8">

            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
              />
            ))}

            {loading && <TypingIndicator />}

            <div ref={bottomRef} />

          </div>
        )}

      </div>

      <MessageInput
        loading={loading}
        onSend={handleSend}
      />

    </div>
  );
}