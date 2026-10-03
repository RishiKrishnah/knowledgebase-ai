import {
  BookOpen,
  Database,
  FileText,
  MessageSquare,
} from "lucide-react";

import StatCard from "./StatCard";


interface Props {
  knowledgeBases: number;
  documents: number;
  databaseConnections: number;
  chats: number;
}


export default function StatsGrid({
  knowledgeBases,
  documents,
  databaseConnections,
  chats,
}: Props) {

  const stats = [
    {
      title: "Knowledge Bases",
      value: knowledgeBases,
      description: "Available knowledge bases",
      icon: BookOpen,
    },
    {
      title: "Documents",
      value: documents,
      description: "Indexed documents",
      icon: FileText,
    },
    {
      title: "Databases",
      value: databaseConnections,
      description: "Connected databases",
      icon: Database,
    },
    {
      title: "Chats",
      value: chats,
      description: "Total conversations",
      icon: MessageSquare,
    },
  ];


  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}

    </div>
  );
}