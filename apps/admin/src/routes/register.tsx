import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { CForm, CField, CInput, CSubmit } from "@ekajaya/ui/composed";
import { signUpSchema } from "@ekajaya/schema/auth";

export const Route = createFileRoute("/register")({
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
  component: RegisterComponent,
});

function RegisterComponent(): ReactNode {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: Record<string, unknown>): Promise<void> => {
    setError(null);
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const err = (await res.json()) as { message?: string };
        throw new Error(err.message ?? "Registration failed");
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            First sign-up gets SUPERADMIN role
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <CForm
          defaultValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <div className="space-y-4">
              <CField name="name" form={form} label="Name">
                {(field) => (
                  <CInput field={field} placeholder="Your name" required />
                )}
              </CField>

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
                    placeholder="Min 8 characters"
                    required
                  />
                )}
              </CField>

              <CSubmit disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </CSubmit>
            </div>
          )}
        </CForm>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
