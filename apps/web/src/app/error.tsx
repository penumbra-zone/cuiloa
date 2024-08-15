// NOTE: Must be client component. Them's the rules.
// https://nextjs.org/docs/app/building-your-application/routing/error-handling#using-error-boundaries
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
     console.error(error);
  }, [error]);

  return (
    <div className="bg-primary/60 py-8 rounded-lg border">
      <div className="flex flex-col gap-8 items-center">
        <h1 className="text-lg font-medium sm:w-11/12 w-full">An error has occurred.</h1>
        <p className="text-sm sm:w-11/12 w-full">Apologies, but something happened with Cuiloa and the client couldn&apos;t recover.</p>
        <div className="flex sm:w-11/12 w-full gap-8">
          <Button className="w-fit" asChild>
            <Link href={"/"}>Home</Link>
          </Button>
          <Button className="w-fit" onClick={() => reset()}>
            Try Reloading
          </Button>
        </div>
      </div>
    </div>
  );
}
