import {
  BookOpen,
  Database,
  FileText,
  MessageSquare,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Knowledge Bases",
    value: 4,
    description: "Available knowledge bases",
    icon: BookOpen,
  },
  {
    title: "Documents",
    value: 152,
    description: "Indexed documents",
    icon: FileText,
  },
  {
    title: "Databases",
    value: 2,
    description: "Connected databases",
    icon: Database,
  },
  {
    title: "Chats",
    value: 38,
    description: "Total conversations",
    icon: MessageSquare,
  },
];

export const recentActivity = [
  {
    title: "Physics.xlsx uploaded",
    time: "10 minutes ago",
  },
  {
    title: "School Database connected",
    time: "1 hour ago",
  },
  {
    title: "New AI chat started",
    time: "Today",
  },
];