ALTER TABLE `posts` DROP COLUMN `tags`;
--> statement-breakpoint
CREATE TABLE `tags` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `showcase` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);
--> statement-breakpoint
CREATE TABLE `post_tags` (
  `post_id` text NOT NULL REFERENCES `posts`(`id`) ON DELETE CASCADE,
  `tag_id` text NOT NULL REFERENCES `tags`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`post_id`, `tag_id`)
);
