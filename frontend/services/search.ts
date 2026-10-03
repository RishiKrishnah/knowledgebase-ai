import axios from "axios";

import { api } from "@/lib/api";


export interface SearchResult {
  score: number;
  text: string;
  document_id: string | null;
  filename: string | null;
  chunk_index: number | null;
  knowledge_base_id: string | null;
}


export interface SearchResponse {
  knowledge_base_id: string;
  knowledge_base_name: string;
  results: SearchResult[];
}


class SearchService {

  async search(
    question: string,
    knowledgeBaseId: string
  ): Promise<SearchResponse> {

    try {

      const response =
        await api.post<SearchResponse>(
          "/search",
          {
            question,
          },
          {
            params: {
              knowledge_base_id:
                knowledgeBaseId,
            },
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
          "Semantic search failed."
        );
      }

      throw new Error(
        "Semantic search failed."
      );
    }
  }
}


export const searchService =
  new SearchService();