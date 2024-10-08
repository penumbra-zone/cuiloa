export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FC } from "react";
import { cn, getQueryClient } from "@/lib/utils";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PreviewTable } from "@/components/PreviewTable";
import { getBlocks } from "@/components/BlocksTable/getBlocks";
import { getTransactions } from "@/components/TransactionsTable/getTransactions";
import { TwitterEmbed } from "@/components/Embedded";


interface CardProps {
  buttonText: string,
  buttonLink: string,
  children?: React.ReactNode,
  className?: string,
  heading: string,
  disabled?: boolean,
}

const LandingCard: FC<CardProps> = ({ heading, children, className, buttonText, buttonLink, disabled = false }) => {
  return (
    <Card className={cn("bg-card/60", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 items-center">
        {children}
        <Button className="w-full" variant={ disabled ? "ghost" : "outline"} disabled={disabled} asChild={!disabled}>
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Home() {
  const queryClient = getQueryClient();

  const blocksQuery = "BlocksTable";
  const transactionsQuery = "TransactionsTable";
  const blocksEndpoint = "api/blocks";
  const transactionEndpoint = "api/transactions";
  const errorMessage = "Problems were encountered while trying to query explorer data for the main page, please try again.";

  Promise.all([
    queryClient.prefetchQuery({
      queryFn: () => getTransactions({ endpoint: transactionEndpoint, pageIndex: 0, cached: false }),
      queryKey: [transactionsQuery, 0],
      staleTime: 0,
      meta: {
        errorMessage,
      },
    }),
    queryClient.prefetchQuery({
      queryFn: () => getBlocks({ endpoint: blocksEndpoint, pageIndex: 0, cached: false }),
      queryKey: [blocksQuery, 0],
      staleTime: 0,
      meta: {
        errorMessage,
      },
    }),
  ]);

  // console.log(queryClient)

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <LandingCard
        heading="Transactions"
        buttonLink="/transactions"
        buttonText="Explore Transactions"
        className="sm:basis-[45%] w-full max-w-screen-sm"
        children={
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PreviewTable
              className="w-full"
              queryName={transactionsQuery}
              pageIndex={0}
              endpoint={transactionEndpoint}
              errorMessage={errorMessage}
            />
          </HydrationBoundary>
        }
      />
      <LandingCard
        heading="Blocks"
        buttonLink="/blocks"
        buttonText="Explore Blocks"
        className="sm:basis-[50%] w-full max-w-screen-sm"
        children={
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PreviewTable
              className="w-full"
              queryName={blocksQuery}
              pageIndex={0}
              endpoint={blocksEndpoint}
              errorMessage={errorMessage}
            />
          </HydrationBoundary>
        }
      />
      <LandingCard
        heading="IBC Clients"
        buttonLink="/ibc/clients"
        buttonText="Explore Clients"
        className="w-[380px]"
      />
      <LandingCard
        heading="IBC Connections"
        buttonLink="/ibc/connections"
        buttonText="Explore Connections"
        className="w-[380px]"
      />
      <LandingCard
        heading="IBC Channels"
        buttonLink="/ibc/channels"
        buttonText="Explore Channels"
        className="w-[380px]"
      />
      <LandingCard
        heading="Staking"
        buttonLink="/staking"
        buttonText="Coming Soon..."
        className="w-[380px]"
        disabled={true}
      />
      <LandingCard
        heading="Dex"
        buttonLink="/dex"
        buttonText="Coming Soon..."
        className="w-[380px]"
        disabled={true}
      />
      <LandingCard
        heading="Governance"
        buttonLink="/governance"
        buttonText="Coming Soon..."
        className="w-[380px]"
        disabled={true}
      />
      <div className="flex w-full items-center justify-center">
        <TwitterEmbed className="w-full sm:w-1/2"/>
      </div>
    </div>
  );
}
