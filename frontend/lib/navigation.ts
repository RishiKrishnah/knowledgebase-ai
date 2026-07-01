import {
  Home,
  MessageSquare,
  Database,
  Search,
  Upload,
  Settings,
  BookOpen,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Knowledge Bases",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    title: "Database Connections",
    href: "/connections",
    icon: Database,
  },
  {
    title: "Semantic Search",
    href: "/search",
    icon: Search,
  },
  {
    title: "Upload Documents",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];