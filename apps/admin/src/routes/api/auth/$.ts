import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/auth";
import { getPlatformEnv } from "@/server";
import type { D1Database } from "@cloudflare/workers-types";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});

async function handleAuth(request: Request) {
  const platformEnv = getPlatformEnv();
  const url = new URL(request.url);

  const auth = createAuth(
    platformEnv?.DB ? { DB: platformEnv.DB as D1Database } : undefined,
    undefined,
    `${url.protocol}//${url.host}`,
  );

  return auth.handler(request);
}
