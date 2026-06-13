CREATE TABLE `posts` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `language` text NOT NULL DEFAULT 'en',
  `title` text NOT NULL,
  `description` text DEFAULT '',
  `content` text NOT NULL,
  `thumbnail_key` text,
  `author` text NOT NULL DEFAULT 'I Putu Ekajaya Awidya Putra',
  `tags` text DEFAULT '[]',
  `status` text NOT NULL DEFAULT 'draft',
  `published_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_lang_unique` ON `posts` (`slug`, `language`);
--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);
--> statement-breakpoint
CREATE INDEX `posts_published_at_idx` ON `posts` (`published_at`);
