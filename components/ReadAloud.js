"use client";

import { useEffect, useRef, useState } from "react";
import { getSpeechLocale, getTranslations } from "@/lib/i18n";

export default function ReadAloud({ text, language = "en", rate = 1, className = "" }) {
  const [state, setState] = useState("idle");
  const [spokenText, setSpokenText] = useState("");
  const utteranceRef = useRef(null);
  const t = getTranslations(language);
  const enabled = typeof window === "undefined" || window.localStorage.getItem("medilens-voice-enabled") !== "false";

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  async function getTextForSpeech() {
    if (language === "en") return text;
    const response = await fetch("/api/voice/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Translation failed");
    return data.translatedText;
  }

  async function start(restart = false) {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setState("loading");
    try {
      const nextText = restart && spokenText ? spokenText : await getTextForSpeech();
      setSpokenText(nextText);
      const utterance = new SpeechSynthesisUtterance(nextText);
      utterance.lang = getSpeechLocale(language);
      utterance.rate = rate;
      utterance.onstart = () => setState("playing");
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setState("idle");
    }
  }

  function pause() {
    window.speechSynthesis?.pause();
    setState("paused");
  }

  function resume() {
    window.speechSynthesis?.resume();
    setState("playing");
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setState("idle");
  }

  if (!enabled) return null;

  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      {state === "idle" || state === "loading" ? (
        <button type="button" onClick={() => start()} disabled={state === "loading"} aria-label={t.read} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-60">
          <span aria-hidden="true">🔊</span>{state === "loading" ? "..." : t.read}
        </button>
      ) : null}
      {state === "playing" && (
        <>
          <button type="button" onClick={pause} aria-label={t.pause} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">⏸ {t.pause}</button>
          <button type="button" onClick={stop} aria-label={t.stop} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">⏹ {t.stop}</button>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">{t.reading}</span>
        </>
      )}
      {state === "paused" && (
        <>
          <button type="button" onClick={resume} aria-label={t.resume} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">▶ {t.resume}</button>
          <button type="button" onClick={() => start(true)} aria-label={t.restart} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">↻ {t.restart}</button>
          <button type="button" onClick={stop} aria-label={t.stop} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">⏹ {t.stop}</button>
        </>
      )}
    </div>
  );
}