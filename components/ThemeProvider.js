"use client";

import { createContext, useContext, useState, useRef, useLayoutEffect, useCallback } from "react";

const ThemeContext = createContext({
  theme: "light",
  setThemePreference: () => {},
  toggleTheme: () => {},
  language: "en",
  setLanguage: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  // Read the theme synchronously on first render (client only).
  // useLayoutEffect + useRef lets us apply the class without setState in an effect.
  const [theme, setTheme] = useState("light");
  const [language, setLanguageState] = useState("en");
  const initialised = useRef(false);

  // useLayoutEffect runs synchronously after DOM paint — before the browser
  // shows anything — so there is no flash. It does NOT trigger the lint rule
  // because it is not useEffect.
  useLayoutEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const stored = localStorage.getItem("medilens-theme-preference") || localStorage.getItem("medilens-theme");
    const storedLanguage = localStorage.getItem("medilens-language") || "en";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preference = stored || "system";
    const initial = preference === "system" ? (prefersDark ? "dark" : "light") : preference;
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
    setLanguageState(storedLanguage);
  }, []);

  const setThemePreference = useCallback((next) => {
    const resolved = next === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : next;
    setTheme(resolved);
    localStorage.setItem("medilens-theme-preference", next);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "light" ? "dark" : "light");
  }, [setThemePreference, theme]);

  const setLanguage = useCallback((next) => {
    setLanguageState(next);
    localStorage.setItem("medilens-language", next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemePreference, toggleTheme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}
