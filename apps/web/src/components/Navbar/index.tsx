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

const RadiantLogoDark = ({ className } : { className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoDark} alt="RadiantCommons.com Logo" priority/>
    </div>
  );
};

const RadiantLogoLight = ({ className } : { className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoLight} alt="RadiantCommons.com Logo" priority/>
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

const Breadcrumbs : FC<{ pathName: string }>= ({ pathName }) => {
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
  const isSearch = segments.length === 2 && segments[0] === "search";

  console.log("building breadcrumb...", isSearch);
  // Handle case of /{transactions|blocks}, /ibc/{clients|channels|connections}, /search
  if (isTable || isSearch) {
    // /{transactions|blocks|clients|channels|connections}
    const parent = isIbc ? segments[1] : segments[0];
    const _href = isIbc ? `/ibc/${parent}` : `/${parent}`;
    const linkText = isIbc ? `IBC ${capitalize(parent)}` : isSearch ? `${capitalize(parent)}` : `Recent ${capitalize(parent)}`;

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
    const linkText = `${capitalize(parent)} Summary`;

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

export const Navbar: FC = () => {
  const pathName = usePathname();
  return (
    <div className="flex flex-wrap justify-between items-center px-4 py-8 sm:px-8 sm:py-16 sm:gap-2 gap-0 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap grow items-center sm:w-auto w-2/3">
        <Link href="https://radiantcommons.com">
          <RadiantLogoDark className="sm:w-12 sm:h-12 w-9 h-9 dark:block hidden" />
          <RadiantLogoLight className="sm:w-12 sm:h-12 w-9 h-9 dark:hidden" />
        </Link>
        <h1
          className={`font-semibold text-2xl ml-1 mr-3 ${workSans.className}`}
        >
          <Link href="/" className="hover:underline">
            Cuiloa
          </Link>
        </h1>
        {/* NOTE: the 5px of padding-top is to better align the smaller text with the text above, please keep it. */}
        <p
          className={`sm:w-fit w-2/3 sm:basis-auto basis-full font-medium pt-[5px] ${workSans.className}`}
        >
          <Link
            href="https://penumbra.zone/"
            className="hover:underline text-link"
          >
            Block Explorer For Penumbra
          </Link>
        </p>
      </div>
      <div className="flex items-center gap-2 sm:w-auto mb-auto">
        <SearchBar className="w-9 h-9 sm:w-40 md:w-56 lg:w-80 sm:h-11" />
        <ThemeToggleButton className="w-9 sm:w-11 h-9 sm:h-11" />
      </div>
      {pathName !== "/" ? (
        <div className="w-full h-5 pt-2 sm:pt-0">
          <Breadcrumbs pathName={pathName} />
        </div>
      ) : null}
    </div>
  );
};
