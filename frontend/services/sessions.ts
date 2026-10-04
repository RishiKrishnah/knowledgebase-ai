import axios from "axios";

import { api } from "@/lib/api";
import {
  ChatMessage,
  ChatSession,
  MessageResponse,
  SessionResponse,
} from "@/types/chat";

class SessionService {
  async createSession(
    title: string = "New Chat"
  ): Promise<SessionResponse> {
    try {
      const response =
        await api.post<SessionResponse>(
          "/sessions",
          {
            title,
          }
        );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.detail;

        throw new Error(
          detail ||
            error.message ||
            "Failed to create chat session."
        );
      }

      throw new Error(
        "Failed to create chat session."
      );
    }
  }

  async listSessions(): Promise<SessionResponse[]> {
    try {
      const response =
        await api.get<SessionResponse[]>(
          "/sessions"
        );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.detail;

        throw new Error(
          detail ||
            error.message ||
            "Failed to load chat sessions."
        );
      }

      throw new Error(
        "Failed to load chat sessions."
      );
    }
  }

  async listMessages(
    sessionId: string
  ): Promise<MessageResponse[]> {
    try {
      const response =
        await api.get<MessageResponse[]>(
          `/sessions/${sessionId}/messages`
        );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.detail;

        throw new Error(
          detail ||
            error.message ||
            "Failed to load session messages."
        );
      }

      throw new Error(
        "Failed to load session messages."
      );
    }
  }

  mapSession(
    session: SessionResponse
  ): ChatSession {
    return {
      id: session.id,

      title:
        session.title || "New Chat",

      createdAt:
        session.created_at,

      updatedAt:
        session.created_at,

      messages: [],
    };
  }

  mapMessage(
    message: MessageResponse
  ): ChatMessage {
    return {
      id: message.id,

      role: message.role,

      content: message.content,

      timestamp:
        message.created_at,

      status: "sent",

      intent:
        message.intent ?? undefined,
    };
  }
}

export const sessionService =
  new SessionService();