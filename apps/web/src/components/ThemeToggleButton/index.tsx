"use client";

import { useState, useEffect, FC } from "react";
import { LeftPartialEclipse, RightPartialEclipse } from "./EclipseIcon";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggleButton : FC<ThemeToggleProps> = ({ className }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <Button className={cn("rounded-full", className)} variant="outline" size="icon" onClick={() => setTheme(isLight ? "dark" : "light")}>
      {isLight ? <LeftPartialEclipse height={16} width={16}/> : <RightPartialEclipse height={16} width={16} />}
    </Button>
  );
};
