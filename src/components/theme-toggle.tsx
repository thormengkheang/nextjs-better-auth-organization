"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-0 py-0 h-6"
    >
      <Sun className="h-4 w-4 dark:hidden" color="#000" />
      <Moon className="hidden h-4 w-4 dark:block" />
      {theme === "light" ? "Dark mode" : "Light Mode"}
    </Button>
  );
}
