import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/lib/patch-toJSON-BigInt";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cuiloa",
  description: "A block explorer for Penumbra.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("bg-white text-slate-900 dark:bg-slate-900 dark:text-white antialiased", inter.className)}>
      <body className="min-h-screen bg-slate-100">
        <Providers>
          <Navbar />
          <div className="container max-w-7xl h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
