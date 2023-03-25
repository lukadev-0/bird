import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Spinner from "~/components/Spinner";

const DEFAULT_ERROR_MESSAGE = "An internal error occurred whilst signing in.";
const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Access Denied",
  Callback: "Authorization was rejected.",
  OAuthAccountNotLinked: "Your email is already in use by another account.",
};

const SignIn: NextPage = () => {
  const router = useRouter();
  const redirectToSignIn =
    router.isReady &&
    (!router.query.error || router.query.error === "SessionRequired");

  useEffect(() => {
    if (redirectToSignIn) {
      signIn("github").catch((err) => console.error(err));
    }
  }, [redirectToSignIn]);

  if (router.isReady && !redirectToSignIn) {
    const error =
      typeof router.query.error === "string" ? router.query.error : undefined;

    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-400">
        <ExclamationCircleIcon className="mb-2 h-12 w-12" />
        <p className="mb-4 font-medium">
          {error && error in ERROR_MESSAGES
            ? ERROR_MESSAGES[error]
            : DEFAULT_ERROR_MESSAGE}
        </p>

        <div className="flex items-center space-x-2">
          <button
            className="rounded-xl bg-gray-800 px-5 py-2 font-medium text-gray-300 hover:bg-gray-700"
            onClick={() => {
              try {
                if (typeof router.query.callbackUrl !== "string") {
                  router.push("/").catch((err) => console.error(err));
                  return;
                }

                router
                  .push(new URL(router.query.callbackUrl))
                  .catch((err) => console.error(err));
              } catch {
                router.push("/").catch((err) => console.error(err));
              }
            }}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-gray-200 px-5 py-2 font-medium text-gray-900 hover:bg-gray-400"
            onClick={() => {
              signIn("github").catch((err) => console.error(err));
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
};

export default SignIn;
