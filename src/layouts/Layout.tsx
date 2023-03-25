import {
  BellIcon,
  HomeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

const NavLink: React.FC<
  React.ComponentPropsWithoutRef<typeof Link> & {
    icon: React.ComponentType<{ className?: string }>;
  }
> = ({ icon: Icon, children, className, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === props.href;

  return (
    <Link
      className={clsx(
        "flex items-center  text-gray-300",
        {
          "font-medium hover:text-gray-50": !isActive,
          "font-bold text-primary-400": isActive,
        },
        className
      )}
      {...props}
    >
      <Icon className="mr-2 h-6 w-6" />
      <span>{children}</span>
    </Link>
  );
};

const Layout: React.FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-lg justify-center px-4">
      <aside className="sticky top-0 flex h-screen w-56 flex-col py-4">
        <div className="mb-6">
          <strong className="text-lg font-semibold">Bird</strong>
        </div>

        <nav className="flex flex-col space-y-4">
          <NavLink href="/" icon={HomeIcon}>
            Home
          </NavLink>
          <NavLink href="/about" icon={InformationCircleIcon}>
            About
          </NavLink>
          <NavLink href="/notifications" icon={BellIcon}>
            Notifications
          </NavLink>
        </nav>

        <div className="mt-auto">
          {status === "unauthenticated" && (
            <button
              className="w-full rounded-xl bg-primary-600 py-2 font-medium hover:bg-primary-500"
              onClick={() => {
                signIn("github").catch((err) => console.error(err));
              }}
            >
              Sign In
            </button>
          )}

          {status === "authenticated" && (
            <div className="relative flex w-full items-center space-x-2 hover:after:absolute hover:after:-inset-1 hover:after:-z-10 hover:after:rounded-md hover:after:bg-gray-800 hover:after:content-['']">
              <Image
                src={session.user.image}
                alt=""
                width={36}
                height={36}
                className="rounded-full bg-gray-800"
              />
              <div className="flex flex-col">
                <Link
                  href={`/@${session.user.handle}`}
                  className="overflow-hidden text-ellipsis font-medium after:absolute after:inset-0 after:content-['']"
                >
                  {session.user.name}
                </Link>
                <div className="-mt-1 overflow-hidden text-ellipsis text-gray-400">
                  @{session.user.handle}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main className="mx-auto w-full max-w-lg">{children}</main>
    </div>
  );
};

export default Layout;
