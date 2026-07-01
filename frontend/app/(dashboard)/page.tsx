import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome to KnowledgeBase AI Platform
        </p>
      </div>

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-2">

        <QuickActions />

        <RecentActivity />

      </div>

    </div>
  );
}