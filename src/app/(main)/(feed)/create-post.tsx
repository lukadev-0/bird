"use client";

import { UserResource } from "@clerk/types";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { MAX_POST_LENGTH } from "~/server/db/schema";

export interface CreatePostProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  user: UserResource;
  onSubmit: (values: { content: string }) => void;
  reply?: boolean;
}

const CreatePost = React.forwardRef<HTMLFormElement, CreatePostProps>(
  ({ user, onSubmit, reply, ...props }, ref) => {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit({ content });

      setContent("");
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        <div
          className={cn("flex space-x-2", {
            "mb-1": !(reply && content === ""),
          })}
        >
          <Avatar>
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>

          <div className="flex w-full items-center">
            <TextareaAutosize
              placeholder={reply ? "Post your reply" : "What's happening?!"}
              className="-mt-0.5 w-full resize-none bg-transparent text-lg placeholder-muted-foreground outline-none"
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />
          </div>
        </div>
        <div
          className={cn("flex items-center", {
            hidden: reply && content === "",
          })}
        >
          <div
            className={cn("ml-auto mr-4 text-sm text-muted-foreground", {
              "text-destructive": content.length > MAX_POST_LENGTH,
            })}
          >
            {content.length}/{MAX_POST_LENGTH}
          </div>
          <Button disabled={content.length > MAX_POST_LENGTH || content === ""}>
            Post
          </Button>
        </div>
      </form>
    );
  },
);

CreatePost.displayName = "CreatePost";
export { CreatePost };
