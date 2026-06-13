import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "../../../auth";
import { getPlatformEnv } from "../../../server";

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
  const host = request.headers.get("host") || url.host;

  const auth = createAuth(
    platformEnv?.DB ? { DB: platformEnv.DB as D1Database } : undefined,
    undefined,
    `${url.protocol}//${host}`,
  );

  return auth.handler(request);
}
