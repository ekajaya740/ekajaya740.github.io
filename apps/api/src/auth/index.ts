import type { D1Database, IncomingRequestCfProperties } from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { schema, users } from "@ekajaya/database";

export interface AuthBindings {
  DB: D1Database;
}

function createAuth(
  env?: AuthBindings,
  cf?: IncomingRequestCfProperties,
  baseURL?: string,
) {
  const db = env
    ? drizzle(env.DB, { schema, logger: true })
    : ({} as ReturnType<typeof drizzle<typeof schema>>);

  return betterAuth({
    baseURL,
    ...withCloudflare(
      {
        d1: env
          ? { db: db as any, options: { usePlural: true } }
          : undefined,
        cf: cf ?? ({} as IncomingRequestCfProperties),
      },
      {
        emailAndPassword: {
          enabled: true,
        },
      },
    ),
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if ("select" in db && typeof db.select === "function") {
              const [row] = await db.select({ n: count() }).from(users);
              const isFirst = Number(row?.n ?? 0) === 0;
              return {
                data: {
                  ...user,
                  role: isFirst ? "SUPERADMIN" : "editor",
                },
              };
            }
            return {
              data: {
                ...user,
                role: "editor",
              },
            };
          },
        },
      },
    },
    // Provide drizzle adapter for CLI schema generation
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: "sqlite",
            usePlural: true,
          }),
        }),
  });
}

// CLI export (no env — used by @better-auth/cli generate)
export const auth = createAuth();

// Runtime export
export { createAuth };
