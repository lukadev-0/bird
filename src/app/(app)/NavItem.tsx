"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={clsx(
        "flex rounded hover:bg-gray-500/20 px-3 py-2 -ml-3 text-gray-400 relative items-center transition",
        { "text-gray-200": isActive }
      )}
    >
      {isActive && (
        <motion.span
          layoutId="NavItem-selected"
          className="absolute left-0 h-4 bg-blue-500 w-[3px] rounded-full"
        />
      )}
      {children}
    </Link>
  );
}
