"use client";

import { useState, useEffect } from "react";
import { LeftPartialEclipse, RightPartialEclipse } from "./EclipseIcon";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <Button className="rounded-full" variant="outline" size="icon" onClick={() => setTheme(isLight ? "dark" : "light")}>
      {isLight ? <LeftPartialEclipse height={16} width={16}/>: <RightPartialEclipse height={16} width={16} />}
    </Button>
  );
};
