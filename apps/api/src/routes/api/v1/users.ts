import { createFileRoute } from "@tanstack/react-router";
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { users } from "@ekajaya/database";
import { getPlatformEnv } from "../../../server";
import type { D1Database } from "@cloudflare/workers-types";

function getUserCountFromLocalDb(): number {
  try {
    const Database = require("better-sqlite3");
    const db = new Database("local.db", { readonly: true });
    const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as
      | { count: number }
      | undefined;
    db.close();
    return row?.count ?? 0;
  } catch {
    return -1;
  }
}

export const Route = createFileRoute("/api/v1/users")({
  server: {
    handlers: {
      GET: async () => {
        const platformEnv = getPlatformEnv();
        const d1 = platformEnv?.DB as D1Database | undefined;

        if (d1) {
          // Production: use D1
          const db = drizzle(d1, { schema: { users } });
          const [row] = await db.select({ n: count() }).from(users);
          return Response.json({ count: Number(row?.n ?? 0) });
        }

        // Dev: use local SQLite
        const localCount = getUserCountFromLocalDb();
        if (localCount >= 0) {
          return Response.json({ count: localCount });
        }

        return Response.json({ count: 0 });
      },
    },
  },
});
