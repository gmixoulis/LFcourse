"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme only on client after mount to avoid SSR/client mismatches
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme");
      if (stored) {
        setIsDark(stored === "dark");
        return;
      }
    } catch {
      // ignore
    }

    try {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(Boolean(prefersDark));
    } catch {
      setIsDark(false);
    }
  }, []);

  // Apply theme class and persist preference when it changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      root.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  }, [isDark, mounted]);

  return (
    <div className="dark-toggle-wrapper">
      <button
        aria-label="Toggle dark mode"
        onClick={() => setIsDark((v) => !v)}
        className="relative z-10 inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm shadow-sm bg-background dark:bg-slate-800 border-border"
      >
        {/* Render icon only after mount to avoid SSR/client mismatch */}
        {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : null}
      </button>
    </div>
  );
}
