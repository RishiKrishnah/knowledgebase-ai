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

    let cancelled = false;

    async function initializeSessions() {
      setSessionsLoading(true);

      try {
        /*
         * Load existing sessions from the backend.
         *
         * listSessions() already returns:
         * Promise<SessionResponse[]>
         */
        const serverSessions =
          await sessionService.listSessions();

        if (cancelled) {
          return;
        }

        /*
         * Convert backend sessions into
         * frontend ChatSession objects.
         */
        const mappedSessions =
          serverSessions.map((session) =>
            sessionService.mapSession(session)
          );

        /*
         * Existing sessions found.
         */
        if (mappedSessions.length > 0) {
          setSessions(mappedSessions);

          /*
           * Select the newest session.
           * The backend returns sessions ordered
           * by created_at descending.
           */
          selectSession(mappedSessions[0].id);
        } else {
          /*
           * No sessions exist yet.
           * Create the first persistent session.
           */
          const newSession =
            await sessionService.createSession(
              "New Chat"
            );

          if (cancelled) {
            return;
          }

          const mappedSession =
            sessionService.mapSession(
              newSession
            );

          addSession(mappedSession);
        }

        /*
         * Initialization succeeded.
         */
        setSessionsInitialized(true);
      } catch (error) {
        /*
         * Do NOT silently create another session here.
         *
         * If GET /sessions or POST /sessions fails,
         * we want the actual error visible in the
         * browser console.
         */
        console.error(
          "Failed to initialize chat sessions:",
          error
        );

        /*
         * Keep initialization false so the application
         * does not pretend that a valid session exists.
         */
        setSessionsInitialized(false);
      } finally {
        if (!cancelled) {
          setSessionsLoading(false);
        }
      }
    }

    initializeSessions();

    return () => {
      cancelled = true;
    };
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
        {sessionsLoading && sessions.length === 0 ? (
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