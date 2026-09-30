"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  chatService,
} from "@/services/chat";

import {
  sessionService,
} from "@/services/sessions";

import {
  useChatStore,
} from "@/store/chatStore";

import ChatMessageItem from "./ChatMessage";
import EmptyState from "./EmptyState";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSessionId,
    loading,
    messagesLoading,
    addMessage,
    setLoading,
    setMessagesLoading,
    setSessionMessages,
  } = useChatStore();

  const currentSession =
    sessions.find(
      (session) =>
        session.id ===
        currentSessionId
    );

  const messages =
    currentSession?.messages ?? [];

  /*
   * Load messages from the backend
   * whenever the active session changes.
   */
  useEffect(() => {
    if (!currentSessionId) {
      return;
    }

    async function loadMessages() {
      setMessagesLoading(true);

      try {
        const serverMessages =
          await sessionService.listMessages(
            currentSessionId
          );

        const mappedMessages =
          serverMessages.map(
            (message) =>
              sessionService.mapMessage(
                message
              )
          );

        setSessionMessages(
          currentSessionId,
          mappedMessages
        );
      } catch (error) {
        console.error(
          "Failed to load session messages:",
          error
        );
      } finally {
        setMessagesLoading(
          false
        );
      }
    }

    loadMessages();
  }, [
    currentSessionId,
    setMessagesLoading,
    setSessionMessages,
  ]);

  /*
   * Keep the chat scrolled to the
   * latest message.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    messages,
    loading,
  ]);

  async function handleSend(
    question: string
  ) {
    if (!currentSessionId) {
      console.error(
        "Cannot send message: no active session."
      );

      return;
    }

    const timestamp =
      new Date().toISOString();

    const temporaryUserMessage = {
      id: crypto.randomUUID(),

      role: "user" as const,

      content: question,

      timestamp,

      status: "sent" as const,
    };

    addMessage(
      currentSessionId,
      temporaryUserMessage
    );

    setLoading(true);

    try {
      const response =
        await chatService.sendMessage(
          {
            session_id:
              currentSessionId,

            question,
          }
        );

      addMessage(
        currentSessionId,
        {
          id: crypto.randomUUID(),

          role: "assistant",

          content:
            response.answer,

          timestamp:
            new Date().toISOString(),

          status: "sent",

          intent:
            response.intent,

          latency:
            response.latency,

          sources:
            response.sources,
        }
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to contact backend.";

      addMessage(
        currentSessionId,
        {
          id: crypto.randomUUID(),

          role: "assistant",

          content: message,

          timestamp:
            new Date().toISOString(),

          status: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {messagesLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading conversation...
            </p>
          </div>
        ) : messages.length ===
          0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-6 p-8">
            {messages.map(
              (message) => (
                <ChatMessageItem
                  key={
                    message.id
                  }
                  message={
                    message
                  }
                />
              )
            )}

            {loading && (
              <TypingIndicator />
            )}

            <div
              ref={bottomRef}
            />
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