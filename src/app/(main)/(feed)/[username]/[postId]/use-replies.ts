"use client";

import useSWR from "swr";
import { getPostReplies } from "~/server/posts/actions";

export function usePostReplies(postId: string) {
  return useSWR(["getPostReplies", postId], () => getPostReplies({ postId }));
}
