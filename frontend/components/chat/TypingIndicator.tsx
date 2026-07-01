"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">

      <div className="rounded-2xl border bg-card px-5 py-4">

        <div className="flex gap-2">

          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: "0.15s" }}
          />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: "0.3s" }}
          />

        </div>

      </div>

    </div>
  );
}