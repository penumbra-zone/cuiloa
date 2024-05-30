import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default async function Home() {
  // Idea: break out the buttons to their own cards where each uses the description to help describe the data to users.
  return (
    <div className="flex gap-5 items-center justify-center py-5">
      <div>
        <Card>
          <CardHeader className="">
            <CardTitle className="text-center text-lg sm:text-2xl">
              Penumbra is constantly evolving...
            </CardTitle>
            <CardDescription className="text-center">
              Navigate and explore public chain data with the links below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 items-center">
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/transactions">Recent Transactions</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/blocks">Recent Blocks</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/ibc/clients">IBC Clients</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/ibc/channels">IBC Channels</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/ibc/connections">IBC Connections</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/staking">Staking</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/dex">Dex</Link>
            </Button>
            <Button className="sm:w-2/3 w-full" asChild>
              <Link href="/governance">Governance</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
