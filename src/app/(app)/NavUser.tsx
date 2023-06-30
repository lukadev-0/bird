"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

function SignedInNavUser() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <p>Something went wrong</p>;

  return (
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
        <div className="text-sm text-gray-300 -mt-1">@{user.username}</div>
      </div>
    </>
  );
}

export function NavUser() {
  return (
    <div className="flex items-center">
      <SignedIn>
        <SignedInNavUser />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
