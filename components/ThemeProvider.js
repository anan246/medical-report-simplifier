"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

const LANGUAGE_LOCALES = { en: "en", hi: "hi-IN", kn: "kn-IN" };

const AppContext = createContext({
  theme: "light",
  themePreference: "system",
  setThemePreference: () => {},
  toggleTheme: () => {},
  language: "en",
  setLanguage: () => {},
  languages: LANGUAGES,
  mounted: false,
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
  const [themePreference, setThemePreferenceState] = useState("system");
  const [theme, setTheme] = useState("light");
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  // Apply resolved theme ("light" | "dark") to html document
  const applyTheme = useCallback((resolved) => {
    setTheme(resolved);
    if (typeof document !== "undefined") {
      if (resolved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Determine resolved theme given preference
  const resolveTheme = useCallback((pref) => {
    if (pref === "dark") return "dark";
    if (pref === "light") return "light";
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const storedPref =
        localStorage.getItem("medilens-theme-preference") ||
        localStorage.getItem("medilens-theme") ||
        "system";
      const storedLang = localStorage.getItem("medilens-language") || "en";

      setThemePreferenceState(storedPref);
      const resolved = resolveTheme(storedPref);
      applyTheme(resolved);

      if (LANGUAGE_LOCALES[storedLang]) {
        setLanguageState(storedLang);
        document.documentElement.lang = LANGUAGE_LOCALES[storedLang] || "en";
      }
    } catch (e) {
      console.warn("[ThemeProvider] initialization fallback:", e);
    }
  }, [applyTheme, resolveTheme]);

  // Dynamically respond to OS dark mode changes when preference is "system"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const currentPref = localStorage.getItem("medilens-theme-preference") || "system";
      if (currentPref === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    } else if (mq.addListener) {
      mq.addListener(handleChange);
      return () => mq.removeListener(handleChange);
    }
  }, [applyTheme]);

  // Sync document.documentElement.lang
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = LANGUAGE_LOCALES[language] || "en";
    }
  }, [language]);

  const setThemePreference = useCallback((preference) => {
    const valid = ["system", "light", "dark"].includes(preference) ? preference : "system";
    setThemePreferenceState(valid);
    try {
      localStorage.setItem("medilens-theme-preference", valid);
      localStorage.setItem("medilens-theme", valid);
    } catch {}
    const resolved = resolveTheme(valid);
    applyTheme(resolved);
  }, [applyTheme, resolveTheme]);

  const toggleTheme = useCallback(() => {
    // If currently dark (resolved or forced), toggle to light; otherwise dark
    const next = theme === "dark" ? "light" : "dark";
    setThemePreference(next);
  }, [setThemePreference, theme]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!LANGUAGE_LOCALES[nextLanguage]) return;
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem("medilens-language", nextLanguage);
      localStorage.setItem("medilens-voice-language", nextLanguage);
    } catch {}
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        themePreference,
        setThemePreference,
        toggleTheme,
        language,
        setLanguage,
        languages: LANGUAGES,
        mounted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

