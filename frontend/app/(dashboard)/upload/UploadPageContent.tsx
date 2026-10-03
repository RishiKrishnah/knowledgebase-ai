"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  documentService,
  DocumentItem,
} from "@/services/documents";

import {
  knowledgeBaseService,
  KnowledgeBase,
} from "@/services/knowledge-bases";


const MAX_FILE_SIZE =
  20 * 1024 * 1024;


const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
];


export default function UploadPageContent() {

  const searchParams =
    useSearchParams();

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  const knowledgeBaseId =
    searchParams.get(
      "knowledge_base_id"
    );


  const [
    knowledgeBase,
    setKnowledgeBase,
  ] = useState<KnowledgeBase | null>(
    null
  );


  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>(
    []
  );


  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    loadingDocuments,
    setLoadingDocuments,
  ] = useState(true);


  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  );


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    success,
    setSuccess,
  ] = useState<string | null>(
    null
  );


  const [
    dragging,
    setDragging,
  ] = useState(false);


  useEffect(() => {

    if (!knowledgeBaseId) {
      setLoadingDocuments(false);
      return;
    }

    loadData();

  }, [knowledgeBaseId]);


  async function loadData() {

    if (!knowledgeBaseId) {
      return;
    }

    try {

      setLoadingDocuments(true);
      setError(null);

      const [
        kb,
        docs,
      ] = await Promise.all([
        knowledgeBaseService.get(
          knowledgeBaseId
        ),
        documentService.listDocuments(
          knowledgeBaseId
        ),
      ]);

      setKnowledgeBase(kb);
      setDocuments(docs);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load upload data."
      );

    } finally {

      setLoadingDocuments(false);
    }
  }


  function validateFile(
    file: File
  ): string | null {

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      return (
        "Unsupported file type. " +
        "Use PDF, DOCX, TXT, CSV, or XLSX."
      );
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return (
        "File is too large. " +
        "Maximum size is 20 MB."
      );
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    return null;
  }


  function handleFile(
    file: File
  ) {

    setError(null);
    setSuccess(null);

    const validationError =
      validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  }


  function handleFileInput(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }


  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {

    event.preventDefault();
    setDragging(true);
  }


  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {

    event.preventDefault();
    setDragging(false);
  }


  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {

    event.preventDefault();
    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  }


  async function uploadFile() {

    if (!selectedFile) {
      setError(
        "Please select a file first."
      );
      return;
    }

    if (!knowledgeBaseId) {
      setError(
        "Please select a knowledge base first."
      );
      return;
    }

    try {

      setUploading(true);
      setError(null);
      setSuccess(null);

      await documentService.uploadDocument(
        selectedFile,
        knowledgeBaseId
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        `"${selectedFile.name}" uploaded and processed successfully.`
      );

      await loadData();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Document upload failed."
      );

    } finally {

      setUploading(false);
    }
  }


  async function deleteDocument(
    documentId: string
  ) {

    const confirmed =
      window.confirm(
        "Delete this document? Its indexed chunks will also be removed."
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(documentId);
      setError(null);

      await documentService.deleteDocument(
        documentId
      );

      setDocuments(
        (current) =>
          current.filter(
            (document) =>
              document.id !== documentId
          )
      );

      setSuccess(
        "Document deleted successfully."
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Document deletion failed."
      );

    } finally {

      setDeletingId(null);
    }
  }


  function formatFileSize(
    bytes: number
  ): string {

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }


  function formatDate(
    date: string
  ): string {

    return new Date(
      date
    ).toLocaleString();
  }


  if (!knowledgeBaseId) {

    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Upload Documents
          </h1>

          <p className="mt-2 text-muted-foreground">
            Select a knowledge base before
            uploading documents.
          </p>
        </div>

        <Card className="p-8">

          <div className="text-center">

            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-semibold">
              No knowledge base selected
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose a knowledge base to upload
              and index documents into it.
            </p>

            <Button
              asChild
              className="mt-6"
            >
              <Link href="/knowledge">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Choose Knowledge Base
              </Link>
            </Button>

          </div>

        </Card>

      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/knowledge">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div>

              <h1 className="text-3xl font-bold">
                Upload Documents
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Add documents to{" "}
                <span className="font-medium text-foreground">
                  {knowledgeBase?.name ||
                    "Knowledge Base"}
                </span>
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Error */}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 p-4">

          <div className="flex items-start gap-3">

            <XCircle className="mt-0.5 h-5 w-5 text-destructive" />

            <div>

              <p className="font-medium text-destructive">
                Upload error
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

            </div>

          </div>

        </Card>
      )}


      {/* Success */}

      {success && (
        <Card className="border-green-500/30 bg-green-500/5 p-4">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

            <p className="text-sm">
              {success}
            </p>

          </div>

        </Card>
      )}


      {/* Upload area */}

      <Card className="p-6">

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "rounded-xl border-2 border-dashed p-10 text-center transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
          ].join(" ")}
        >

          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            Upload a document
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop a file here, or select
            one from your computer.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOCX, TXT, CSV, XLSX · Maximum 20 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.csv,.xlsx"
            className="hidden"
            onChange={handleFileInput}
          />

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            Choose File
          </Button>

        </div>


        {/* Selected file */}

        {selectedFile && (

          <div className="mt-6 rounded-lg border p-4">

            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <FileText className="h-8 w-8 shrink-0 text-primary" />

                <div className="min-w-0">

                  <p className="truncate font-medium">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </p>

                </div>

              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedFile(null)
                }
                disabled={uploading}
              >
                Remove
              </Button>

            </div>

            <Button
              className="mt-4 w-full"
              onClick={uploadFile}
              disabled={uploading}
            >

              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing document...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Index
                </>
              )}

            </Button>

          </div>

        )}

      </Card>


      {/* Documents */}

      <div>

        <div className="mb-4">

          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Documents currently indexed in this
            knowledge base.
          </p>

        </div>


        {loadingDocuments ? (

          <Card className="p-8 text-center">

            <Loader2 className="mx-auto h-6 w-6 animate-spin" />

            <p className="mt-3 text-sm text-muted-foreground">
              Loading documents...
            </p>

          </Card>

        ) : documents.length === 0 ? (

          <Card className="p-8 text-center">

            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No documents yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first document above.
            </p>

          </Card>

        ) : (

          <div className="space-y-3">

            {documents.map(
              (document) => (

                <Card
                  key={document.id}
                  className="p-4"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-3">

                      <FileText className="h-8 w-8 shrink-0 text-primary" />

                      <div className="min-w-0">

                        <p className="truncate font-medium">
                          {document.filename}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatFileSize(
                            document.file_size
                          )}
                          {" · "}
                          {formatDate(
                            document.created_at
                          )}
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-3">

                      <Badge
                        variant={
                          document.status ===
                          "ready"
                            ? "default"
                            : document.status ===
                              "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {document.status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteDocument(
                            document.id
                          )
                        }
                        disabled={
                          deletingId ===
                          document.id
                        }
                      >

                        {deletingId ===
                        document.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}

                      </Button>

                    </div>

                  </div>

                </Card>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}