import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { eq, desc, and, inArray } from "drizzle-orm";
import { createPostSchema } from "@woe/schema/blog";
import { createAuth } from "@woe/auth";
import { createDb, posts, tags, postTags, users } from "@woe/database";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { AppEnv } from "../app";

const api = new Hono<{ Bindings: AppEnv }>();

api.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

api.all("/auth/*", (c) => {
  const url = new URL(c.req.url);
  const host = c.req.header("host") || url.host;
  const baseURL = `${url.protocol}//${host}`;
  const auth = createAuth(
    c.env.DB ? { DB: c.env.DB as D1Database } : undefined,
    undefined,
    baseURL,
  );
  return auth.handler(c.req.raw);
});

api.get("/v1/users", async (c) => {
  const d1 = c.env.DB as D1Database | undefined;

  if (d1) {
    const db = drizzle(d1, { schema: { users } });
    const [row] = await db.select({ n: count() }).from(users);
    return c.json({ count: Number(row?.n ?? 0) });
  }

  try {
    const Database = require("better-sqlite3");
    const db = new Database("local.db", { readonly: true });
    const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as
      | { count: number }
      | undefined;
    db.close();
    return c.json({ count: row?.count ?? 0 });
  } catch {
    return c.json({ count: 0 });
  }
});

api.get("/blog/posts", async (c) => {
  const auth = createAuth(
    c.env.DB ? { DB: c.env.DB as D1Database } : undefined,
    undefined,
    new URL(c.req.url).origin,
  );
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const status = c.req.query("status");
  const language = c.req.query("language");
  const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(c.req.query("limit") ?? "20", 10)),
  );

  const db = createDb(c.env.DB as D1Database);

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

  const postIds = result.map((p) => p.id);
  const tagsByPostId: Record<
    string,
    { id: string; name: string; showcase: boolean }[]
  > = {};

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
      tagsByPostId[row.postId].push({
        id: row.id,
        name: row.name,
        showcase: row.showcase,
      });
    }
  }

  return c.json(
    result.map((p) => ({ ...p, tags: tagsByPostId[p.id] ?? [] })),
  );
});

api.post("/blog/posts", async (c) => {
  const auth = createAuth(
    c.env.DB ? { DB: c.env.DB as D1Database } : undefined,
    undefined,
    new URL(c.req.url).origin,
  );
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const parsed = createPostSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues }, 400);
  }
  const { slug, title, content, language, description, thumbnailKey, tagNames } = parsed.data;

  const db = createDb(c.env.DB as D1Database);
  const now = new Date();
  const postId = crypto.randomUUID();

  const post = {
    id: postId,
    slug,
    title,
    content,
    language,
    description: description ?? "",
    thumbnailKey: thumbnailKey ?? null,
    status: "draft" as const,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(posts).values(post);

  const postTagsResult: { id: string; name: string; showcase: boolean }[] = [];
  if (tagNames && tagNames.length > 0) {
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

      await db.insert(postTags).values({ postId, tagId });
      postTagsResult.push({
        id: tagId,
        name,
        showcase: existing?.showcase ?? false,
      });
    }
  }

  return c.json({ ...post, tags: postTagsResult }, 201);
});

api.post("/blog/upload", async (c) => {
  const auth = createAuth(
    c.env.DB ? { DB: c.env.DB as D1Database } : undefined,
    undefined,
    new URL(c.req.url).origin,
  );
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return c.json({ error: "file is required" }, 400);
  }

  const ALLOWED = ["image/webp", "image/png", "image/jpeg"];
  if (!ALLOWED.includes(file.type)) {
    return c.json(
      { error: "Only WebP, PNG, and JPEG images are allowed" },
      400,
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return c.json({ error: "File size must not exceed 2 MB" }, 400);
  }

  const slug = formData.get("slug") as string | null;
  const lang = formData.get("lang") as string | null;

  if (!slug || !lang) {
    return c.json({ error: "slug and lang are required" }, 400);
  }

  const MIME_TO_EXT: Record<string, string> = {
    "image/webp": "webp",
    "image/png": "png",
    "image/jpeg": "jpg",
  };

  const ext = MIME_TO_EXT[file.type] ?? "jpg";
  const key = `blog/posts/${slug}/${lang}/thumbnail.${ext}`;

  const r2 = (c.env.portfolio_assets ?? c.env.dev_portfolio_assets) as
    | R2Bucket
    | undefined;

  if (!r2) {
    return c.json({ error: "R2 bucket not available" }, 500);
  }

  const buffer = await file.arrayBuffer();
  await r2.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ key, url: `/assets/${key}` });
});

export const apiRoutes = api;
