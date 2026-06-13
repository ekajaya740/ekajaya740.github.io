import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { CForm, CField, CInput, CSubmit } from "@ekajaya/ui/composed";
import { signInSchema } from "@ekajaya/schema/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): { redirect?: string } => ({
    redirect: search.redirect || undefined,
  }),
  beforeLoad: async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = (await res.json()) as { user?: { id: string } };
        if (data.user) throw redirect({ to: "/dashboard" });
      }
    } catch (e) {
      if (e instanceof Response) throw e;
    }
  },
  component: LoginComponent,
});

function LoginComponent(): ReactNode {
  const navigate = useNavigate();
  const { redirect: returnTo } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: Record<string, unknown>): Promise<void> => {
    setError(null);
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const err = (await res.json()) as { message?: string };
        throw new Error(err.message ?? "Invalid credentials");
      }
      navigate({ to: returnTo || "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin dashboard access</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <CForm
          defaultValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <div className="space-y-4">
              <CField name="email" form={form} label="Email">
                {(field) => (
                  <CInput
                    field={field}
                    type="email"
                    placeholder="admin@example.com"
                    required
                  />
                )}
              </CField>

              <CField name="password" form={form} label="Password">
                {(field) => (
                  <CInput
                    field={field}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                )}
              </CField>

              <CSubmit disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </CSubmit>
            </div>
          )}
        </CForm>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-accent hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
