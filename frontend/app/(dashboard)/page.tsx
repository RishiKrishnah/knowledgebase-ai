"use client";


import {
  RefreshCw,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";


import { Button } from "@/components/ui/button";

import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsGrid from "@/components/dashboard/StatsGrid";

import {
  dashboardService,
  type DashboardSummary,
} from "@/services/dashboard";


// ============================================================
// PAGE
// ============================================================


export default function DashboardPage() {

  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardSummary | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================


  const loadDashboard =
    useCallback(async () => {

      try {

        setLoading(true);
        setError(null);

        const data =
          await dashboardService.getSummary();

        setDashboard(data);

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);
      }

    }, []);


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================


  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  // ==========================================================
  // DEFAULT STATS
  // ==========================================================


  const stats =
    dashboard?.stats ?? {
      knowledge_bases: 0,
      documents: 0,
      database_connections: 0,
      chats: 0,
    };


  // ==========================================================
  // RENDER
  // ==========================================================


  return (
    <div className="space-y-8">


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome to KnowledgeBase AI Platform
          </p>

        </div>


        <Button
          variant="outline"
          onClick={loadDashboard}
          disabled={loading}
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh"}

        </Button>

      </div>


      {/* ==================================================== */}
      {/* ERROR */}
      {/* ==================================================== */}


      {error && (

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">

          <p className="font-medium text-destructive">
            Unable to load dashboard
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={loadDashboard}
          >
            Try Again
          </Button>

        </div>

      )}


      {/* ==================================================== */}
      {/* STATS */}
      {/* ==================================================== */}


      <StatsGrid
        knowledgeBases={
          stats.knowledge_bases
        }
        documents={
          stats.documents
        }
        databaseConnections={
          stats.database_connections
        }
        chats={
          stats.chats
        }
      />


      {/* ==================================================== */}
      {/* QUICK ACTIONS + RECENT ACTIVITY */}
      {/* ==================================================== */}


      <div className="grid gap-6 lg:grid-cols-2">

        <QuickActions />

        <RecentActivity
          activities={
            dashboard?.recent_activity ?? []
          }
          loading={loading}
        />

      </div>

    </div>
  );
}