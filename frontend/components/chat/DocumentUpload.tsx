"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { documentService } from "@/services/documents";


interface Props {
  onUploaded?: (
    filename: string,
    chunks: number
  ) => void;
}


export default function DocumentUpload({
  onUploaded,
}: Props) {

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  async function handleFile(
    file: File
  ) {

    setLoading(true);
    setMessage("Uploading and processing...");

    try {

      const result =
        await documentService.uploadDocument(
          file
        );

      setMessage(
        `${result.filename} processed successfully. ${result.chunks} chunks indexed.`
      );

      onUploaded?.(
        result.filename,
        result.chunks
      );

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );

    } finally {

      setLoading(false);
    }
  }


  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];

    if (!file) return;

    handleFile(file);

    event.target.value = "";
  }


  return (
    <div className="flex items-center gap-3">

      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.docx,.txt,.csv,.xlsx"
        onChange={handleChange}
      />

      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={() =>
          inputRef.current?.click()
        }
      >
        {loading
          ? "Processing..."
          : "Upload Document"}
      </Button>

      {message && (
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      )}

    </div>
  );
}