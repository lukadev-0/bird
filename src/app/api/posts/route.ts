import { clerkClient } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";
import { PostResource } from "~/server/posts/types";

export const revalidate = 10;

export async function GET() {
  const data = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    // TODO: add pagination
    limit: 20,
  });

  const users = await clerkClient.users.getUserList({
    userId: data.map((post) => post.authorId),
  });

  return Response.json(
    data.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      return {
        id: post.id,
        author: {
          id: post.authorId,
          username: author?.username ?? "Deleted User",
          name: author?.firstName ?? author?.username ?? "Deleted User",
          imageUrl: author?.imageUrl,
          verified: (author?.publicMetadata.verified as boolean) ?? false,
        },
        createdAt: post.createdAt,
        content: post.content,
      };
    }) satisfies PostResource[],
  );
}
