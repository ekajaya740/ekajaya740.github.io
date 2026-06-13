import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/auth";
import { getPlatformEnv } from "@/server";
import { createDb } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { D1Database } from "@cloudflare/workers-types";

export const Route = createFileRoute("/api/blog/posts/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        const language = url.searchParams.get("language") ?? "en";

        const platformEnv = getPlatformEnv();
        const db = createDb(platformEnv?.DB as D1Database);

        const [post] = await db
          .select()
          .from(posts)
          .where(and(eq(posts.slug, params.slug), eq(posts.language, language)))
          .limit(1);

        if (!post) return new Response("Not Found", { status: 404 });

        return Response.json(post);
      },

      PATCH: async ({ request, params }) => {
        const platformEnv = getPlatformEnv();
        const auth = createAuth(
          platformEnv?.DB
            ? { DB: platformEnv.DB as D1Database }
            : undefined,
          undefined,
          new URL(request.url).origin,
        );
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session) {
          return new Response("Unauthorized", { status: 401 });
        }

        const body: Record<string, unknown> = await request.json();
        const url = new URL(request.url);
        const language = url.searchParams.get("language") ?? "en";

        const allowedFields = [
          "title",
          "content",
          "description",
          "tags",
          "status",
          "thumbnailKey",
          "language",
        ] as const;
        const updates: Record<string, unknown> = {};

        for (const key of allowedFields) {
          if (body[key] !== undefined) {
            updates[key] = body[key];
          }
        }

        updates.updatedAt = new Date();

        // Set publishedAt timestamp when publishing for the first time
        if (body.status === "published") {
          const db = createDb(platformEnv?.DB as D1Database);
          const [existing] = await db
            .select({ publishedAt: posts.publishedAt })
            .from(posts)
            .where(
              and(eq(posts.slug, params.slug), eq(posts.language, language)),
            )
            .limit(1);

          if (existing && !existing.publishedAt) {
            updates.publishedAt = new Date();
          }
        }

        const db = createDb(platformEnv?.DB as D1Database);
        await db
          .update(posts)
          .set(updates)
          .where(and(eq(posts.slug, params.slug), eq(posts.language, language)));

        const [updated] = await db
          .select()
          .from(posts)
          .where(and(eq(posts.slug, params.slug), eq(posts.language, language)))
          .limit(1);

        return Response.json(updated);
      },

      DELETE: async ({ request, params }) => {
        const platformEnv = getPlatformEnv();
        const auth = createAuth(
          platformEnv?.DB
            ? { DB: platformEnv.DB as D1Database }
            : undefined,
          undefined,
          new URL(request.url).origin,
        );
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session) {
          return new Response("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const language = url.searchParams.get("language") ?? "en";

        const db = createDb(platformEnv?.DB as D1Database);

        // Verify post exists before deleting
        const [post] = await db
          .select({ id: posts.id })
          .from(posts)
          .where(and(eq(posts.slug, params.slug), eq(posts.language, language)))
          .limit(1);

        if (!post) return new Response("Not Found", { status: 404 });

        await db
          .delete(posts)
          .where(and(eq(posts.slug, params.slug), eq(posts.language, language)));

        return new Response(null, { status: 204 });
      },
    },
  },
});
