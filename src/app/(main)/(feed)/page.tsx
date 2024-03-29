"use client";

import { TitleBar } from "../title-bar";
import { createPost, fetchLatestPosts } from "~/server/posts/actions";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { CreatePost } from "./create-post";
import { AlertCircle } from "lucide-react";
import { Post, PostSkeleton } from "./post";
import { cn } from "~/lib/utils";

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR("fetchLatestPosts", () =>
    fetchLatestPosts(),
  );
  const { user, isLoaded: userIsLoaded } = useUser();

  return (
    <div
      className={cn({ "h-screen overflow-hidden": isLoading || !userIsLoaded })}
    >
      <TitleBar>Home</TitleBar>

      {(isLoading || !userIsLoaded) && (
        <div className="h-screen divide-y divide-border overflow-hidden border-b border-border">
          {Array(20)
            .fill(undefined)
            .map((_, i) => (
              <PostSkeleton key={i} />
            ))}
        </div>
      )}

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
    </div>
  );
}
