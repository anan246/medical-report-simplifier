"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

const AppContext = createContext({
  theme: "light",
  setThemePreference: () => {},
  toggleTheme: () => {},
  language: "en",
  setLanguage: () => {},
  languages: LANGUAGES,
});

export function useTheme() {
  return useContext(AppContext);
}

export function useLanguage() {
  const { language, setLanguage } = useContext(AppContext);
  return { language, setLanguage, languages: LANGUAGES };
}

export function useAppContext() {
  return useContext(AppContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguageState] = useState("en");
  const initialised = useRef(false);

  useLayoutEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const storedTheme = localStorage.getItem("medilens-theme-preference") || localStorage.getItem("medilens-theme") || "system";
    const storedLanguage = localStorage.getItem("medilens-language") || "en";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = storedTheme === "system" ? (prefersDark ? "dark" : "light") : storedTheme;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    setTheme(resolvedTheme);
    setLanguageState(storedLanguage);
  }, []);

  const setThemePreference = useCallback((preference) => {
    const resolvedTheme = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    setTheme(resolvedTheme);
    localStorage.setItem("medilens-theme-preference", preference);
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "light" ? "dark" : "light");
  }, [setThemePreference, theme]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("medilens-language", nextLanguage);
  }, []);

  return (
    <AppContext.Provider value={{ theme, setThemePreference, toggleTheme, language, setLanguage, languages: LANGUAGES }}>
      {children}
    </AppContext.Provider>
  );
}
