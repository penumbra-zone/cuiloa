"use client";

import { type FC } from "react";
import SearchBar from "@/components/Searchbar";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggleButton } from "../ThemeToggleButton";
import radiantLogoLight from "./radiant-logo-light.png";
import radiantLogoDark from "./radiant-logo-dark.png";
import { workSans } from "@/app/fonts";
import {
  Breadcrumb,
  // BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  // BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// TODO: Add collapsing menu for mobile
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const RadiantLogoDark = ({ width, height, className } : { width: number, height: number, className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoDark} alt="RadiantCommons.com Logo" width={width} height={height} priority/>
    </div>
  );
};

const RadiantLogoLight = ({ width, height, className } : { width: number, height: number, className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoLight} alt="RadiantCommons.com Logo" width={width} height={height} priority/>
    </div>
  );
};

// const LEGAL_BREADCRUMB_SEGMENTS = ["transactions", "transaction", "blocks", "block", "ibc", "client", "clients", "channels", "channel", "connections", "connection", "gov", "dex", "staking"] as const;
// type BreadcrumbSegment = typeof LEGAL_BREADCRUMB_SEGMENTS[number];
// const isBreadcrumbPath = (path: string) : path is BreadcrumbSegment => {
//   const _legal: readonly string[] = LEGAL_BREADCRUMB_SEGMENTS;
//   return _legal.includes(path);
// };
// TBQF I don't think this sort of error checking is necessary. If anything, it'll cause errors whenever new paths are updated.
// if (!segments.every(isBreadcrumbPath)) return null;

const Breadcrumbs = () => {
  const pathName = usePathname();

  // Don't show breadcrumbs if on index.
  if (pathName === "/") return null;

  // remove any trailing empty strings from a path like "/<path>/"
  const segments = pathName.split("/").filter((w) => w !== "");

  const capitalize = (s: string) : string => (s.at(0) ?? "").toUpperCase() + s.slice(1);

  const isIbcPath = (a: string[]) : boolean => {
    const ibcPaths = ["client", "clients", "channel", "channels", "connection", "connections"];
    return a[0] === "ibc" && ibcPaths.includes(a[1]);
  };
  const isTablePath = (a: string[]) : boolean => {
    return (a.length === 1 && a[0] === "blocks" || a[0] === "transactions") || a.length === 2 && isIbcPath(a);
  };
  // /ibc/clients === 2 vs /ibc/client/<id> === 3
  const isIbc = segments.length >= 2 ? isIbcPath(segments) : false;
  const isBlockOrTx = segments.length === 2 && segments[0] === "block" || segments[0] === "transaction";
  const isTable = isTablePath(segments);

  // Handle case of /{transactions|blocks} and /ibc/{clients|channels|connections}
  if (isTable) {
    // /{transactions|blocks|clients|channels|connections}
    const parent = isIbc ? segments[1] : segments[0];
    const _href = isIbc ? `/ibc/${parent}` : `/${parent}`;
    const linkText = isIbc ? `IBC ${capitalize(parent)}` : `Recent ${capitalize(parent)}`;

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={_href} className="text-primary-foreground">{linkText}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isBlockOrTx || isIbc) {
    // /{transaction|block|client|channel|connection}
    const parent = isIbc ? segments[1] : segments[0];
    // /{parent}/{hash|height|ibc-identifier}
    const slug = isIbc ? segments[2] : segments[1];
    // table routes are always just the pluralized form of the singular so transaction => transactions, client => clients, etc
    const parentTable = parent + "s";
    // only difference is to prefix URI with /ibc if it's ibc related
    const tableRef = isIbc ? `/ibc/${parentTable}` : `/${parentTable}`;
    const _href = isIbc ? `/ibc/${parent}/${slug}` : `/${parent}/${slug}`;
    // Same prefixing but for the "current" breadcrumb
    const linkText = isIbc ? `IBC ${capitalize(parent)} Summary` : `${capitalize(parent)} Summary`;

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={tableRef}>{capitalize(parentTable)}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={_href} className="text-primary-foreground">{linkText}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
};

export const Navbar : FC = () => {
  return (
  <div className="flex flex-wrap justify-between items-center p-8 gap-2 max-w-[1400px] mx-auto">
    <div className="flex-grow flex flex-wrap">
      <Link href="https://radiantcommons.com" className="" >
        <RadiantLogoDark height={48} width={48} className="dark:block hidden"/>
        <RadiantLogoLight height={48} width={48} className="dark:hidden"/>
      </Link>
      <div className="flex items-center">
        <h1 className={`font-semibold text-2xl ml-1 mr-3 ${workSans.className}`}><Link href="/">Cuiloa</Link></h1>
        <p className={`text-link font-medium pt-[5px] ${workSans.className}`}>
          <Link href="https://penumbra.zone/" className="">
            A Block Explorer For Penumbra
          </Link>
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <SearchBar className="w-5/6 sm:max-w-40"/>
      <ThemeToggleButton />
    </div>
    <div className="w-full h-5">
      <Breadcrumbs />
    </div>
  </div>
  );
};
