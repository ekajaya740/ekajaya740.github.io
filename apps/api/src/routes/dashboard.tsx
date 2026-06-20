import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { SessionResponse } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent(): ReactNode {
  const [session, setSession] = useState<{ user: NonNullable<SessionResponse["user"]> } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname + window.location.search;

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then(r => r.json() as Promise<SessionResponse>)
      .then((data: SessionResponse) => {
        if (!data.user) {
          navigate({ to: "/login", search: { redirect: pathname } });
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked || !session) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/api/blog"
          className="rounded-lg border p-6 hover:border-accent hover:shadow-md transition-all"
        >
          <h2 className="font-semibold">Blog Posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage blog content</p>
        </Link>
      </div>
    </main>
  );
}
