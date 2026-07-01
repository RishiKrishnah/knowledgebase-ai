"use client";

import ThemeToggle from "../common/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-8 backdrop-blur">

      <div>
        <h1 className="text-xl font-semibold">
          KnowledgeBase AI
        </h1>

        <p className="text-sm text-muted-foreground">
          Enterprise Retrieval Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>

    </header>
  );
}