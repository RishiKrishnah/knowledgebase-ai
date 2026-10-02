import { AxiosError } from "axios";

import { api } from "@/lib/api";


export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  document_count: number;
}


export interface KnowledgeBaseCreate {
  name: string;
  description?: string;
}


export interface KnowledgeBaseUpdate {
  name?: string;
  description?: string;
}


function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const err = error as AxiosError<{
    detail?: string;
    message?: string;
  }>;

  return (
    err.response?.data?.detail ??
    err.response?.data?.message ??
    err.message ??
    fallback
  );
}


class KnowledgeBaseService {
  async list(): Promise<KnowledgeBase[]> {
    try {
      const response = await api.get<KnowledgeBase[]>(
        "/knowledge-bases"
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load knowledge bases."
        )
      );
    }
  }


  async get(
    id: string
  ): Promise<KnowledgeBase> {
    try {
      const response =
        await api.get<KnowledgeBase>(
          `/knowledge-bases/${id}`
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load knowledge base."
        )
      );
    }
  }


  async create(
    data: KnowledgeBaseCreate
  ): Promise<KnowledgeBase> {
    try {
      const response =
        await api.post<KnowledgeBase>(
          "/knowledge-bases",
          data
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to create knowledge base."
        )
      );
    }
  }


  async update(
    id: string,
    data: KnowledgeBaseUpdate
  ): Promise<KnowledgeBase> {
    try {
      const response =
        await api.patch<KnowledgeBase>(
          `/knowledge-bases/${id}`,
          data
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to update knowledge base."
        )
      );
    }
  }


  async delete(
    id: string
  ): Promise<void> {
    try {
      await api.delete(
        `/knowledge-bases/${id}`
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to delete knowledge base."
        )
      );
    }
  }
}


export const knowledgeBaseService =
  new KnowledgeBaseService();