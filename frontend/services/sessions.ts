import { api } from "@/lib/api";

export interface SessionResponse {
  id: string;
  title: string;
  created_at: string;
}

class SessionService {
  async createSession(
    title: string = "New Chat"
  ): Promise<SessionResponse> {
    const response = await api.post<SessionResponse>("/sessions", {
      title,
    });

    return response.data;
  }
}

export const sessionService = new SessionService();