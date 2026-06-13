import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: () => {
    const navigate = useNavigate();

    useEffect(() => {
      fetch("/api/auth/session")
        .then((r) => r.json())
        .then((data: unknown) => {
          const session = data as { user?: { id: string } };
          navigate({
            to: session.user ? "/dashboard" : "/login",
            replace: true,
          });
        })
        .catch(() => {
          navigate({ to: "/login", replace: true });
        });
    }, [navigate]);

    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  },
});
