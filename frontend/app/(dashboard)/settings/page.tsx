"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const [theme, setTheme] =
    useState<Theme>("system");

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("theme") as Theme | null;

    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
    ) {
      setTheme(storedTheme);
    }
  }, []);

  function handleSave() {
    localStorage.setItem("theme", theme);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your KnowledgeBase AI application
          preferences.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose how the application should appear.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="theme"
              className="text-sm font-medium"
            >
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) =>
                setTheme(
                  event.target.value as Theme
                )
              }
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="system">
                System Default
              </option>

              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Save Changes
          </button>

          {saved && (
            <span className="text-sm text-green-600">
              Settings saved successfully.
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Application
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Information about this KnowledgeBase AI
            installation.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b pb-3">
            <span className="text-muted-foreground">
              Application
            </span>

            <span className="font-medium">
              KnowledgeBase AI
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-muted-foreground">
              Version
            </span>

            <span className="font-medium">
              2.0
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Environment
            </span>

            <span className="font-medium">
              Production
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Security
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Security-related information for your
            application.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              API credentials
            </span>

            <span className="font-medium">
              Protected
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Session authentication
            </span>

            <span className="font-medium">
              Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}