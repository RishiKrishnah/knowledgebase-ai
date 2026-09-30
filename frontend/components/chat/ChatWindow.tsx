"use client";

import { useEffect, useRef } from "react";

import { chatService } from "@/services/chat";
import { sessionService } from "@/services/sessions";
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
    createSession,
    addMessage,
    setLoading,
  } = useChatStore();

  const currentSession = sessions.find(
    (session) => session.id === currentSessionId
  );

  const messages = currentSession?.messages ?? [];

  useEffect(() => {
    async function initializeSession() {
      if (currentSessionId) {
        return;
      }

      try {
        const session =
          await sessionService.createSession();

        const now = new Date().toISOString();

        createSession({
          id: session.id,
          title: session.title ?? "New Chat",
          createdAt:
            session.created_at ?? now,
          updatedAt:
            session.updated_at ?? now,
          messages: [],
        });
      } catch (error) {
        console.error(
          "Failed to create chat session:",
          error
        );
      }
    }

    initializeSession();
  }, [currentSessionId, createSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(question: string) {
    if (!currentSessionId) {
      console.error(
        "Cannot send message: no active session"
      );
      return;
    }

    addMessage(currentSessionId, {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
      status: "sent",
    });

    setLoading(true);

    try {
      const response =
        await chatService.sendMessage({
          session_id: currentSessionId,
          question,
        });

      addMessage(currentSessionId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
        status: "sent",
        intent: response.intent,
        latency: response.latency,
        sources: response.sources,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to contact backend.";

      addMessage(currentSessionId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: message,
        timestamp: new Date().toISOString(),
        status: "error",
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