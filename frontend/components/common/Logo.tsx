import { DatabaseZap } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-primary p-2 text-primary-foreground">
        <DatabaseZap size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">KnowledgeBase AI</h2>

        <p className="text-xs text-muted-foreground">
          Enterprise Platform
        </p>
      </div>
    </div>
  );
}