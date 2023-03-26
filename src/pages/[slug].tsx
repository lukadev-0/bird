import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { handle } = props;
  const { data: user, status } = api.users.getByHandle.useQuery(
    { handle },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  if (status !== "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-400">
        <ExclamationCircleIcon className="mb-2 h-12 w-12" />
        <p className="mb-4 font-medium">Something went wrong</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`@${user.handle} - Bird`}</title>
        <meta name="description" content="Totally not a Twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center space-x-4 pt-16 pb-8">
        <Image
          alt=""
          src={user.image}
          width={80}
          height={80}
          className="mb-2 rounded-full"
        />
        <div>
          <h1 className="-mt-1 text-2xl font-bold">{user.name}</h1>
          <div className="-mt-1 text-gray-400">@{user.handle}</div>
        </div>
      </header>

      {user.banned && (
        <div className="mb-8 rounded-md border border-red-600 bg-red-700/30 px-4 py-2">
          This user has been banned from posting.
        </div>
      )}

      <h2 className="text-lg font-medium text-gray-100">Posts</h2>
      <p>TODO</p>
    </>
  );
};

export const getStaticPaths = (): GetStaticPathsResult => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const slug = context.params?.slug as string;
  if (!slug.startsWith("@")) return { notFound: true };

  const handle = slug.slice(1);
  console.log(handle);
  await ssg.users.getByHandle.prefetch({ handle });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      handle,
    },
    revalidate: 10,
  };
};

export default ProfilePage;
