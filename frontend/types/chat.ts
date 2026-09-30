export type MessageRole = "user" | "assistant";

export type ChatIntent =
  | "CHAT"
  | "DOCUMENT"
  | "DATABASE"
  | "UNKNOWN";

export type MessageStatus =
  | "sending"
  | "sent"
  | "error";

export interface SourceReference {
  id: string;
  title: string;
  score?: number;
  page?: number;
  chunk_id?: string;
}

export interface ChatMessage {
  id: string;

  role: MessageRole;

  content: string;

  timestamp: string;

  status: MessageStatus;

  intent?: ChatIntent;

  latency?: number;

  sources?: SourceReference[];
}

export interface ChatSession {
  id: string;

  title: string;

  createdAt: string;

  updatedAt: string;

  messages: ChatMessage[];
}

export interface ChatRequest {
  session_id: string;

  question: string;
}

export interface ChatResponse {
  answer: string;

  intent: ChatIntent;

  sources?: SourceReference[];

  latency?: number;
}

export interface ApiError {
  detail?: string;
  message?: string;
  code?: string;
}