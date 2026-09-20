"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <nav className="w-full sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/report-dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-600/20 transition-all group-hover:scale-105">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              Medi<span className="text-emerald-600">Lens</span>
            </h1>

            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              See Deeper. Understand Better.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
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
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold shadow-inner">
              P
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Profile
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                My account
              </p>
            </div>

            <span className="text-slate-400 text-xs transition-transform">▾</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-xl p-2 z-50 animate-scale-in">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 transition cursor-pointer"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* Navigation Link */
function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs"
          : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
      }`}
    >
      {children}
    </Link>
  );
}