import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { AsyncLocalStorage } from "node:async_hooks";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/d1";
import { count as dCount } from "drizzle-orm";
import { users } from "@ekajaya/database";
import type { D1Database } from "@cloudflare/workers-types";

const envStorage = new AsyncLocalStorage<Record<string, unknown>>();

export function getPlatformEnv(): Record<string, unknown> | undefined {
  return envStorage.getStore();
}

function getUserCountFromLocalDb(): number {
  try {
    const dbPath = resolve(process.cwd(), "local.db");
    const db = new Database(dbPath, { readonly: true });
    const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as
      | { count: number }
      | undefined;
    db.close();
    return row?.count ?? 0;
  } catch {
    return -1;
  }
}

export default createServerEntry({
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/login") {
      return envStorage.run(env as Record<string, unknown>, async () => {
        try {
          const d1 = (env as Record<string, unknown>).DB as D1Database | undefined;
          let userCount: number;

          if (d1) {
            const db = drizzle(d1, { schema: { users } });
            const [row] = await db.select({ n: dCount() }).from(users);
            userCount = Number(row?.n ?? 0);
          } else {
            userCount = getUserCountFromLocalDb();
          }

          if (userCount === 0) {
            return new Response(null, {
              status: 307,
              headers: { Location: "/register" },
            });
          }
        } catch {
          // fall through
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
