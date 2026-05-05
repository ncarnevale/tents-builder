"use client";

import { useEffect } from "react";

const STORAGE_KEY = "tb-theme";

/**
 * When no explicit theme is stored, keep `<html class="dark">` in sync if the
 * user changes the OS color scheme while the page is open.
 */
export function ThemeRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      document.documentElement.classList.toggle("dark", mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return children;
}
