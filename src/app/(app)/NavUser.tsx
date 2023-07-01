"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function SignedInNavUser() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (isLoaded && !isSignedIn) return <p>Something went wrong</p>;

  return (
    <div
      className="flex items-center transition-opacity duration-700"
      style={{ opacity: isLoaded ? 1 : 0 }}
    >
      {user && (
        <>
          <div className="w-8 h-8">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
          <div className="ml-2">
            <div className="font-medium -mt-1">
              {user.fullName || user.username}
            </div>
            <div className="text-sm text-gray-400 -mt-1">@{user.username}</div>
          </div>
        </>
      )}
    </div>
  );
}

export function NavUser() {
  return (
    <div>
      <SignedIn>
        <SignedInNavUser />
      </SignedIn>
      <SignedOut>
        <Link
          href="/auth/sign-in"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 inline-block font-medium w-full text-center"
        >
          Sign In
        </Link>
      </SignedOut>
    </div>
  );
}
