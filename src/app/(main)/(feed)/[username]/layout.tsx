import { notFound } from "next/navigation";

export default function UserLayout({
  params,
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  const rawUsername = decodeURIComponent(params.username);
  if (!rawUsername.startsWith("@")) notFound();

  return children;
}
