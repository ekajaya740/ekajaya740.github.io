import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    try {
      // If no users exist, redirect to register
      const countRes = await fetch("/api/v1/users");
      if (countRes.ok) {
        const { count } = (await countRes.json()) as { count: number };
        if (count === 0) throw redirect({ to: "/register" });
      }

      // If not logged in, redirect to login
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = (await res.json()) as { user?: { id: string } };
        if (!data.user) throw redirect({ to: "/login" });
      } else {
        throw redirect({ to: "/login" });
      }
    } catch {
      // check failed — redirect to login
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardComponent,
});

function DashboardComponent(): ReactNode {
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
