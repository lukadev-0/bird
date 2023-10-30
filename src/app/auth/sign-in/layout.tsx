"use client";
import { Card } from "~/components/ui/card";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useSignIn();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [router, isSignedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="relative w-96 p-4">
        {(!isLoaded || !isAuthLoaded || isSignedIn) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
        <div
          className={cn("transition-opacity duration-500", {
            "pointer-events-none opacity-0": !isLoaded,
          })}
        >
          {children}
        </div>
      </Card>
    </div>
  );
}
