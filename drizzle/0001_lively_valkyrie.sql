PRAGMA foreign_keys=OFF;--> statement-breakpoint


CREATE TABLE `new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	`parent_id` text,
	FOREIGN KEY(parent_id) REFERENCES posts(id)
);--> statement-breakpoint

INSERT INTO `new_posts` (id, created_at, author_id, content) SELECT id, created_at, author_id, content FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `new_posts` RENAME TO `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint

CREATE INDEX `parent_id_idx` ON `posts` (`parent_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint

PRAGMA foreign_key_check;--> statement-breakpoint

PRAGMA foreign_keys=ON;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/
