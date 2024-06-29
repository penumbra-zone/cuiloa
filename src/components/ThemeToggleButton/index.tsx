"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
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
    <Button variant="outline" size="icon" onClick={() => setTheme(isLight ? "dark" : "light")}>
      {isLight ? <SunIcon className="h-4 w-4"/> : <MoonIcon className="h-4 w-4"/>}
    </Button>
  );
};
