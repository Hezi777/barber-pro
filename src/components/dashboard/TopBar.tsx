"use client";

import Link from "next/link";
import { Home, Moon, RefreshCw, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const DASHBOARD_LOCALE = "en-US";

interface TopBarProps {
  selectedDate: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function TopBar({ selectedDate, onRefresh, isRefreshing }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto max-w-[1450px] px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">Barber Pro</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {"\u05e0\u05d9\u05d4\u05d5\u05dc \u05ea\u05d5\u05e8\u05d9\u05dd"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="max-w-[42vw] truncate whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
              {selectedDate.toLocaleDateString(DASHBOARD_LOCALE, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="h-5 w-px bg-border" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-accent-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
