// @ts-nocheck
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { users } from "@ekajaya/database";
import type { D1Database } from "@cloudflare/workers-types";

// Dynamically import the built SSR handler to avoid virtual import issues
// The built output at dist/server/index.js has all virtual imports resolved
let ssrHandler: ((request: Request) => Response | Promise<Response>) | null = null;

async function getHandler() {
  if (!ssrHandler) {
    const mod = await import("../dist/server/index.js");
    ssrHandler = mod.default;
  }
  return ssrHandler;
}

export default {
  async fetch(request: Request, env: { DB: D1Database }): Promise<Response> {
    const url = new URL(request.url);

    // Redirect /login to /register when no users exist (first-user flow)
    if (url.pathname === "/login") {
      try {
        const db = drizzle(env.DB, { schema: { users } });
        const [row] = await db.select({ n: count() }).from(users);
        if (Number(row?.n ?? 0) === 0) {
          return new Response(null, {
            status: 307,
            headers: { Location: "/register" },
          });
        }
      } catch {
        // fall through
      }
    }

    const handler = await getHandler();
    return handler(request);
  },
};
