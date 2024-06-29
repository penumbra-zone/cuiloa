"use client";

import { type FC } from "react";
import SearchBar from "../Searchbar";
import Link from "next/link";

import { ThemeToggleButton } from "../ThemeToggleButton";


const Navbar : FC = () => {
  return (
  <div className="flex items-center justify-between py-5 max-w-[1200px] ml-auto mr-auto">
    <h1 className="font-bold text-lg py-5"><Link href="/">Penumbra Explorer</Link></h1>
    <div className="w-5/6 sm:max-w-lg">
      <SearchBar/>
    </div>
    <ThemeToggleButton />
  </div>
  );
};

export default Navbar;
