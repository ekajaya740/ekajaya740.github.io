import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent(): ReactNode {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/blog"
          className="rounded-lg border p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h2 className="font-semibold">Blog Posts</h2>
          <p className="mt-1 text-sm text-gray-500">Manage blog content</p>
        </Link>
      </div>
    </main>
  );
}
