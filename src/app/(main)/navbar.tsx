"use client";

import {
  useUser,
  SignInButton,
  SignedIn,
  SignedOut,
  useClerk,
} from "@clerk/nextjs";
import {
  Bell,
  Home,
  LogOut,
  Monitor,
  Moon,
  MoreVertical,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SignOutAlertDialog } from "~/components/sign-out-alert-dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function Navbar() {
  const { isLoaded, user } = useUser();
  const { loaded } = useClerk();

  return (
    <header className="sticky top-0 z-20 flex h-screen w-64 flex-shrink-0 flex-col border-r border-border px-2">
      <div className="flex h-12 items-center px-2">
        <Link href="/" className="text-lg font-semibold">
          Bird
        </Link>
      </div>

      {isLoaded && (
        <>
          <nav>
            <NavbarItem href="/">
              <Home className="mr-2" />
              Home
            </NavbarItem>
            {user && (
              <>
                <NavbarItem href="/notifications">
                  <Bell className="mr-2" />
                  Notifications
                </NavbarItem>
                <NavbarItem href={`/@${user?.username}`}>
                  <User className="mr-2" />
                  Profile
                </NavbarItem>
              </>
            )}
          </nav>

          {loaded && (
            <>
              <SignedOut>
                <NavbarSignIn />
              </SignedOut>
              <SignedIn>
                <NavbarUser />
              </SignedIn>
            </>
          )}
        </>
      )}
    </header>
  );
}

function NavbarItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      asChild
      className={cn("flex justify-start px-2 text-base text-muted-foreground", {
        "font-medium text-foreground": pathname === href,
      })}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function NavbarSignIn() {
  const { setTheme } = useTheme();

  return (
    <div className="mt-auto flex space-x-1 px-2 pb-4">
      <SignInButton>
        <Button className="mt-auto flex-grow">Sign In</Button>
      </SignInButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NavbarUser() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group mb-2 mt-auto flex h-auto justify-start px-2 text-left text-base"
          >
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback asChild>
                <Skeleton />
              </AvatarFallback>
            </Avatar>
            <div className="relative -mt-1 ml-2 w-full overflow-hidden">
              <div className="text overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {user.firstName ?? user.username}
              </div>
              <div className="-mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                @{user.username}
              </div>
            </div>
            <div className="ml-auto">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" collisionPadding={8} className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <SignOutAlertDialog />
    </AlertDialog>
  );
}
