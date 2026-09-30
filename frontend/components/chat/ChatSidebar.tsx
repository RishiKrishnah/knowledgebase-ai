"use client";

import {
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  sessionService,
} from "@/services/sessions";

import {
  useChatStore,
} from "@/store/chatStore";

export default function ChatSidebar() {
  const {
    sessions,
    currentSessionId,
    addSession,
    selectSession,
  } = useChatStore();

  async function handleNewChat() {
    try {
      const session =
        await sessionService.createSession(
          "New Chat"
        );

      const mappedSession =
        sessionService.mapSession(
          session
        );

      addSession(
        mappedSession
      );
    } catch (error) {
      console.error(
        "Failed to create chat session:",
        error
      );
    }
  }

  function handleSelectSession(
    sessionId: string
  ) {
    if (
      sessionId ===
      currentSessionId
    ) {
      return;
    }

    selectSession(
      sessionId
    );
  }

  return (
    <aside className="flex w-72 flex-col border-r bg-card">
      <div className="p-4">
        <Button
          className="w-full"
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet.
          </div>
        ) : (
          sessions.map(
            (session) => (
              <button
                key={session.id}
                type="button"
                onClick={() =>
                  handleSelectSession(
                    session.id
                  )
                }
                className={`w-full rounded-lg p-3 text-left transition ${
                  currentSessionId ===
                  session.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <div className="truncate font-medium">
                  {session.title}
                </div>

                <div className="mt-1 text-xs opacity-70">
                  {session.messages.length}{" "}
                  {session.messages.length ===
                  1
                    ? "message"
                    : "messages"}
                </div>
              </button>
            )
          )
        )}
      </div>
    </aside>
  );
}