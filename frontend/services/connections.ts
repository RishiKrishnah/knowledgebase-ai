import axios from "axios";

import { api } from "@/lib/api";


export interface DatabaseConnection {
  id: string;
  name: string;
  db_type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  is_active: boolean;
}


export interface DatabaseConnectionCreate {
  name: string;
  db_type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
}


export interface DatabaseConnectionUpdate {
  name?: string;
  db_type?: string;
  host?: string;
  port?: number;
  database_name?: string;
  username?: string;
  password?: string;
  is_active?: boolean;
}


function getErrorMessage(
  error: unknown,
  fallback: string
): string {

  if (axios.isAxiosError(error)) {

    return (
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      fallback
    );
  }

  return fallback;
}


class ConnectionService {

  async list(): Promise<
    DatabaseConnection[]
  > {

    try {

      const response =
        await api.get<
          DatabaseConnection[]
        >(
          "/connections"
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to load database connections."
        )
      );
    }
  }


  async get(
    id: string
  ): Promise<DatabaseConnection> {

    try {

      const response =
        await api.get<
          DatabaseConnection
        >(
          `/connections/${id}`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to load database connection."
        )
      );
    }
  }


  async create(
    data: DatabaseConnectionCreate
  ): Promise<DatabaseConnection> {

    try {

      const response =
        await api.post<
          DatabaseConnection
        >(
          "/connections",
          data
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to create database connection."
        )
      );
    }
  }


  async update(
    id: string,
    data: DatabaseConnectionUpdate
  ): Promise<DatabaseConnection> {

    try {

      const response =
        await api.patch<
          DatabaseConnection
        >(
          `/connections/${id}`,
          data
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to update database connection."
        )
      );
    }
  }


  async delete(
    id: string
  ): Promise<void> {

    try {

      await api.delete(
        `/connections/${id}`
      );

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to delete database connection."
        )
      );
    }
  }
}


export const connectionService =
  new ConnectionService();