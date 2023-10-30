"use server";

import { db } from "~/server/db";
import z from "zod";
import { clerkClient } from "@clerk/nextjs";
import { MAX_POST_LENGTH, posts } from "../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";

export type PostResource = {
  id: string;
  author: PostAuthorResource;
  createdAt: Date;
  content: string;
};

export type PostAuthorResource = {
  id: string;
  username: string;
  name: string;
  imageUrl?: string;
};

export async function fetchLatestPosts(): Promise<PostResource[]> {
  const data = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
  });

  const users = await clerkClient.users.getUserList({
    userId: data.map((post) => post.authorId),
  });

  return data.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    return {
      id: post.id,
      author: {
        id: post.authorId,
        username: author?.username ?? "Deleted User",
        name: author?.firstName ?? author?.username ?? "Deleted User",
        imageUrl: author?.imageUrl,
      },
      createdAt: post.createdAt,
      content: post.content,
    };
  });
}

const CreatePostOptions = z.object({
  content: z.string().min(1).max(MAX_POST_LENGTH),
});

export async function createPost(options: unknown): Promise<PostResource> {
  const { content } = CreatePostOptions.parse(options);

  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const post = await db
    .insert(posts)
    .values({ authorId: user.id, content })
    .returning()
    .get();

  return {
    id: post.id,
    author: {
      id: user.id,
      username: user.username ?? "",
      name: user.firstName ?? user.username ?? "",
      imageUrl: user.imageUrl,
    },
    createdAt: post.createdAt,
    content: post.content,
  };
}
