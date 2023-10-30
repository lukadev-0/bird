import { clerkClient } from "@clerk/nextjs/server";
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

export const revalidate = 30;

export default async function PostPage({
  params,
}: {
  params: { username: string; postId: string };
}) {
  const username = decodeURIComponent(params.username).slice(1);

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, params.postId),
    with: {
      parent: {
        columns: {
          id: true,
          authorId: true,
        },
      },
    },
  });

  if (!post) notFound();

  const user = await clerkClient.users.getUser(post.authorId);
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
          className="relative flex items-center py-2 pl-16 transition hover:bg-muted/50"
        >
          <div className="absolute left-11 top-6 -mt-0.5 ml-0.5 h-9 w-6 rounded-tl-lg border-l-2 border-t-2 border-border" />
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src={parentAuthor?.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold">{parentName}</span>{" "}
            <span className="text-muted-foreground">@{parentUsername}</span>
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
            id: user.id,
            username: user.username ?? "Deleted User",
            name: user.firstName ?? user.username ?? "Deleted User",
            imageUrl: user.imageUrl,
            verified: (user.publicMetadata.verified as boolean) ?? false,
          },
        }}
      />
    </PostPageWrapper>
  );
}
