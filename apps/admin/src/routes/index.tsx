import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { SessionResponse } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: () => {
    const navigate = useNavigate();
    const [done, setDone] = useState(false);

    useEffect(() => {
      fetch("/api/auth/session")
        .then((r) => r.json() as Promise<SessionResponse>)
        .then((data) => {
          if (data.user) {
            navigate({ to: "/dashboard", replace: true });
          } else {
            navigate({ to: "/login", replace: true });
          }
          setDone(true);
        })
        .catch(() => navigate({ to: "/login", replace: true }));
    }, [navigate]);

    if (!done) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }
    return null;
  },
});
