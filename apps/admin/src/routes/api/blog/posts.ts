import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/auth";
import { getPlatformEnv } from "@/server";
import { createDb } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { D1Database } from "@cloudflare/workers-types";

export const Route = createFileRoute("/api/blog/posts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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
        const status = url.searchParams.get("status");
        const language = url.searchParams.get("language");
        const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));

        const db = createDb(platformEnv?.DB as D1Database);

        const conditions = [];
        if (status) conditions.push(eq(posts.status, status));
        if (language) conditions.push(eq(posts.language, language));

        const result = await db
          .select()
          .from(posts)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset((page - 1) * limit);

        return Response.json(result);
      },

      POST: async ({ request }) => {
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
        const { slug, title, content, language, description, tags, thumbnailKey } = body;

        if (!slug || !title || !content) {
          return Response.json(
            { error: "slug, title, and content are required" },
            { status: 400 },
          );
        }

        const db = createDb(platformEnv?.DB as D1Database);
        const now = new Date();

        const post = {
          id: crypto.randomUUID(),
          slug: slug as string,
          language: (language as string) ?? "en",
          title: title as string,
          content: content as string,
          description: (description as string) ?? "",
          tags: (tags as string) ?? "[]",
          thumbnailKey: thumbnailKey ? (thumbnailKey as string) : null,
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };

        await db.insert(posts).values(post);

        return Response.json(post, { status: 201 });
      },
    },
  },
});
