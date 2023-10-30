import { notFound } from "next/navigation";

// Next.js requires the global 404 page to be within `app/not-found`, however we want to use
// the main app layout. This catch-all route just calls `notFound()` which causes Next.js to
// render the `app/(main)/not-found.tsx` component.
export default function NotFoundCatchAll() {
  notFound();
}
