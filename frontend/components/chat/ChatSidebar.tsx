"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";
import { sessionService } from "@/services/sessions";

export default function ChatSidebar() {
  const {
    sessions,
    currentSessionId,
    createSession,
    selectSession,
  } = useChatStore();

  async function handleNewChat() {
    try {
      const session =
        await sessionService.createSession();

      const now = new Date().toISOString();

      createSession({
        id: session.id,
        title: session.title ?? "New Chat",
        createdAt: session.created_at ?? now,
        updatedAt: session.updated_at ?? now,
        messages: [],
      });
    } catch (error) {
      console.error(
        "Failed to create chat session:",
        error
      );
    }
  }

  return (
    <aside className="w-72 border-r bg-card">
      <div className="p-4">
        <Button
          className="w-full"
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="space-y-1 px-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() =>
              selectSession(session.id)
            }
            className={`w-full rounded-lg p-3 text-left transition ${
              currentSessionId === session.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="font-medium">
              {session.title}
            </div>

            <div className="text-xs opacity-70">
              {session.messages.length} messages
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}