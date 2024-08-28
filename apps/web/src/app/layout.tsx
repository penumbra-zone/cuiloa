import "./globals.css";
import type { Metadata } from "next";
import { ioveskaTerm, poppins } from "./fonts";
import { cn } from "@/lib/utils";
import "@/lib/patch-toJSON-BigInt";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TwitterIcon, BookIcon, GitPullRequestIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cuiloa",
  description: "A block explorer for Penumbra.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        poppins.variable,
        ioveskaTerm.variable,
      )}
      // Necessary for next-themes: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <body className="bg-gradient-repeat-radial min-w-full min-h-screen">
        <Providers>
          <Navbar />
          <div className="container xs-container justify-start min-h-[640px]">
            {children}
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <div className="flex justify-center items-center h-28 gap-3">
          <Link href="https://discord.gg/penumbrazone" title="The Official Penumbra Discord">
            <MessageSquareIcon className="w-4" />
          </Link>
          <Link href="https://guide.penumbra.zone/" title="Penumbra User Guide">
            <BookIcon className="w-4" />
          </Link>
          <Link href="https://github.com/penumbra-zone/cuiloa" title="Cuiloa Source Code">
            <GitPullRequestIcon className="w-4" />
          </Link>
          <Link href="https://twitter.com/penumbrazone" title="Penumbra's Twitter">
            <TwitterIcon className="w-4" />
          </Link>
        </div>
      </body>
    </html>
  );
}
