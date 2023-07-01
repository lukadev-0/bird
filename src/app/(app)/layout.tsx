import Link from "next/link";
import { HomeIcon, BellIcon } from "@heroicons/react/24/outline";
import { NavItem } from "./NavItem";
import { NavUser } from "./NavUser";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen flex justify-center">
      <aside className="w-64 py-3 px-4 flex flex-col sticky top-0 h-screen flex-shrink-0">
        <Link className="text-lg font-semibold" href="/">
          Bird
        </Link>

        <nav className="py-3 space-y-1 mb-auto">
          <NavItem href="/">
            <HomeIcon className="h-6 w-6 mr-2" />
            Home
          </NavItem>
          <NavItem href="/notifications">
            <BellIcon className="h-6 w-6 mr-2" />
            Notifications
          </NavItem>
        </nav>

        <NavUser />
      </aside>

      <main className="border-x border-gray-800 max-w-2xl w-full">
        {children}
      </main>

      <aside className="w-64 pt-3 px-4 text-gray-400 sticky top-0 h-screen flex-shrink-0">
        TODO: put content here
      </aside>
    </div>
  );
}
