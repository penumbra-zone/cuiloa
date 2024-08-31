import "./globals.css";
import type { Metadata } from "next";
import { ioveskaTerm, poppins } from "./fonts";
import { cn } from "@/lib/utils";
import "@/lib/patch-toJSON-BigInt";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Footer } from "@/components/Footer";

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
        poppins.variable,
        ioveskaTerm.variable,
      )}
      // Necessary for next-themes: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <body className="bg-gradient-repeat-radial min-w-full min-h-screen flex flex-col w-full">
        <Providers>
          <Navbar />
          <div className="container xs-container justify-start min-h-[640px] grow">
            {children}
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
