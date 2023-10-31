export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-w-0 flex-grow flex-col">{children}</div>
      <div className="sticky top-0 z-20 flex h-screen w-64 flex-shrink-0 flex-col border-l border-l-border p-4">
        <Technologies />
      </div>
    </>
  );
}

function Technologies() {
  return (
    <>
      <p className="mb-1 text-sm text-muted-foreground">
        Bird is an{" "}
        <a
          href="https://github.com/lukadev-0/bird"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          open source
        </a>{" "}
        Twitter/X clone built with:
      </p>
      <p className="text-sm text-muted-foreground">
        <a
          href="https://nextjs.org/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Next.js
        </a>
        ,{" "}
        <a
          href="https://tailwindcss.com/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          TailwindCSS
        </a>
        ,{" "}
        <a
          href="https://ui.shadcn.com/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          shadcn/ui
        </a>
        ,{" "}
        <a
          href="https://turso.tech/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Turso
        </a>
        ,{" "}
        <a
          href="https://orm.drizzle.team/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Drizzle ORM
        </a>
        ,{" "}
        <a
          href="https://clerk.com/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Clerk
        </a>{" "}
        and{" "}
        <a
          href="https://bun.sh"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Bun
        </a>
        .
      </p>
    </>
  );
}
