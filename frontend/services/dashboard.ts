import axios from "axios";

import { api } from "@/lib/api";


// ============================================================
// TYPES
// ============================================================


export interface DashboardStats {
  knowledge_bases: number;
  documents: number;
  database_connections: number;
  chats: number;
}


export interface DashboardActivity {
  type: string;
  title: string;
  description: string;
  created_at: string;
}


export interface DashboardSummary {
  stats: DashboardStats;
  recent_activity: DashboardActivity[];
}


// ============================================================
// SERVICE
// ============================================================


class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    try {
      const response =
        await api.get<DashboardSummary>(
          "/dashboard/summary"
        );

      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.detail;

        throw new Error(
          detail ||
          error.message ||
          "Unable to load dashboard data."
        );
      }

      throw new Error(
        "Unable to load dashboard data."
      );
    }
  }
}


export const dashboardService =
  new DashboardService();