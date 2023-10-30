"use client";

import { TitleBar } from "../title-bar";
import { createPost, fetchLatestPosts } from "~/server/actions/posts";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { CreatePost } from "./create-post";
import { AlertCircle } from "lucide-react";
import { Post } from "./post";

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR(
    ["fetchLatestPosts"],
    () => {
      return fetchLatestPosts();
    },
  );
  const { user, isLoaded: userIsLoaded } = useUser();

  return (
    <>
      <TitleBar>Home</TitleBar>

      {!isLoading && userIsLoaded && (
        <>
          {user && (
            <div className="border-b border-border px-6 pb-4 pt-1">
              <CreatePost
                user={user}
                onSubmit={async (values) => {
                  await createPost(values);
                  mutate();
                }}
              />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center p-6 text-muted-foreground">
              <AlertCircle className="mb-1 h-8 w-8" />
              <p>Failed to fetch posts</p>
            </div>
          )}

          {data && (
            <div className="divide-y divide-border border-b border-border">
              {data.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
