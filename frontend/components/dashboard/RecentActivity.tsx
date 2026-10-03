import {
  Activity,
  BookOpen,
  Database,
  FileText,
  MessageSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  DashboardActivity,
} from "@/services/dashboard";


interface Props {
  activities: DashboardActivity[];
  loading: boolean;
}


// ============================================================
// RELATIVE TIME
// ============================================================


function formatRelativeTime(
  timestamp: string
): string {

  const date =
    new Date(timestamp);

  const now =
    new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const seconds =
    Math.floor(
      difference / 1000
    );


  if (seconds < 10) {
    return "Just now";
  }


  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }


  const minutes =
    Math.floor(seconds / 60);


  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }


  const hours =
    Math.floor(minutes / 60);


  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }


  const days =
    Math.floor(hours / 24);


  if (days < 7) {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }


  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


// ============================================================
// ICON
// ============================================================


function getActivityIcon(
  type: string
) {

  switch (type) {

    case "document":
      return FileText;

    case "knowledge_base":
      return BookOpen;

    case "database":
      return Database;

    case "chat":
      return MessageSquare;

    default:
      return Activity;
  }
}


// ============================================================
// COMPONENT
// ============================================================


export default function RecentActivity({
  activities,
  loading,
}: Props) {

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
      </CardHeader>


      <CardContent className="space-y-4">

        {loading ? (

          <>
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b pb-3 last:border-none"
                >

                  <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />

                  <div className="flex-1 space-y-2">

                    <div className="h-4 w-40 animate-pulse rounded bg-muted" />

                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />

                  </div>

                </div>
              )
            )}
          </>

        ) : activities.length === 0 ? (

          <div className="py-8 text-center">

            <Activity className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              No recent activity
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Activity will appear here as you use the platform.
            </p>

          </div>

        ) : (

          activities.map(
            (activity, index) => {

              const Icon =
                getActivityIcon(
                  activity.type
                );


              return (
                <div
                  key={`${activity.type}-${activity.created_at}-${index}`}
                  className="flex items-center gap-3 border-b pb-3 last:border-none"
                >

                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon size={18} />
                  </div>


                  <div className="min-w-0 flex-1">

                    <h4 className="font-medium">
                      {activity.title}
                    </h4>

                    <p className="truncate text-sm text-muted-foreground">
                      {activity.description}
                    </p>

                  </div>


                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(
                      activity.created_at
                    )}
                  </span>

                </div>
              );
            }
          )

        )}

      </CardContent>

    </Card>
  );
}