import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "../../../../auth";
import { getPlatformEnv } from "../../../../server";
import { createDb } from "../../../../db";
import { posts, tags, postTags } from "../../../../db/schema";
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

        // Fetch tags for this post
        const postTagRows = await db
          .select({ id: tags.id, name: tags.name, showcase: tags.showcase })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post.id));

        return Response.json({ ...post, tags: postTagRows });
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

        // Handle tagNames if provided — replace all tags
        const tagNames = body.tagNames as string[] | undefined;
        if (tagNames !== undefined) {
          // Delete existing post_tags for this post
          await db
            .delete(postTags)
            .where(eq(postTags.postId, updated.id));

          // Upsert tags and re-link
          for (const name of tagNames) {
            const [existing] = await db
              .select()
              .from(tags)
              .where(eq(tags.name, name))
              .limit(1);

            const tagId = existing ? existing.id : crypto.randomUUID();
            if (!existing) {
              await db.insert(tags).values({ id: tagId, name });
            }

            await db.insert(postTags).values({ postId: updated.id, tagId });
          }
        }

        // Fetch tags for response
        const postTagRows = await db
          .select({ id: tags.id, name: tags.name, showcase: tags.showcase })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, updated.id));

        return Response.json({ ...updated, tags: postTagRows });
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
