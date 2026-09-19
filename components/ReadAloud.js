"use client";

import { useEffect, useRef, useState } from "react";
import { getSpeechLocale, getTranslations } from "@/lib/i18n";

export default function ReadAloud({ text, language = "en", rate = 1, className = "" }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
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
    if (!text || typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError("Speech playback is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    setState("loading");
    setError("");
    try {
      const nextText = restart && spokenText ? spokenText : await getTextForSpeech();
      setSpokenText(nextText);
      const locale = getSpeechLocale(language);
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        voices = await new Promise((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.speechSynthesis.removeEventListener("voiceschanged", finish);
            resolve(window.speechSynthesis.getVoices());
          };
          window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
          window.setTimeout(finish, 1500);
        });
      }
      if (voices.length === 0) {
        setState("idle");
        setError("No browser voices are available. Install or enable a text-to-speech voice in your device settings.");
        return;
      }
      const voice = voices.find((item) => item.lang?.toLowerCase() === locale.toLowerCase())
        || voices.find((item) => item.lang?.toLowerCase().startsWith(language.toLowerCase()));
      const chunks = nextText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [nextText];
      let index = 0;
      const speakNext = () => {
        if (index >= chunks.length) {
          setState("idle");
          return;
        }
        const utterance = new SpeechSynthesisUtterance(chunks[index++].trim());
        utterance.lang = locale;
        utterance.rate = rate;
        if (voice) utterance.voice = voice;
        utterance.onstart = () => setState("playing");
        utterance.onend = speakNext;
        utterance.onerror = (event) => {
          setState("idle");
          setError(event.error === "not-allowed" ? "Browser audio permission was blocked." : "This browser could not play the selected language voice.");
        };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };
      speakNext();
    } catch (playbackError) {
      setState("idle");
      setError(playbackError.message || "Unable to prepare audio.");
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
      {error && <span role="status" className="text-xs text-rose-600 dark:text-rose-400">{error}</span>}
    </div>
  );
}