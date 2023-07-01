import {
  timestamp,
  mysqlTable,
  serial,
  index,
  varchar,
} from "drizzle-orm/mysql-core";
import { InferModel } from "drizzle-orm";

export const posts = mysqlTable(
  "posts",
  {
    id: serial("id").primaryKey(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),

    authorId: varchar("author_id", { length: 32 }).notNull(),
    content: varchar("content", { length: 280 }).notNull(),
  },
  (users) => {
    return {
      authorIdx: index("author_idx").on(users.authorId),
    };
  }
);

export type Post = InferModel<typeof posts>;
