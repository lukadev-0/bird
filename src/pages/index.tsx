import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const MAX_LENGTH = 280;

const PostForm: React.FC<{ session: Session }> = ({ session }) => {
  const [value, setValue] = useState("");

  const utils = api.useContext();
  const mutation = api.posts.create.useMutation({
    onSuccess: () => {
      setValue("");
      utils.posts.getAll.invalidate().catch((err) => console.error(err));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.length > 280) return;

        mutation.mutate({
          content: value,
        });
      }}
    >
      <div className="mb-2 flex items-start space-x-2">
        <div>
          <Image
            src={session.user.image}
            alt=""
            width={56}
            height={56}
            className="rounded-full bg-gray-800"
          />
        </div>
        <div className="mt-2 w-full transition-colors">
          <TextareaAutosize
            className="w-full resize-none bg-transparent text-lg outline-none"
            placeholder="What's happening?"
            onChange={(e) => setValue(e.currentTarget.value)}
            value={value}
          />
        </div>
      </div>

      <div className="flex items-center">
        {value.length > MAX_LENGTH && (
          <div className="text-red-500">
            Must be under {MAX_LENGTH} characters
          </div>
        )}

        <div className="ml-auto text-gray-400">
          {value.length}/{MAX_LENGTH}
        </div>

        <button
          type="submit"
          className="ml-4 rounded-full bg-primary-600 px-6 py-1.5 font-medium disabled:bg-gray-700 disabled:opacity-50"
          disabled={
            value.length === 0 ||
            value.length > MAX_LENGTH ||
            mutation.isLoading
          }
        >
          Post
        </button>
      </div>
    </form>
  );
};

const Home: NextPage = () => {
  const { data: posts, status } = api.posts.getAll.useQuery();
  const { data: session, status: sessionStatus } = useSession();

  return (
    <>
      <Head>
        <title>Bird</title>
        <meta name="description" content="Totally not a Twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="pt-16 pb-8">
        {sessionStatus === "loading" && (
          <div className="flex justify-center pt-16">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {sessionStatus !== "loading" && (
          <>
            {sessionStatus === "authenticated" && (
              <div className="mb-6 border-b border-gray-600 pb-5">
                <PostForm session={session} />
              </div>
            )}

            <section className="space-y-4">
              {status === "loading" && (
                <div className="flex justify-center pt-16">
                  <Spinner className="h-8 w-8" />
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center pt-16 font-medium text-gray-400">
                  <ExclamationCircleIcon className="h-12 w-12" />
                  <p>Something went wrong</p>
                </div>
              )}

              {status === "success" &&
                posts.map((post) => (
                  <article key={post.id} className="flex">
                    <div className="mr-2 flex-shrink-0">
                      <Image
                        src={post.author.image}
                        alt=""
                        width={56}
                        height={56}
                        className="rounded-full bg-gray-800"
                      />
                    </div>
                    <div className="mt-0.5 w-full">
                      <Link
                        href={`/@${post.author.handle}`}
                        className="space-x-2"
                      >
                        <span className="font-medium">{post.author.name}</span>
                        <span className="text-gray-400">
                          @{post.author.handle}
                        </span>
                      </Link>
                      <p className="break-words">{post.content}</p>
                    </div>
                  </article>
                ))}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
