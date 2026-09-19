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
    <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/report-dashboard" className="flex items-center gap-3">
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
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold">
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

            <span className="text-slate-400">▾</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-2 z-50">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
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