import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-primary/60 py-8 rounded-lg border">
      <div className="flex flex-col gap-8 items-center">
        <h1 className="text-lg font-medium sm:w-11/12 w-full">Page not found!</h1>
        <p className="text-sm sm:w-11/12 w-full">Apologies, but Cuiloa could not find the page you requested.</p>
        <div className="flex sm:w-11/12 w-full gap-8">
          <Button className="w-fit" asChild>
            <Link href={"/"}>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
