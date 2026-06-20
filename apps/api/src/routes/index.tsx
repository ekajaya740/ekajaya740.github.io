import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = (await res.json()) as { user?: { id: string } };
        if (data.user) throw redirect({ to: "/dashboard" });
      }
    } catch {
      // session check failed — redirect to login
    }
    throw redirect({ to: "/login" });
  },
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  ),
});
