PRAGMA foreign_keys=OFF;

CREATE TABLE `new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (parent_id) REFERENCES posts(id)
);
INSERT INTO new_posts SELECT id, created_at, author_id, content FROM posts;
DROP TABLE posts;
ALTER TABLE new_posts RENAME TO posts;

CREATE INDEX `parent_id_idx` ON `posts` (`parent_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/
