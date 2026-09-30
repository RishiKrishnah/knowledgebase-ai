import { AxiosError } from "axios";

import { api } from "@/lib/api";

import {
  ChatRequest,
  ChatResponse,
  ApiError,
} from "@/types/chat";

class ChatService {
  async sendMessage(
    request: ChatRequest
  ): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>(
        "/chat",
        request
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      const message =
        err.response?.data?.detail ??
        err.response?.data?.message ??
        err.message ??
        "Unable to contact backend.";

      throw new Error(message);
    }
  }
}

export const chatService = new ChatService();