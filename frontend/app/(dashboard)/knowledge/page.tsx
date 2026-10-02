"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Database,
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  knowledgeBaseService,
  KnowledgeBase,
} from "@/services/knowledge-bases";


export default function KnowledgePage() {
  const [knowledgeBases, setKnowledgeBases] =
    useState<KnowledgeBase[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);


  const totalDocuments = useMemo(
    () =>
      knowledgeBases.reduce(
        (total, knowledgeBase) =>
          total +
          knowledgeBase.document_count,
        0
      ),
    [knowledgeBases]
  );


  async function loadKnowledgeBases() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await knowledgeBaseService.list();

      setKnowledgeBases(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load knowledge bases."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadKnowledgeBases();
  }, []);


  function resetForm() {
    setName("");
    setDescription("");
    setShowCreateForm(false);
    setEditingId(null);
  }


  function startEdit(
    knowledgeBase: KnowledgeBase
  ) {
    setEditingId(knowledgeBase.id);
    setName(knowledgeBase.name);
    setDescription(
      knowledgeBase.description ?? ""
    );
    setShowCreateForm(true);
  }


  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await knowledgeBaseService.update(
          editingId,
          {
            name: name.trim(),
            description:
              description.trim(),
          }
        );
      } else {
        await knowledgeBaseService.create({
          name: name.trim(),
          description:
            description.trim(),
        });
      }

      resetForm();
      await loadKnowledgeBases();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save knowledge base."
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleDelete(
    knowledgeBase: KnowledgeBase
  ) {
    if (
      knowledgeBase.name ===
      "Default Knowledge Base"
    ) {
      setError(
        "The default knowledge base cannot be deleted."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${knowledgeBase.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(knowledgeBase.id);
      setError(null);

      await knowledgeBaseService.delete(
        knowledgeBase.id
      );

      await loadKnowledgeBases();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete knowledge base."
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Knowledge Bases
              </h1>

              <p className="mt-1 text-muted-foreground">
                Organize documents into searchable
                knowledge collections.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadKnowledgeBases}
            disabled={loading}
          >
            <RefreshCw
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </Button>

          <Button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
          >
            <Plus />
            New Knowledge Base
          </Button>
        </div>
      </div>


      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Knowledge Bases
              </p>

              <p className="text-2xl font-bold">
                {knowledgeBases.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Documents
              </p>

              <p className="text-2xl font-bold">
                {totalDocuments}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <BookOpen className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Platform Status
              </p>

              <p className="text-lg font-semibold">
                Ready
              </p>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}


      {/* Create / Edit form */}
      {showCreateForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  {editingId
                    ? "Edit Knowledge Base"
                    : "Create Knowledge Base"}
                </CardTitle>

                <CardDescription>
                  Give your knowledge base a clear
                  name and description.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetForm}
              >
                <X />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="knowledge-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <Input
                  id="knowledge-name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Engineering Documents"
                  maxLength={255}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="knowledge-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <Textarea
                  id="knowledge-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what this knowledge base contains..."
                  maxLength={2000}
                  disabled={saving}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    saving ||
                    !name.trim()
                  }
                >
                  {saving && (
                    <Loader2 className="animate-spin" />
                  )}

                  {editingId
                    ? "Save Changes"
                    : "Create Knowledge Base"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}


      {/* Loading */}
      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <Card key={index}>
                <CardContent className="space-y-4 pt-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-full animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}


      {/* Empty state */}
      {!loading &&
        knowledgeBases.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No knowledge bases yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create your first knowledge base
                to organize documents and make
                them available to semantic search
                and AI Chat.
              </p>

              <Button
                className="mt-6"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(true);
                }}
              >
                <Plus />
                Create Knowledge Base
              </Button>
            </CardContent>
          </Card>
        )}


      {/* Knowledge base grid */}
      {!loading &&
        knowledgeBases.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {knowledgeBases.map(
              (knowledgeBase) => {
                const isDefault =
                  knowledgeBase.name ===
                  "Default Knowledge Base";

                const isDeleting =
                  deletingId ===
                  knowledgeBase.id;

                return (
                  <Card
                    key={knowledgeBase.id}
                    className="group transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <CardTitle className="truncate">
                              {knowledgeBase.name}
                            </CardTitle>

                            {isDefault && (
                              <Badge
                                variant="secondary"
                                className="mt-1"
                              >
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>

                        {!isDefault && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              startEdit(
                                knowledgeBase
                              )
                            }
                            disabled={isDeleting}
                          >
                            <Pencil />
                          </Button>
                        )}
                      </div>

                      <CardDescription className="line-clamp-2 min-h-10">
                        {knowledgeBase.description ||
                          "No description provided."}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="size-4" />
                          Documents
                        </div>

                        <span className="font-semibold">
                          {
                            knowledgeBase.document_count
                          }
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          className="flex-1"
                        >
                          <Link
                            href={`/upload?knowledge_base_id=${knowledgeBase.id}`}
                          >
                            <Upload />
                            Upload
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="flex-1"
                        >
                          <Link
                            href={`/search?knowledge_base_id=${knowledgeBase.id}`}
                          >
                            <Database />
                            Search
                          </Link>
                        </Button>
                      </div>

                      {!isDefault && (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() =>
                            handleDelete(
                              knowledgeBase
                            )
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}

                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        )}
    </div>
  );
}