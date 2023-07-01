import { clerkClient } from "@clerk/nextjs";
import { db } from "~/db";
import { posts } from "~/db/schema";
import { PostForm } from "./PostForm";
import { currentUser } from "@clerk/nextjs";
import { Post } from "./Post";
import { desc } from "drizzle-orm";

async function fetchPosts() {
  const result = await db
    .select()
    .from(posts)
    .limit(25)
    .orderBy(desc(posts.createdAt));
  const users = await clerkClient.users.getUserList({
    userId: result.map((post) => post.authorId),
  });

  return result.map((post) => ({
    ...post,
    user: users.find((user) => user.id === post.authorId),
  }));
}

export default async function Home() {
  const postsData = await fetchPosts();
  const user = await currentUser();

  return (
    <>
      {user && <PostForm userImageUrl={user.imageUrl} />}
      {postsData.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
