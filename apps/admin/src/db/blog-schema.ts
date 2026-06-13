import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Supported languages — ISO 639-1 codes. Add new languages here. */
export const BLOG_LANGUAGES = ["en", "id"] as const;

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    language: text("language").notNull().default("en"),
    title: text("title").notNull(),
    description: text("description").default(""),
    content: text("content").notNull(), // Editor.js JSON output
    thumbnailKey: text("thumbnail_key"), // R2 object key
    author: text("author").notNull().default("I Putu Ekajaya Awidya Putra"),
    tags: text("tags").default("[]"), // JSON array of strings
    status: text("status").notNull().default("draft"), // 'draft' | 'published'
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("posts_slug_lang_unique").on(table.slug, table.language),
    index("posts_status_idx").on(table.status),
    index("posts_published_at_idx").on(table.publishedAt),
  ],
);
