import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Bird",
    default: "Bird",
  },
  description: "very cool social app",
  metadataBase: new URL("https://bird.lukadev.me"),
  openGraph: {
    title: "Bird",
    description: "very cool social app",
    url: "https://bird.lukadev.me",
    siteName: "Bird",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
