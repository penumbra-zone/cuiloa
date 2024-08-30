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
    <div className="bg-primary/60 px-3 py-4 sm:p-8 rounded-lg border">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-lg font-medium w-full">An error has occurred.</h1>
        <p className="text-sm w-full">Apologies, but something happened with Cuiloa and the client couldn&apos;t recover.</p>
        <div className="flex w-full gap-5">
          <Button className="w-fit" variant={"outline"} asChild>
            <Link href={"/"}>Home</Link>
          </Button>
          <Button className="w-fit" variant={"outline"} onClick={() => reset()}>
            Try Reloading
          </Button>
        </div>
      </div>
    </div>
  );
}
