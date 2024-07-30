"use client";

import { type FC } from "react";
import SearchBar from "../Searchbar";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggleButton } from "../ThemeToggleButton";
import radiantLogoRainbow from "./radiant-logo-rainbow.png";
import radiantLogoBw from "./radiant-logo-bw.png";
import { workSans } from "@/app/fonts";

const RadiantLogoRainbow = ({ width, height, className } : { width: number, height: number, className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoRainbow} alt="RadiantCommons.com Logo" width={width} height={height}/>
    </div>
  );
};

const RadiantLogoBw = ({ width, height, className } : { width: number, height: number, className?: string }) => {
  return (
    <div className={className}>
      <Image src={radiantLogoBw} alt="RadiantCommons.com Logo" width={width} height={height}/>
    </div>
  );
};

export const Navbar : FC = () => {
  return (
  <div className="flex justify-between items-center p-8 max-w-[1400px] mx-auto">
    <div className="flex-grow flex flex-wrap items-center">
      <Link href="https://radiantcommons.com" className="self-center" >
        <RadiantLogoRainbow height={48} width={48} className="dark:block hidden"/>
        <RadiantLogoBw height={48} width={48} className="dark:hidden "/>
      </Link>
      <h1 className={`font-semibold text-2xl ml-1 mr-3 ${workSans.className}`}><Link href="/">Cuiloa</Link></h1>
      <Link className={`text-link font-medium font-display ${workSans.className}`} href="https://penumbra.zone/">
        A Block Explorer For Penumbra
      </Link>
    </div>
    <div className="flex items-center gap-2">
      <SearchBar className="w-5/6 sm:max-w-40"/>
      <ThemeToggleButton />
    </div>
  </div>
  );
};
