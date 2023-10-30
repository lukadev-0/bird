"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SignInSSOCallback() {
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  const processing = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (processing.current) return;
    if (!signIn || !signUp) return;

    processing.current = true;

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === "transferable" &&
      signUp.verifications.externalAccount.error?.code ===
        "external_account_exists";

    if (userExistsButNeedsToSignIn) {
      signIn
        .create({ transfer: true })
        .then((res) => {
          if (res.status === "complete") {
            setActive({ session: res.createdSessionId });
            router.push("/");
          } else {
            console.error("Failed to transfer to sign in, response:", res);
            setFailed(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setFailed(true);
        });
      return;
    }

    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === "transferable";

    if (userNeedsToBeCreated) {
      signUp
        .create({
          transfer: true,
        })
        .then((res) => {
          if (res.status === "complete") {
            setActive({ session: res.createdSessionId }).then(() =>
              router.push("/onboarding"),
            );
          } else {
            console.error("Failed to transfer to sign up, response:", res);
            setFailed(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setFailed(true);
        });
      return;
    }

    if (!signIn.status && !signUp.status) {
      return router.push("/");
    }

    // The OAuth flow should have completed by now.
    // The user either got transferred to sign in or sign up, or the flow has been completed
    // and the user has been redirected.
    //
    // TODO: handle the case where an existing user has the user's username

    console.error("Unexpected state", { signIn, signUp });
    setFailed(true);
  }, [signIn, signUp, setActive, router]);

  if (failed)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Failed to authenticate user.</p>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
