import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import SupportChatbot from "@/components/SupportChatbot";
import PageReadAloud from "@/components/PageReadAloud";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediLens — Medical Report Simplifier",
  description:
    "Upload your medical report and get a clear, simplified breakdown of your test results powered by AI.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('medilens-theme-preference')||localStorage.getItem('medilens-theme')||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s==='system'&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7fbf8] dark:bg-slate-950">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <PageReadAloud />
          <SupportChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
