import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-primary/60 px-3 py-4 sm:p-8 rounded-lg border">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-lg font-medium w-full">Page not found!</h1>
        <p className="text-sm w-full">Apologies, but Cuiloa could not find the page you requested.</p>
        <Button variant={"outline"} className="self-start" asChild>
          <Link href={"/"}>Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
