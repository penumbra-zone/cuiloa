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
        "bg-white text-slate-900 dark:bg-slate-900 dark:text-white antialiased",
        ioveskaSans.variable,
        ioveskaTerm.variable,
      )}
    >
      <body className="min-w-full min-h-screen">
        <Providers>
          <Navbar />
          <div className="flex flex-col container xs-container justify-start min-h-[640px]">
            <div className="bg-slate-100 p-1 sm:p-2 rounded-lg border-solid border-[1px] border-slate-200 shadow-sm mb-auto">
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
