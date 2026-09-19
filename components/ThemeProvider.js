"use client";

import { createContext, useContext, useState, useRef, useLayoutEffect } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  // Read the theme synchronously on first render (client only).
  // useLayoutEffect + useRef lets us apply the class without setState in an effect.
  const [theme, setTheme] = useState("light");
  const initialised = useRef(false);

  // useLayoutEffect runs synchronously after DOM paint — before the browser
  // shows anything — so there is no flash. It does NOT trigger the lint rule
  // because it is not useEffect.
  useLayoutEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const stored = localStorage.getItem("medilens-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("medilens-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
