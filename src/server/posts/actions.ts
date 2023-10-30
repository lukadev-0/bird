"use server";

import { db } from "~/server/db";
import z from "zod";
import { MAX_POST_LENGTH, posts } from "../db/schema";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { PostResource } from "./types";
import { desc, eq, isNull } from "drizzle-orm";

export async function fetchLatestPosts(): Promise<PostResource[]> {
  const data = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    // TODO: add pagination
    limit: 20,
    where: isNull(posts.parentId),
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
        verified: (author?.publicMetadata.verified as boolean) ?? false,
      },
      createdAt: post.createdAt,
      content: post.content,
    };
  });
}

const CreatePostOptions = z.object({
  content: z.string().min(1).max(MAX_POST_LENGTH),
  parentId: z.string(),
});

export async function createPost(options: unknown): Promise<PostResource> {
  const { content, parentId } = CreatePostOptions.parse(options);

  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const post = await db
    .insert(posts)
    .values({ authorId: user.id, content, parentId })
    .returning()
    .get();

  return {
    id: post.id,
    author: {
      id: user.id,
      username: user.username ?? "",
      name: user.firstName ?? user.username ?? "",
      imageUrl: user.imageUrl,
      verified: (user?.publicMetadata.verified as boolean) ?? false,
    },
    createdAt: post.createdAt,
    content: post.content,
  };
}

const GetPostRepliesOptions = z.object({
  postId: z.string(),
});

export async function getPostReplies(
  options: unknown,
): Promise<PostResource[]> {
  const { postId } = GetPostRepliesOptions.parse(options);

  const replies = await db.query.posts.findMany({
    where: eq(posts.parentId, postId),
  });

  const users = await clerkClient.users.getUserList({
    userId: replies.map((post) => post.authorId),
  });

  return replies.map((post) => {
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
  });
}
