"use server";

import { db } from "~/server/db";
import z from "zod";
import { MAX_POST_LENGTH, posts } from "../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { PostResource } from "./types";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/api/posts");

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
