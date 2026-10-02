import axios from "axios";

import { api } from "@/lib/api";


export interface DocumentItem {
  id: string;
  filename: string;
  file_type: string;
  mime_type: string | null;
  file_size: number;
  status: string;
  processing_stage: string;
  created_at: string;
}


export interface DocumentUploadResponse {
  id: string;
  filename: string;
  file_type: string;
  mime_type: string | null;
  file_size: number;
  status: string;
  processing_stage: string;
  created_at: string;

  // Kept for compatibility with the existing
  // chat DocumentUpload component.
  chunks: number;
}


class DocumentService {

  async uploadDocument(
    file: File,
    knowledgeBaseId?: string
  ): Promise<DocumentUploadResponse> {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    // Only send the field when a specific
    // knowledge base was selected.
    //
    // If omitted, the backend uses the
    // existing default knowledge base.
    if (knowledgeBaseId) {

      formData.append(
        "knowledge_base_id",
        knowledgeBaseId
      );
    }

    try {

      const response =
        await api.post<DocumentUploadResponse>(
          "/documents/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
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
          "Document upload failed."
        );
      }

      throw new Error(
        "Document upload failed."
      );
    }
  }


  async listDocuments(
    knowledgeBaseId?: string
  ): Promise<DocumentItem[]> {

    try {

      const params =
        knowledgeBaseId
          ? {
              knowledge_base_id:
                knowledgeBaseId,
            }
          : undefined;

      const response =
        await api.get<DocumentItem[]>(
          "/documents",
          {
            params,
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
          "Unable to load documents."
        );
      }

      throw new Error(
        "Unable to load documents."
      );
    }
  }


  async deleteDocument(
    documentId: string
  ): Promise<void> {

    try {

      await api.delete(
        `/documents/${documentId}`
      );

    } catch (error) {

      if (axios.isAxiosError(error)) {

        const detail =
          error.response?.data?.detail;

        throw new Error(
          detail ||
          error.message ||
          "Document deletion failed."
        );
      }

      throw new Error(
        "Document deletion failed."
      );
    }
  }
}


export const documentService =
  new DocumentService();