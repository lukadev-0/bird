import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const MAX_POST_LENGTH = 400;
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$default(createId),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  authorId: text("author_id").notNull(),
  content: text("content").notNull(),
});
