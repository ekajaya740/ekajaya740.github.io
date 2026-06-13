import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/auth";
import { getPlatformEnv } from "@/server";
import { createDb } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
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

        // Fetch tags for all returned posts
        const postIds = result.map((p) => p.id);
        const tagsByPostId: Record<string, { id: string; name: string; showcase: boolean }[]> = {};
        if (postIds.length > 0) {
          const postTagRows = await db
            .select({
              postId: postTags.postId,
              id: tags.id,
              name: tags.name,
              showcase: tags.showcase,
            })
            .from(postTags)
            .innerJoin(tags, eq(postTags.tagId, tags.id))
            .where(inArray(postTags.postId, postIds));

          for (const row of postTagRows) {
            if (!tagsByPostId[row.postId]) tagsByPostId[row.postId] = [];
            tagsByPostId[row.postId].push({ id: row.id, name: row.name, showcase: row.showcase });
          }
        }

        return Response.json(result.map((p) => ({ ...p, tags: tagsByPostId[p.id] ?? [] })));
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
        const { slug, title, content, language, description, thumbnailKey, tagNames } = body;

        if (!slug || !title || !content) {
          return Response.json(
            { error: "slug, title, and content are required" },
            { status: 400 },
          );
        }

        const db = createDb(platformEnv?.DB as D1Database);
        const now = new Date();
        const postId = crypto.randomUUID();

        const post = {
          id: postId,
          slug: slug as string,
          language: (language as string) ?? "en",
          title: title as string,
          content: content as string,
          description: (description as string) ?? "",
          thumbnailKey: thumbnailKey ? (thumbnailKey as string) : null,
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };

        await db.insert(posts).values(post);

        // Upsert tags and link via post_tags
        const names = tagNames as string[] | undefined;
        const postTagsResult: { id: string; name: string; showcase: boolean }[] = [];
        if (names && names.length > 0) {
          for (const name of names) {
            const [existing] = await db
              .select()
              .from(tags)
              .where(eq(tags.name, name))
              .limit(1);

            const tagId = existing ? existing.id : crypto.randomUUID();
            if (!existing) {
              await db.insert(tags).values({ id: tagId, name });
            }

            await db.insert(postTags).values({ postId, tagId });
            postTagsResult.push({ id: tagId, name, showcase: existing?.showcase ?? false });
          }
        }

        return Response.json({ ...post, tags: postTagsResult }, { status: 201 });
      },
    },
  },
});
