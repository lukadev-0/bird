import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const MAX_POST_LENGTH = 400;
export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey().$default(createId),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    authorId: text("author_id").notNull(),
    content: text("content").notNull(),
    parentId: text("parent_id"),
  },
  (table) => {
    return {
      parentReference: foreignKey(() => ({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })),
      parentIdx: index("parent_id_idx").on(table.parentId),
      createdAtIdx: index("created_at_idx").on(table.createdAt),
    };
  },
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  children: many(posts, { relationName: "postReplies" }),
  parent: one(posts, {
    relationName: "postReplies",
    fields: [posts.parentId],
    references: [posts.id],
  }),
}));
