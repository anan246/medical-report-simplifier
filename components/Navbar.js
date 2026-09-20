"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAppContext, LANGUAGES } from "@/components/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, language, setLanguage } = useAppContext();

  const [openProfile, setOpenProfile] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setOpenLang(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/report-dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Medi<span className="text-emerald-600">Lens</span>
            </h1>

            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              See Deeper. Understand Better.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1.5">
          <NavLink href="/upload" active={pathname === "/upload"}>
            Upload Report
          </NavLink>

          <NavLink
            href="/report-dashboard"
            active={pathname === "/report-dashboard"}
          >
            My Reports
          </NavLink>

          <NavLink
            href="/history"
            active={pathname.startsWith("/history")}
          >
            History
          </NavLink>

          <NavLink href="/settings" active={pathname === "/settings" || pathname === "/profile"}>
            Settings
          </NavLink>
        </div>

        {/* Right side controls: Theme Toggle, Language Selector, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setOpenLang(!openLang)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-emerald-600 transition cursor-pointer"
              title="Change Language"
            >
              <span className="text-sm">🌐</span>
              <span className="hidden sm:inline">{currentLangObj.native}</span>
              <span className="sm:hidden">{currentLangObj.code.toUpperCase()}</span>
              <span className="text-slate-400 text-[10px]">▾</span>
            </button>

            {openLang && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-50 animate-scale-in">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setOpenLang(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      language === l.code
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold">
                P
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">
                  Profile
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  My account
                </p>
              </div>

              <span className="text-slate-400 text-xs">▾</span>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-scale-in">
                <Link
                  href="/profile"
                  onClick={() => setOpenProfile(false)}
                  className="block px-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                >
                  Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpenProfile(false)}
                  className="block px-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                >
                  Settings
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpenMobile(!openMobile)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle mobile menu"
          >
            {openMobile ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {openMobile && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 animate-fade-down">
          <Link
            href="/upload"
            onClick={() => setOpenMobile(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === "/upload"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Upload Report
          </Link>
          <Link
            href="/report-dashboard"
            onClick={() => setOpenMobile(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === "/report-dashboard"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            My Reports
          </Link>
          <Link
            href="/history"
            onClick={() => setOpenMobile(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname.startsWith("/history")
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            History
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpenMobile(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === "/settings" || pathname === "/profile"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}

/* Navigation Link */
function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
          : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </Link>
  );
}
