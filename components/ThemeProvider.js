"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const LANGUAGES = [
  { code: "en",    label: "English",    native: "English" },
  { code: "hi",    label: "Hindi",      native: "हिन्दी" },
  { code: "ta",    label: "Tamil",      native: "தமிழ்" },
  { code: "te",    label: "Telugu",     native: "తెలుగు" },
  { code: "kn",    label: "Kannada",    native: "ಕನ್ನಡ" },
  { code: "ml",    label: "Malayalam",  native: "മലയാളം" },
  { code: "bn",    label: "Bengali",    native: "বাংলা" },
  { code: "mr",    label: "Marathi",    native: "मराठी" },
  { code: "gu",    label: "Gujarati",   native: "ગુજરાતી" },
  { code: "pa",    label: "Punjabi",    native: "ਪੰਜਾਬੀ" },
  { code: "es",    label: "Spanish",    native: "Español" },
  { code: "fr",    label: "French",     native: "Français" },
  { code: "de",    label: "German",     native: "Deutsch" },
  { code: "zh",    label: "Chinese",    native: "中文" },
  { code: "ar",    label: "Arabic",     native: "العربية" },
  { code: "ja",    label: "Japanese",   native: "日本語" },
  { code: "pt",    label: "Portuguese", native: "Português" },
];

const AppContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  language: "en",
  setLanguage: () => {},
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
  const [language, setLanguageSt] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("medilens-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");

    const storedLang = localStorage.getItem("medilens-language") || "en";
    setLanguageSt(storedLang);

    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("medilens-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function setLanguage(code) {
    setLanguageSt(code);
    localStorage.setItem("medilens-language", code);
  }

  if (!mounted) return <>{children}</>;

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}
