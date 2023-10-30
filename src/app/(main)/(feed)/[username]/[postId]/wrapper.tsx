"use client";

import { useUser } from "@clerk/nextjs";
import { usePostReplies } from "./use-replies";
import { cn } from "~/lib/utils";
import { PostReplies } from "./post-replies";

export function PostPageWrapper({
  children,
  postId,
}: {
  children: React.ReactNode;
  postId: string;
}) {
  const { isLoading } = usePostReplies(postId);
  const { isLoaded: isUserLoaded } = useUser();

  return (
    <div
      className={cn({ "h-screen overflow-hidden": isLoading || !isUserLoaded })}
    >
      {children}
      <PostReplies postId={postId} />
    </div>
  );
}
