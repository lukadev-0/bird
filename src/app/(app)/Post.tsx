import { User } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import { Post } from "~/db/schema";

export function Post({ post }: { post: Post & { user: User } }) {
  return (
    <article className="p-4 flex gap-x-2 w-full">
      <div className="flex-shrink-0">
        <Image
          alt="profile"
          src={post.user.imageUrl}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="min-w-0">
        <div>
          <span className="text-gray-200 font-medium">
            {post.user.firstName}
          </span>
          <span className="text-gray-400 ml-2">@{post.user.username}</span>
        </div>
        <div className="text-gray-300 break-words">{post.content}</div>
      </div>
    </article>
  );
}
