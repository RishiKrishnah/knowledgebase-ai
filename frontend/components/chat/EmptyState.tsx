import { Sparkles } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center">

      <div className="rounded-full bg-primary/10 p-6">

        <Sparkles
          className="text-primary"
          size={42}
        />

      </div>

      <h2 className="mt-6 text-3xl font-bold">
        KnowledgeBase AI
      </h2>

      <p className="mt-2 text-muted-foreground">
        Ask questions about documents,
        databases,
        or just have a conversation.
      </p>

    </div>
  );
}