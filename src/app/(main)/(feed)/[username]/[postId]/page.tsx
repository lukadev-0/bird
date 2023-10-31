import { User, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { TitleBar } from "~/app/(main)/title-bar";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";
import { LargePost } from "../../post";
import { PostPageWrapper } from "./wrapper";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { BadgeCheck } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 30;

type Props = { params: { username: string; postId: string } };

async function fetchPost(postId: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      parent: {
        columns: {
          id: true,
          authorId: true,
          content: true,
        },
      },
    },
  });
  if (!post) return { post: null, user: null };

  const user = await clerkClient.users.getUser(post.authorId);
  return { post, user: (user as User | null) ?? null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post, user } = await fetchPost(params.postId);
  if (!post) notFound();

  return {
    title: `@${user?.username ?? "Deleted User"}: ${
      post.content.length > 100 ? post.content.slice(0, 99) + "…" : post.content
    }`,
    description: post.content,
    openGraph: {
      title: `@${user?.username ?? "Deleted User"} on Bird`,
      description: post.content,
      url: `/@${user?.username ?? "Deleted User"}/${post.id}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const username = decodeURIComponent(params.username).slice(1);

  const { post, user } = await fetchPost(params.postId);
  if (!post) notFound();
  if (user && user.username !== username)
    redirect(`/@${user.username}/${post.id}`);

  const parentAuthor =
    post.parent && (await clerkClient.users.getUser(post.parent.authorId));
  const parentUsername = parentAuthor?.username ?? "Deleted User";
  const parentName = parentAuthor?.firstName ?? parentUsername;

  return (
    <PostPageWrapper postId={post.id}>
      <TitleBar>Post</TitleBar>

      {post.parent && (
        <Link
          href={`/@${parentUsername}/${post.parent?.id}`}
          className="relative flex py-2 pl-16 transition hover:bg-muted/50"
        >
          <div className="absolute left-11 top-[1.7rem] -mt-0.5 ml-0.5 h-10 w-6 rounded-tl-lg border-l-2 border-t-2 border-border" />
          <Avatar className="mr-2 h-9 w-9">
            <AvatarImage src={parentAuthor?.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="-mt-1">
              <span className="font-semibold">
                {parentName}
                {(parentAuthor?.publicMetadata.verified ?? false) && (
                  <BadgeCheck className="ml-1 inline h-5 w-5 text-emerald-400" />
                )}
              </span>{" "}
              <span className="text-muted-foreground">@{parentUsername}</span>
            </div>
            <div className="-mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {post.parent.content}
            </div>
          </div>
        </Link>
      )}

      <LargePost
        className="border-b border-border pb-6"
        post={{
          id: post.id,
          createdAt: post.createdAt,
          content: post.content,
          author: {
            id: user?.id ?? "",
            username: user?.username ?? "Deleted User",
            name: user?.firstName ?? user?.username ?? "Deleted User",
            imageUrl: user?.imageUrl,
            verified: (user?.publicMetadata.verified as boolean) ?? false,
          },
        }}
      />
    </PostPageWrapper>
  );
}
