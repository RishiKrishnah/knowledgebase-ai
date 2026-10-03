"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  FileText,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  KnowledgeBase,
  knowledgeBaseService,
} from "@/services/knowledge-bases";

import {
  SearchResult,
  searchService,
} from "@/services/search";


export default function SearchPage() {

  const searchParams =
    useSearchParams();

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
    question,
    setQuestion,
  ] = useState("");


  const [
    results,
    setResults,
  ] = useState<SearchResult[]>(
    []
  );


  const [
    searching,
    setSearching,
  ] = useState(false);


  const [
    loadingKnowledgeBase,
    setLoadingKnowledgeBase,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    hasSearched,
    setHasSearched,
  ] = useState(false);


  useEffect(() => {

    if (!knowledgeBaseId) {
      setLoadingKnowledgeBase(false);
      return;
    }

    loadKnowledgeBase();

  }, [knowledgeBaseId]);


  async function loadKnowledgeBase() {

    if (!knowledgeBaseId) {
      return;
    }

    try {

      setLoadingKnowledgeBase(true);
      setError(null);

      const kb =
        await knowledgeBaseService.get(
          knowledgeBaseId
        );

      setKnowledgeBase(kb);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load knowledge base."
      );

    } finally {

      setLoadingKnowledgeBase(false);
    }
  }


  async function handleSearch(
    event: FormEvent
  ) {

    event.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      setError(
        "Enter a question to search."
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

      setSearching(true);
      setError(null);
      setHasSearched(true);

      const response =
        await searchService.search(
          trimmedQuestion,
          knowledgeBaseId
        );

      setResults(
        response.results
      );

    } catch (err) {

      setResults([]);

      setError(
        err instanceof Error
          ? err.message
          : "Semantic search failed."
      );

    } finally {

      setSearching(false);
    }
  }


  function formatScore(
    score: number
  ): string {

    return (
      score * 100
    ).toFixed(1) + "%";
  }


  if (!knowledgeBaseId) {

    return (
      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Semantic Search
          </h1>

          <p className="mt-2 text-muted-foreground">
            Search the indexed content of a
            specific knowledge base.
          </p>

        </div>


        <Card className="p-8">

          <div className="text-center">

            <Search className="mx-auto h-12 w-12 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-semibold">
              No knowledge base selected
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose a knowledge base before
              performing semantic search.
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
            Semantic Search
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Search indexed content in{" "}
            <span className="font-medium text-foreground">
              {loadingKnowledgeBase
                ? "Knowledge Base"
                : knowledgeBase?.name}
            </span>
          </p>

        </div>

      </div>


      {/* Error */}

      {error && (

        <Card className="border-destructive/50 bg-destructive/5 p-4">

          <div className="flex items-start gap-3">

            <XCircle className="mt-0.5 h-5 w-5 text-destructive" />

            <div>

              <p className="font-medium text-destructive">
                Search error
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

            </div>

          </div>

        </Card>
      )}


      {/* Search box */}

      <Card className="p-6">

        <form
          onSubmit={handleSearch}
          className="space-y-4"
        >

          <div>

            <label
              htmlFor="semantic-search"
              className="text-sm font-medium"
            >
              Search your knowledge base
            </label>

            <div className="mt-2 flex gap-3">

              <input
                id="semantic-search"
                type="text"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder="Ask a question or search for a concept..."
                disabled={searching}
                className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />

              <Button
                type="submit"
                disabled={
                  searching ||
                  !question.trim()
                }
              >

                {searching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}

              </Button>

            </div>

          </div>

        </form>

      </Card>


      {/* Results */}

      {hasSearched && !searching && (

        <div>

          <div className="mb-4">

            <h2 className="text-xl font-semibold">
              Search Results
            </h2>

            <p className="text-sm text-muted-foreground">
              {results.length} relevant{" "}
              {results.length === 1
                ? "chunk"
                : "chunks"}{" "}
              found.
            </p>

          </div>


          {results.length === 0 ? (

            <Card className="p-8 text-center">

              <Search className="mx-auto h-10 w-10 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No matching content found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try a different question or
                search phrase.
              </p>

            </Card>

          ) : (

            <div className="space-y-4">

              {results.map(
                (result, index) => (

                  <Card
                    key={`${result.document_id}-${result.chunk_index}-${index}`}
                    className="p-5"
                  >

                    <div className="flex flex-col gap-4">

                      {/* Result header */}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">

                            <FileText className="h-4 w-4 text-primary" />

                          </div>

                          <div>

                            <p className="font-medium">

                              {result.filename ||
                                "Unknown document"}

                            </p>

                            {result.chunk_index !==
                              null && (
                              <p className="text-xs text-muted-foreground">
                                Chunk{" "}
                                {result.chunk_index +
                                  1}
                              </p>
                            )}

                          </div>

                        </div>


                        <Badge variant="secondary">
                          {formatScore(
                            result.score
                          )}{" "}
                          match
                        </Badge>

                      </div>


                      {/* Text */}

                      <div className="rounded-lg bg-muted/50 p-4">

                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {result.text}
                        </p>

                      </div>

                    </div>

                  </Card>

                )
              )}

            </div>

          )}

        </div>

      )}

    </div>
  );
}