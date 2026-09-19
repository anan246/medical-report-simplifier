"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = (event) => {
      document.documentElement.classList.toggle(
        "dark",
        event.matches
      );
    };

    // Apply theme on initial load
    document.documentElement.classList.toggle(
      "dark",
      mediaQuery.matches
    );

    // Listen for system theme changes
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, []);

  return <>{children}</>;
}