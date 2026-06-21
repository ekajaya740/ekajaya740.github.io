import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    // Check session first via the auth API
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = (await res.json()) as { user?: { id: string } };
        if (data.user) throw redirect({ to: "/dashboard" });
      }
    } catch (e) {
      if (e instanceof Response) throw e;
      // session check failed — fall through
    }
    // No session — go to register (first user flow) instead of login
    throw redirect({ to: "/register" });
  },
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  ),
});
