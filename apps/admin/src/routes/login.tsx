import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import type { ReactNode, FormEvent } from "react";
import { CForm, CField, CInput, CSubmit } from "@ekajaya/ui/composed";
import { signInSchema } from "@ekajaya/schema/auth";

import type { SessionResponse } from "@/lib/auth";
export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, string | undefined>): { redirect?: string } => ({
    redirect: search.redirect || undefined,
  }),
  component: LoginComponent,
});

function LoginComponent(): ReactNode {
  const navigate = useNavigate();
  const redirect = useSearch({ strict: false })?.redirect ?? "/dashboard";
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then(r => r.json() as Promise<SessionResponse>)
      .then((data: SessionResponse) => {
        if (data.user) navigate({ to: redirect });
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

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
      navigate({ to: redirect });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-1 text-sm text-gray-500">Admin dashboard access</p>
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

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
