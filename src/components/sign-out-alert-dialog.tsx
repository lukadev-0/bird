"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export const SignOutAlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogContent>,
  React.ComponentPropsWithoutRef<typeof AlertDialogContent>
>((props, ref) => {
  const router = useRouter();

  return (
    <AlertDialogContent {...props} ref={ref}>
      <AlertDialogHeader>
        <AlertDialogTitle>Sign out of Bird?</AlertDialogTitle>
        <AlertDialogDescription>
          You can sign back in at any time.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <SignOutButton signOutCallback={() => router.push("/")}>
          <AlertDialogAction>Sign Out</AlertDialogAction>
        </SignOutButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});
SignOutAlertDialog.displayName = "SignOutAlertDialog";
