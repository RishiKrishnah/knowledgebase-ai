"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Database,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  connectionService,
  DatabaseConnection,
} from "@/services/connections";


const EMPTY_FORM = {
  name: "",
  db_type: "postgresql",
  host: "",
  port: "5432",
  database_name: "",
  username: "",
  password: "",
};


export default function ConnectionsPage() {

  const [
    connections,
    setConnections,
  ] = useState<DatabaseConnection[]>(
    []
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  );


  const [
    editingId,
    setEditingId,
  ] = useState<string | null>(
    null
  );


  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    success,
    setSuccess,
  ] = useState<string | null>(
    null
  );


  useEffect(() => {

    loadConnections();

  }, []);


  async function loadConnections() {

    try {

      setLoading(true);
      setError(null);

      const data =
        await connectionService.list();

      setConnections(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load connections."
      );

    } finally {

      setLoading(false);
    }
  }


  function updateField(
    field: keyof typeof EMPTY_FORM,
    value: string
  ) {

    setForm(
      current => ({
        ...current,
        [field]: value,
      })
    );
  }


  function resetForm() {

    setForm(
      EMPTY_FORM
    );

    setEditingId(null);
  }


  function startEdit(
    connection: DatabaseConnection
  ) {

    setEditingId(
      connection.id
    );

    setForm({
      name: connection.name,
      db_type: connection.db_type,
      host: connection.host,
      port: String(
        connection.port
      ),
      database_name:
        connection.database_name,
      username:
        connection.username,
      password: "",
    });

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!form.name.trim()) {
      setError(
        "Connection name is required."
      );
      return;
    }

    if (!form.host.trim()) {
      setError(
        "Host is required."
      );
      return;
    }

    if (!form.database_name.trim()) {
      setError(
        "Database name is required."
      );
      return;
    }

    if (!form.username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (
      !editingId &&
      !form.password
    ) {
      setError(
        "Password is required."
      );
      return;
    }

    const port =
      Number(form.port);

    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      setError(
        "Port must be between 1 and 65535."
      );
      return;
    }

    try {

      setSaving(true);

      if (editingId) {

        const updateData: {
          name: string;
          db_type: string;
          host: string;
          port: number;
          database_name: string;
          username: string;
          password?: string;
        } = {
          name:
            form.name.trim(),
          db_type:
            form.db_type,
          host:
            form.host.trim(),
          port,
          database_name:
            form.database_name.trim(),
          username:
            form.username.trim(),
        };

        if (form.password) {
          updateData.password =
            form.password;
        }

        const updated =
          await connectionService.update(
            editingId,
            updateData
          );

        setConnections(
          current =>
            current.map(
              connection =>
                connection.id ===
                updated.id
                  ? updated
                  : connection
            )
        );

        setSuccess(
          "Database connection updated successfully."
        );

      } else {

        const created =
          await connectionService.create({
            name:
              form.name.trim(),
            db_type:
              form.db_type,
            host:
              form.host.trim(),
            port,
            database_name:
              form.database_name.trim(),
            username:
              form.username.trim(),
            password:
              form.password,
          });

        setConnections(
          current => [
            created,
            ...current,
          ]
        );

        setSuccess(
          "Database connection created successfully."
        );
      }

      resetForm();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save connection."
      );

    } finally {

      setSaving(false);
    }
  }


  async function deleteConnection(
    connectionId: string
  ) {

    const confirmed =
      window.confirm(
        "Delete this database connection?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(
        connectionId
      );

      setError(null);
      setSuccess(null);

      await connectionService.delete(
        connectionId
      );

      setConnections(
        current =>
          current.filter(
            connection =>
              connection.id !==
              connectionId
          )
      );

      if (
        editingId === connectionId
      ) {
        resetForm();
      }

      setSuccess(
        "Database connection deleted successfully."
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete connection."
      );

    } finally {

      setDeletingId(null);
    }
  }


  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Database Connections
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure databases that can be
          connected to the KnowledgeBase AI
          platform.
        </p>

      </div>


      {/* Messages */}

      {error && (

        <Card className="border-destructive/50 bg-destructive/5 p-4">

          <div className="flex items-start gap-3">

            <XCircle className="mt-0.5 h-5 w-5 text-destructive" />

            <div>

              <p className="font-medium text-destructive">
                Error
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

            </div>

          </div>

        </Card>
      )}


      {success && (

        <Card className="border-green-500/30 bg-green-500/5 p-4">

          <p className="text-sm">
            {success}
          </p>

        </Card>
      )}


      {/* Connection form */}

      <Card className="p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">

            {editingId ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-primary" />
            )}

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              {editingId
                ? "Edit Connection"
                : "Add Database Connection"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {editingId
                ? "Update the connection details below."
                : "Add a database that the platform can connect to."}
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Connection Name
              </label>

              <Input
                value={form.name}
                onChange={event =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="My PostgreSQL Database"
              />

            </div>


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Database Type
              </label>

              <select
                value={form.db_type}
                onChange={event =>
                  updateField(
                    "db_type",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >

                <option value="postgresql">
                  PostgreSQL
                </option>

                <option value="mysql">
                  MySQL
                </option>

                <option value="sqlite">
                  SQLite
                </option>

              </select>

            </div>


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Host
              </label>

              <Input
                value={form.host}
                onChange={event =>
                  updateField(
                    "host",
                    event.target.value
                  )
                }
                placeholder="localhost"
              />

            </div>


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Port
              </label>

              <Input
                type="number"
                value={form.port}
                onChange={event =>
                  updateField(
                    "port",
                    event.target.value
                  )
                }
                placeholder="5432"
              />

            </div>


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Database Name
              </label>

              <Input
                value={
                  form.database_name
                }
                onChange={event =>
                  updateField(
                    "database_name",
                    event.target.value
                  )
                }
                placeholder="my_database"
              />

            </div>


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Username
              </label>

              <Input
                value={form.username}
                onChange={event =>
                  updateField(
                    "username",
                    event.target.value
                  )
                }
                placeholder="postgres"
              />

            </div>


            <div className="space-y-2 md:col-span-2">

              <label className="text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                value={form.password}
                onChange={event =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
                placeholder={
                  editingId
                    ? "Leave blank to keep existing password"
                    : "Database password"
                }
              />

              {editingId && (
                <p className="text-xs text-muted-foreground">
                  Leave this field blank to keep
                  the existing password.
                </p>
              )}

            </div>

          </div>


          <div className="flex gap-3">

            <Button
              type="submit"
              disabled={saving}
            >

              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  {editingId
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  {editingId ? (
                    <Edit3 className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}

                  {editingId
                    ? "Update Connection"
                    : "Add Connection"}
                </>
              )}

            </Button>


            {editingId && (

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </Button>

            )}

          </div>

        </form>

      </Card>


      {/* Saved connections */}

      <div>

        <div className="mb-4">

          <h2 className="text-xl font-semibold">
            Saved Connections
          </h2>

          <p className="text-sm text-muted-foreground">
            Database connections configured
            for this application.
          </p>

        </div>


        {loading ? (

          <Card className="p-8 text-center">

            <Loader2 className="mx-auto h-6 w-6 animate-spin" />

            <p className="mt-3 text-sm text-muted-foreground">
              Loading connections...
            </p>

          </Card>

        ) : connections.length === 0 ? (

          <Card className="p-8 text-center">

            <Database className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No database connections
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add your first database connection
              above.
            </p>

          </Card>

        ) : (

          <div className="space-y-3">

            {connections.map(
              connection => (

                <Card
                  key={connection.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex min-w-0 items-start gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">

                        <Database className="h-5 w-5" />

                      </div>


                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold">
                            {connection.name}
                          </h3>

                          <Badge
                            variant={
                              connection.is_active
                                ? "default"
                                : "secondary"
                            }
                          >
                            {connection.is_active
                              ? "Active"
                              : "Inactive"}
                          </Badge>

                        </div>


                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">

                          <p>
                            <span className="font-medium text-foreground">
                              Type:
                            </span>{" "}
                            {connection.db_type}
                          </p>

                          <p>
                            <span className="font-medium text-foreground">
                              Host:
                            </span>{" "}
                            {connection.host}:
                            {connection.port}
                          </p>

                          <p>
                            <span className="font-medium text-foreground">
                              Database:
                            </span>{" "}
                            {connection.database_name}
                          </p>

                          <p>
                            <span className="font-medium text-foreground">
                              User:
                            </span>{" "}
                            {connection.username}
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="flex shrink-0 gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          startEdit(
                            connection
                          )
                        }
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>


                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          deleteConnection(
                            connection.id
                          )
                        }
                        disabled={
                          deletingId ===
                          connection.id
                        }
                      >

                        {deletingId ===
                        connection.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}

                        Delete

                      </Button>

                    </div>

                  </div>

                </Card>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}