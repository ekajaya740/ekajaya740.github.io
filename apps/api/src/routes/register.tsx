import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CForm, CField, CInput, CSubmit } from "@ekajaya/ui/composed";
import { signUpSchema } from "@ekajaya/schema/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    // If already logged in, go to dashboard
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

  const handleSubmit = async (values: Record<string, unknown>): Promise<void> => {
    const res = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      throw new Error(err.message ?? "Registration failed");
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register admin access</p>
        </div>

        <CForm
          defaultValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validators={{ onSubmit: signUpSchema }}
        >
          {(form) => (
            <div className="space-y-4">
              <CField name="name" form={form} label="Name">
                {(field) => (
                  <CInput
                    field={field}
                    placeholder="Your name"
                    required
                  />
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
                    placeholder="••••••••"
                    required
                  />
                )}
              </CField>

              <CSubmit disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? "Creating account..." : "Create Account"}
              </CSubmit>
            </div>
          )}
        </CForm>
      </div>
    </div>
  );
}
