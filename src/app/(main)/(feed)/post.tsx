import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatDateFromNow } from "~/lib/format-date-from-now";
import { cn } from "~/lib/utils";
import { type PostResource } from "~/server/actions/posts";

interface PostProps
  extends Omit<React.ComponentPropsWithRef<typeof Link>, "href"> {
  href?: string;
  post: PostResource;
  size?: "default" | "lg";
}

const Post = React.forwardRef<HTMLAnchorElement, PostProps>(
  ({ post, size = "default", className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn("block px-6 py-4 transition hover:bg-muted", className)}
        href={`/@${post.author.username}/${post.id}`}
        {...props}
      >
        <div className="flex space-x-2">
          <Avatar>
            <AvatarImage src={post.author.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="-mt-1">
              <span className="font-semibold">{post.author.name}</span>{" "}
              <span className="text-muted-foreground">
                @{post.author.username}
                {" · "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="underline-offset-4 hover:underline">
                      {formatDateFromNow(post.createdAt)}
                    </TooltipTrigger>
                    <TooltipContent sideOffset={0}>
                      {post.createdAt.toLocaleString("en-us", {
                        month: "short",
                        year: "numeric",
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            <div className="-mt-0.5 whitespace-pre-wrap break-all">
              {post.content}
            </div>
          </div>
        </div>
      </Link>
    );
  },
);

Post.displayName = "Post";

const PostSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("px-6 py-4")} {...props}>
      <div className="flex space-x-2">
        <div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="w-full">
          <div className="flex space-x-1">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="mt-2 w-full space-y-1 whitespace-pre-wrap">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
});

PostSkeleton.displayName = "PostSkeleton";

export { Post, PostSkeleton };
