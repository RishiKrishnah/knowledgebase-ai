import { create } from "zustand";

import {
  ChatMessage,
  ChatSession,
} from "@/types/chat";

interface ChatStore {
  sessions: ChatSession[];

  currentSessionId: string;

  loading: boolean;

  sessionsLoading: boolean;

  messagesLoading: boolean;

  sessionsInitialized: boolean;

  setSessions: (
    sessions: ChatSession[]
  ) => void;

  addSession: (
    session: ChatSession
  ) => void;

  selectSession: (
    id: string
  ) => void;

  setSessionMessages: (
    sessionId: string,
    messages: ChatMessage[]
  ) => void;

  addMessage: (
    sessionId: string,
    message: ChatMessage
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  setSessionsLoading: (
    loading: boolean
  ) => void;

  setMessagesLoading: (
    loading: boolean
  ) => void;

  setSessionsInitialized: (
    initialized: boolean
  ) => void;
}

export const useChatStore =
  create<ChatStore>((set) => ({
    sessions: [],

    currentSessionId: "",

    loading: false,

    sessionsLoading: false,

    messagesLoading: false,

    sessionsInitialized: false,

    setSessions(sessions) {
      set({
        sessions,
      });
    },

    addSession(session) {
      set((state) => ({
        sessions: [
          session,
          ...state.sessions,
        ],

        currentSessionId:
          session.id,
      }));
    },

    selectSession(id) {
      set({
        currentSessionId: id,
      });
    },

    setSessionMessages(
      sessionId,
      messages
    ) {
      set((state) => ({
        sessions:
          state.sessions.map(
            (session) =>
              session.id === sessionId
                ? {
                    ...session,

                    messages,

                    updatedAt:
                      messages.length > 0
                        ? messages[
                            messages.length - 1
                          ].timestamp
                        : session.updatedAt,
                  }
                : session
          ),
      }));
    },

    addMessage(
      sessionId,
      message
    ) {
      set((state) => ({
        sessions:
          state.sessions.map(
            (session) =>
              session.id === sessionId
                ? {
                    ...session,

                    updatedAt:
                      message.timestamp,

                    messages: [
                      ...session.messages,
                      message,
                    ],
                  }
                : session
          ),
      }));
    },

    setLoading(loading) {
      set({
        loading,
      });
    },

    setSessionsLoading(
      loading
    ) {
      set({
        sessionsLoading:
          loading,
      });
    },

    setMessagesLoading(
      loading
    ) {
      set({
        messagesLoading:
          loading,
      });
    },

    setSessionsInitialized(
      initialized
    ) {
      set({
        sessionsInitialized:
          initialized,
      });
    },
  }));