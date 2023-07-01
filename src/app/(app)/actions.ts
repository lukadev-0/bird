"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "~/db";
import { posts } from "~/db/schema";

const CONTENT_MAX_LENGTH = 280;

export async function addPost(data: FormData) {
  const content = data.get("content");

  if (typeof content !== "string" || content.length > CONTENT_MAX_LENGTH)
    throw new Error("Invalid content");

  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(posts).values({
    authorId: userId,
    content,
  });

  revalidatePath("/");
}
