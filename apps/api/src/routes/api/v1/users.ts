import { createFileRoute } from "@tanstack/react-router";
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { users } from "@ekajaya/database";
import { getPlatformEnv } from "../../../server";
import type { D1Database } from "@cloudflare/workers-types";

export const Route = createFileRoute("/api/v1/users")({
  server: {
    handlers: {
      GET: async () => {
        const platformEnv = getPlatformEnv();
        const d1 = platformEnv?.DB as D1Database | undefined;
        if (!d1) {
          return Response.json({ count: 0 });
        }
        const db = drizzle(d1, { schema: { users } });
        const [row] = await db.select({ n: count() }).from(users);
        return Response.json({ count: Number(row?.n ?? 0) });
      },
    },
  },
});
