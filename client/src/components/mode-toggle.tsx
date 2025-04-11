"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-muted p-1 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "cursor-pointer   flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-background/50",
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground"
        )}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Light</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "cursor-pointer flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-background/50",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground"
        )}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Dark</span>
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "cursor-pointer flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-background/50",
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground"
        )}
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">System</span>
      </button>
    </div>
  );
}
