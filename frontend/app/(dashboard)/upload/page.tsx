import { Suspense } from "react";

import UploadPageContent from "./UploadPageContent";

function UploadPageFallback() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-56 animate-pulse rounded bg-muted" />

        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border p-6">
        <div className="h-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-3">
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<UploadPageFallback />}>
      <UploadPageContent />
    </Suspense>
  );
}