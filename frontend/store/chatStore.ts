import { create } from "zustand";
import {
  ChatMessage,
  ChatSession,
} from "@/types/chat";

interface ChatStore {
  sessions: ChatSession[];

  currentSessionId: string;

  loading: boolean;

  createSession: () => void;

  selectSession: (id: string) => void;

  addMessage: (
    sessionId: string,
    message: ChatMessage
  ) => void;

  setLoading: (loading: boolean) => void;
}

function newSession(): ChatSession {
  const id = crypto.randomUUID();

  return {
    id,
    title: "New Chat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
}

const first = newSession();

export const useChatStore = create<ChatStore>((set) => ({
  sessions: [first],

  currentSessionId: first.id,

  loading: false,

  createSession() {
    const session = newSession();

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
              messages: [...session.messages, message],
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