import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { AsyncLocalStorage } from "node:async_hooks";
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { users } from "@ekajaya/database";
import type { D1Database } from "@cloudflare/workers-types";

const envStorage = new AsyncLocalStorage<Record<string, unknown>>();

export function getPlatformEnv(): Record<string, unknown> | undefined {
  return envStorage.getStore();
}

export default createServerEntry({
  fetch(request, env) {
    const url = new URL(request.url);

    // Redirect /login to /register when no users exist (first-user flow)
    if (url.pathname === "/login") {
      return envStorage.run(env as Record<string, unknown>, async () => {
        try {
          const d1 = (env as Record<string, unknown>).DB as D1Database;
          const db = drizzle(d1, { schema: { users } });
          const [row] = await db.select({ n: count() }).from(users);
          if (Number(row?.n ?? 0) === 0) {
            return new Response(null, {
              status: 307,
              headers: { Location: "/register" },
            });
          }
        } catch {
          // DB check failed — fall through to normal handler
        }
        return handler.fetch(request);
      });
    }

    return envStorage.run(
      env as Record<string, unknown>,
      () => handler.fetch(request),
    );
  },
});
