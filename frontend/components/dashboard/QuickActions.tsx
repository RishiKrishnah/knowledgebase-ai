import {
  BookOpen,
  Database,
  MessageSquare,
  Upload,
} from "lucide-react";

import QuickAction from "./QuickAction";


export default function QuickActions() {

  return (
    <div className="grid gap-4 md:grid-cols-2">

      <QuickAction
        title="Start AI Chat"
        href="/chat"
        icon={MessageSquare}
      />

      <QuickAction
        title="Knowledge Bases"
        href="/knowledge"
        icon={BookOpen}
      />

      <QuickAction
        title="Upload Documents"
        href="/upload"
        icon={Upload}
      />

      <QuickAction
        title="Connect Database"
        href="/connections"
        icon={Database}
      />

    </div>
  );
}