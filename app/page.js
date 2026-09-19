"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DNAHelix, ECGLine, Molecule, Pill, MedicalCross, Stethoscope } from "@/components/MedicalAnimations";
import { useAppContext } from "@/components/ThemeProvider";
import { getT } from "@/lib/i18n";

const ICONS = [
  <svg key="0" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  <svg key="1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  <svg key="2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  <svg key="3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const targets = container.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const { language } = useAppContext();
  const t = getT(language);
  const featuresRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const STEPS_NUMS = ["01", "02", "03"];

  return (
    <main className="min-h-screen bg-gradient-animated">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

        {/* Animated blob */}
        <div className="blob-glow absolute top-0 left-1/2 w-[700px] h-[320px] bg-emerald-400/15 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ── Left side medical animations ── */}
        <div className="hidden xl:flex flex-col items-center gap-8 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <DNAHelix />
          <Pill />
          <MedicalCross size="w-8 h-8" className="opacity-70" />
        </div>

        {/* ── Right side medical animations ── */}
        <div className="hidden xl:flex flex-col items-center gap-8 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <Stethoscope className="w-16 h-16 opacity-80" />
          <Molecule color="teal" />
          <Pill rotate="15deg" animClass="animate-pill2" />
        </div>

        {/* Floating decorative rings */}
        <div className="animate-float delay-0 absolute top-16 left-[8%] w-12 h-12 rounded-full border-2 border-emerald-200/40 dark:border-emerald-700/30 hidden lg:block xl:hidden" />
        <div className="animate-float delay-300 absolute top-32 right-[10%] w-8 h-8 rounded-full border-2 border-emerald-300/30 dark:border-emerald-600/20 hidden lg:block xl:hidden" />
        <div className="animate-float delay-500 absolute bottom-12 left-[15%] w-6 h-6 rounded-full bg-emerald-200/30 dark:bg-emerald-700/20 hidden lg:block xl:hidden" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          {/* Badge */}
          <div className="animate-fade-down delay-0 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
              {t.home.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.home.headline1}
            <span className="block text-shimmer mt-1">{t.home.headline2}</span>
          </h1>

          <p className="animate-fade-up delay-200 mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.home.sub}
          </p>

          {/* CTA */}
          <div className="animate-fade-up delay-300 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upload"
              className="btn-press hover-lift inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl text-sm shadow-sm hover:shadow-emerald-200 dark:hover:shadow-emerald-900"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {t.home.cta}
            </Link>
          </div>

          <p className="animate-fade-up delay-400 mt-4 text-xs text-slate-400 dark:text-slate-500">
            {t.home.free}
          </p>

          {/* ECG line */}
          <div className="animate-fade-up delay-500 mt-6 w-full max-w-sm mx-auto opacity-60">
            <ECGLine className="h-12" />
          </div>

          {/* Floating stat pills */}
          <div className="animate-fade-up delay-600 mt-6 flex flex-wrap justify-center gap-3">
            {[
              { val: "100+", label: t.home.stats.tests },
              { val: "AI",   label: t.home.stats.powered },
              { val: "< 15s",label: t.home.stats.time },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-sm">
                <span className="text-sm font-bold text-emerald-600">{s.val}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-16 relative">
        {/* Side molecule decorations */}
        <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
          <Molecule color="emerald" className="w-20 h-20" />
        </div>
        <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
          <Molecule color="blue" className="w-16 h-16" />
        </div>
        <div className="reveal text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.home.featuresTitle}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.home.featuresSub}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.home.features.map((f, i) => (
            <div key={f.title} className={`reveal delay-${i + 1} card-hover bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                {ICONS[i]}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background ECG watermark */}
        <div className="absolute inset-x-0 bottom-0 opacity-[0.04] pointer-events-none">
          <ECGLine className="h-24 w-full" />
        </div>
        {/* Side pills */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <Pill className="mb-4" />
          <Pill rotate="10deg" animClass="animate-pill2" />
        </div>
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <MedicalCross size="w-10 h-10" />
        </div>
        <div ref={stepsRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="reveal text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.home.howTitle}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.home.howSub}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {t.home.steps.map((s, i) => (
              <div key={s.title} className={`reveal delay-${i + 1} relative text-center group`}>
                {i < t.home.steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 group-hover:bg-emerald-700" style={{ transition: "transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease" }}>
                  {STEPS_NUMS[i]}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal delay-4 mt-10 text-center">
            <Link
              href="/upload"
              className="btn-press hover-lift inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-sm"
            >
              {t.home.getStarted}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {t.home.footer}
        </p>
      </footer>
    </main>
  );
}
