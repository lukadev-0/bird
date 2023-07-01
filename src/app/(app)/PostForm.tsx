"use client";

import Image from "next/image";
import { TextareaAutosize } from "~/components/TextareaAutosize";
import { addPost } from "./actions";
import { useRef, useState, useTransition } from "react";
import clsx from "clsx";

const CONTENT_MAX_LENGTH = 280;

export function PostForm({ userImageUrl }: { userImageUrl: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>();

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          addPost(formData);
          setContent("");
        });
      }}
      ref={formRef}
    >
      <div className="flex px-4 pt-4">
        <div>
          <Image
            alt="profile"
            src={userImageUrl}
            className="flex-shrink-0 rounded-full"
            width={48}
            height={48}
          />
        </div>
        <div className="pt-2 w-full">
          <TextareaAutosize
            name="content"
            className="bg-transparent resize-none w-full text-lg ml-2 outline-none"
            placeholder="What's happening?"
            value={content}
            style={{ height: 28 }}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
        </div>
      </div>

      <div className="flex justify-end border-b border-gray-800 px-4 pt-1 pb-4 items-center">
        <p
          className={clsx({
            "text-gray-300": content.length <= CONTENT_MAX_LENGTH,
            "text-red-400": content.length > CONTENT_MAX_LENGTH,
          })}
        >
          {CONTENT_MAX_LENGTH - content.length}
        </p>
        <button
          type="submit"
          className="px-4 py-1 rounded bg-blue-600 enabled:hover:bg-blue-500 disabled:opacity-50 ml-2"
          disabled={
            isPending ||
            content.length < 1 ||
            content.length > CONTENT_MAX_LENGTH
          }
        >
          Post
        </button>
      </div>
    </form>
  );
}
