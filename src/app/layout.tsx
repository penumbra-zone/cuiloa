import "./globals.css";
import type { Metadata } from "next";
import { ioveskaSans, ioveskaTerm } from "./fonts";
import { cn } from "@/lib/utils";
import "@/lib/patch-toJSON-BigInt";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { CodeIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cuiloa",
  description: "A block explorer for Penumbra.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        ioveskaSans.variable,
        ioveskaTerm.variable,
      )}
      // Necessary for next-themes: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <body className="bg-gradient-repeat-radial min-w-full min-h-screen">
        <Providers>
          <Navbar />
          <div className="flex flex-col container xs-container justify-start min-h-[640px]">
            <div className="p-1 sm:p-2 mb-auto">
              {children}
            </div>
            <div className="self-center py-5">
              <Link href="https://github.com/penumbra-zone/cuiloa">
                <CodeIcon className="w-4" />
              </Link>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
