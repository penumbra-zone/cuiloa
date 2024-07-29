import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FC } from "react";

interface CardProps {
  buttonText: string,
  buttonLink: string,
  children?: React.ReactNode,
  className?: string,
  heading: string,
}

const LandingCard: FC<CardProps> = ({ heading, children, className, buttonText, buttonLink }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 items-center w-full">
        {children}
        <Button className="w-full" asChild>
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default async function Home() {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between py-5">
      <LandingCard
        heading="Transactions"
        buttonLink="/transactions"
        buttonText="Explore Transactions"
        className="basis-[45%] w-auto"
      />
      <LandingCard
        heading="Blocks"
        buttonLink="/blocks"
        buttonText="Explore Blocks"
        className="basis-[45%] w-auto"
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
        buttonText="Explore Staking"
        className="w-[380px]"
      />
      <LandingCard
        heading="Dex"
        buttonLink="/dex"
        buttonText="Explore Dex"
        className="w-[380px]"
      />
      <LandingCard
        heading="Governance"
        buttonLink="/governance"
        buttonText="Explore Governance"
        className="w-[380px]"
      />
    </div>
  );
}
