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
}

const CreatePost = React.forwardRef<HTMLFormElement, CreatePostProps>(
  ({ user, onSubmit, ...props }, ref) => {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit({ content });
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        <div className="mb-1 flex space-x-2">
          <Avatar>
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>

          <div className="flex w-full items-center">
            <TextareaAutosize
              placeholder="What's happening?!"
              className="-mt-0.5 w-full resize-none bg-transparent text-lg placeholder-muted-foreground outline-none"
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex items-center">
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
