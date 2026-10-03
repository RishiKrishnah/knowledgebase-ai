import { Suspense } from "react";

import SearchPageContent from "./SearchPageContent";

function SearchPageFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border p-6">
        <div className="h-5 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}