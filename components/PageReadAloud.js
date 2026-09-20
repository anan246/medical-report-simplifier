"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ReadAloud from "@/components/ReadAloud";
import { useTheme } from "@/components/ThemeProvider";

// Gives every signed-in screen one consistent way to hear its visible content.
// Individual report controls remain available for reading a single result only.
export default function PageReadAloud() {
  const pathname = usePathname();
  const { language } = useTheme();
  const [pageText, setPageText] = useState("");

  useEffect(() => {
    let observer;
    let updateTimer;
    const updatePageText = () => {
      const main = document.querySelector("main");
      setPageText((current) => {
        const next = main?.innerText?.replace(/\s+/g, " ").trim() || "";
        return current === next ? current : next;
      });
      if (!observer && main) {
        observer = new MutationObserver(() => {
          window.clearTimeout(updateTimer);
          updateTimer = window.setTimeout(updatePageText, 150);
        });
        observer.observe(main, { childList: true, characterData: true, subtree: true });
      }
    };

    // Wait for route content and client-loaded report data to be painted first.
    const frame = window.requestAnimationFrame(updatePageText);
    const timer = window.setTimeout(updatePageText, 750);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.clearTimeout(updateTimer);
      observer?.disconnect();
    };
  }, [pathname, language]);

  // Translation is authenticated, so do not show a control that could fail on public auth pages.
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 sm:left-8">
      <ReadAloud
        text={pageText}
        language={language}
        className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-lg ring-1 ring-slate-200 dark:ring-slate-700 backdrop-blur"
      />
    </div>
  );
}
