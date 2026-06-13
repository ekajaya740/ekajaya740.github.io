import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-foreground">Work of Ekajaya</h1>
        <p className="text-sm text-muted-foreground">Portfolio Admin Panel</p>

        <div className="space-y-3 pt-4">
          <Link
            to="/login"
            className="block w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="block w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
