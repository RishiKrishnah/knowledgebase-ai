import axios from "axios";

import { api } from "@/lib/api";


export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  chunks: number;
  status: string;
}


class DocumentService {

  async uploadDocument(
    file: File
  ): Promise<DocumentUploadResponse> {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

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
}


export const documentService =
  new DocumentService();