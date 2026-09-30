"use client";

import { useEffect } from "react";

import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

import { sessionService } from "@/services/sessions";
import { useChatStore } from "@/store/chatStore";

export default function ChatLayout() {
  const {
    sessions,
    sessionsInitialized,
    sessionsLoading,
    setSessions,
    addSession,
    selectSession,
    setSessionsLoading,
    setSessionsInitialized,
  } = useChatStore();

  useEffect(() => {
    if (sessionsInitialized) {
      return;
    }

    async function initializeSessions() {
      setSessionsLoading(true);

      try {
        const serverSessions =
          await sessionService.listSessions();

        const mappedSessions =
          serverSessions.map(
            (session) =>
              sessionService.mapSession(
                session
              )
          );

        if (
          mappedSessions.length > 0
        ) {
          setSessions(
            mappedSessions
          );

          selectSession(
            mappedSessions[0].id
          );
        } else {
          const newSession =
            await sessionService.createSession(
              "New Chat"
            );

          const mappedSession =
            sessionService.mapSession(
              newSession
            );

          addSession(
            mappedSession
          );
        }

        setSessionsInitialized(
          true
        );
      } catch (error) {
        console.error(
          "Failed to initialize chat sessions:",
          error
        );
      } finally {
        setSessionsLoading(
          false
        );
      }
    }

    initializeSessions();
  }, [
    sessionsInitialized,
    setSessions,
    addSession,
    selectSession,
    setSessionsLoading,
    setSessionsInitialized,
  ]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatSidebar />

      <div className="flex-1">
        {sessionsLoading &&
        sessions.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading conversations...
            </p>
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
}