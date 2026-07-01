"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "../common/Logo";
import { navigation } from "@/lib/navigation";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-card">

      {/* Logo */}
      <div className="p-6">
        <Logo />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">

        {navigation.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="space-y-2 p-5">

        <div className="rounded-xl border bg-muted/40 p-4">

          <h4 className="font-semibold">
            KnowledgeBase AI
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Enterprise Retrieval Platform
          </p>

          <div className="mt-3 text-xs text-muted-foreground">
            Version 2.0
          </div>

        </div>

      </div>

    </aside>
  );
}