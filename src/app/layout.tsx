import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "./globals.css";

export const metadata: Metadata = {
  title: "Bird",
  description: "Totally *not* a Twitter clone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#18181b",
          colorPrimary: "#2563eb",
        },
        elements: {
          card: "shadow-none",
        },
      }}
    >
      <html lang="en">
        <body className="bg-gray-950 text-white">{children}</body>
      </html>
    </ClerkProvider>
  );
}
