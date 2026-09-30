import { create } from "zustand";

import {
  ChatMessage,
  ChatSession,
} from "@/types/chat";

interface ChatStore {
  sessions: ChatSession[];

  currentSessionId: string;

  loading: boolean;

  createSession: (session: ChatSession) => void;

  selectSession: (id: string) => void;

  addMessage: (
    sessionId: string,
    message: ChatMessage
  ) => void;

  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  sessions: [],

  currentSessionId: "",

  loading: false,

  createSession(session) {
    set((state) => ({
      sessions: [session, ...state.sessions],
      currentSessionId: session.id,
    }));
  },

  selectSession(id) {
    set({
      currentSessionId: id,
    });
  },

  addMessage(sessionId, message) {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              updatedAt: new Date().toISOString(),
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
}));