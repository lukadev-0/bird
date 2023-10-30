CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL
);
