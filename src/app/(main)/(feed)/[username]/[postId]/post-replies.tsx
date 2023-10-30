"use client";

import { CreatePost } from "../../create-post";
import { useUser } from "@clerk/nextjs";
import { usePostReplies } from "./use-replies";
import { Post, PostSkeleton } from "../../post";
import { createPost } from "~/server/posts/actions";

export function PostReplies({ postId }: { postId: string }) {
  const { data, isLoading, mutate } = usePostReplies(postId);
  const { user, isLoaded: isUserLoaded } = useUser();

  return (
    <div>
      {(!isUserLoaded || isLoading) && (
        <div className="divide-y border-b border-border">
          {Array(20)
            .fill(undefined)
            .map((_, i) => (
              <PostSkeleton key={i} />
            ))}
        </div>
      )}

      {isUserLoaded && data && (
        <>
          {user && (
            <div className="border-b border-border px-6 py-4">
              <CreatePost
                reply
                user={user}
                onSubmit={async (values) => {
                  await createPost({
                    content: values.content,
                    parentId: postId,
                  });
                  mutate();
                }}
              />
            </div>
          )}

          {data.length > 0 && (
            <div className="divide-y border-b border-border">
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
