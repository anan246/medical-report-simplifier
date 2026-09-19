"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getTranslations } from "@/lib/i18n";
import {
  SPEECH_LANGUAGES,
  clampSpeechRate,
  getDefaultSpeechVoice,
  getSpeechLocale,
  pickSpeechVoice,
  splitIntoSpeechChunks,
} from "@/lib/speech";

const VOICE_WAIT_MS = 3000;
const CANCEL_SETTLE_MS = 150;

// These errors are raised by our own cancel() calls, so they must never be shown.
const IGNORED_SPEECH_ERRORS = new Set(["canceled", "interrupted"]);
// Every other error code maps to a translation key instead of a raw browser string.
const SPEECH_ERROR_MESSAGES = {
  "not-allowed": "speechBlocked",
  "audio-busy": "speechBusy",
  "audio-hardware": "speechUnavailable",
  network: "speechNetwork",
  "synthesis-unavailable": "speechUnavailable",
  "language-unavailable": "speechUnavailable",
  "voice-unavailable": "speechUnavailable",
  "text-too-long": "speechUnavailable",
  "invalid-argument": "speechUnavailable",
};

function readStoredValue(key) {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

// The voice preferences live in localStorage. Reading them through useSyncExternalStore
// keeps the server render on the defaults and lets React re-read them after hydration.
const noopSubscribe = () => () => {};

function useStoredPreference(key) {
  return useSyncExternalStore(
    noopSubscribe,
    () => readStoredValue(key),
    () => "",
  );
}

function hasSpeechSupport() {
  return typeof window !== "undefined"
    && Boolean(window.speechSynthesis)
    && typeof window.SpeechSynthesisUtterance !== "undefined";
}

function waitFor(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function ReadAloud({ text, language = "en", rate = null, className = "" }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const utteranceRef = useRef(null);
  const voiceRef = useRef(null);
  const localeRef = useRef(getSpeechLocale(language));
  const chunksRef = useRef([]);
  const indexRef = useRef(0);
  const spokenTextRef = useRef("");
  const translationRef = useRef(new Map());
  const cancelledRef = useRef(false);
  const t = getTranslations(language);

  const storedVoiceLanguage = useStoredPreference("medilens-voice-language");
  const storedVoiceRate = useStoredPreference("medilens-voice-rate");
  const storedVoiceEnabled = useStoredPreference("medilens-voice-enabled");
  // Only languages this app can translate and speak are accepted from the stored setting.
  const appLanguage = SPEECH_LANGUAGES[language] ? language : "en";
  const preferredLanguage = SPEECH_LANGUAGES[storedVoiceLanguage] ? storedVoiceLanguage : "en";
  // The stored "voice language" decides what is read out; the app language always wins
  // once it is not English, because the spoken text is already translated by then.
  const speechLanguage = appLanguage !== "en" ? appLanguage : preferredLanguage;
  const speechRate = rate === null || rate === undefined ? clampSpeechRate(storedVoiceRate || 1) : clampSpeechRate(rate);
  const voiceEnabled = storedVoiceEnabled !== "false";

  const resolveSpeechText = useCallback(async (sourceText) => {
    if (speechLanguage === "en") return sourceText;
    const cacheKey = `${speechLanguage}:${sourceText}`;
    const cached = translationRef.current.get(cacheKey);
    if (cached) return cached;
    const response = await fetch("/api/voice/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sourceText, language: speechLanguage }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t.speechUnavailable);
    translationRef.current.set(cacheKey, data.translatedText);
    return data.translatedText;
  }, [speechLanguage, t.speechUnavailable]);

  // Warm the translation cache so a click can start playback synchronously: Safari only
  // allows speech synthesis while the originating user gesture is still active.
  useEffect(() => {
    if (speechLanguage === "en" || !text) return;
    if (translationRef.current.has(`${speechLanguage}:${text}`)) return;
    resolveSpeechText(text).catch(() => {});
  }, [speechLanguage, text, resolveSpeechText]);

  // Changed text or language invalidates queued audio, so playback is stopped.
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      spokenTextRef.current = "";
      indexRef.current = 0;
      chunksRef.current = [];
      if (hasSpeechSupport()) window.speechSynthesis.cancel();
      setState("idle");
    };
  }, [text, speechLanguage]);

  const loadVoices = useCallback(async () => {
    if (!hasSpeechSupport()) return [];
    const engine = window.speechSynthesis;
    const immediate = engine.getVoices();
    if (immediate.length > 0) return immediate;
    // Chrome populates the voice list asynchronously, so wait briefly for it.
    return new Promise((resolve) => {
      let settled = false;
      let timer = 0;
      const finish = () => {
        if (settled) return;
        settled = true;
        engine.removeEventListener("voiceschanged", finish);
        window.clearTimeout(timer);
        resolve(engine.getVoices());
      };
      timer = window.setTimeout(finish, VOICE_WAIT_MS);
      engine.addEventListener("voiceschanged", finish, { once: true });
    });
  }, []);

  function handleSpeechError(event) {
    if (cancelledRef.current) return;
    const code = event?.error || "";
    if (IGNORED_SPEECH_ERRORS.has(code)) return;
    console.warn("[ReadAloud] speech synthesis error:", code || "unknown");
    setState("idle");
    setNotice("");
    setError(t[SPEECH_ERROR_MESSAGES[code] || "speechUnavailable"]);
  }

  function speakNext() {
    if (cancelledRef.current) return;
    const engine = window.speechSynthesis;
    const chunks = chunksRef.current;
    if (indexRef.current >= chunks.length) {
      utteranceRef.current = null;
      setState("idle");
      return;
    }
    const chunk = chunks[indexRef.current];
    indexRef.current += 1;
    const utterance = new SpeechSynthesisUtterance(chunk);
    const voice = voiceRef.current;
    // utterance.lang and utterance.voice are kept in sync on purpose: a mismatched pair
    // is the most common cause of "voice-unavailable" and "synthesis-failed" errors.
    utterance.lang = (voice && voice.lang) || localeRef.current;
    if (voice) utterance.voice = voice;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      if (!cancelledRef.current) setState("playing");
    };
    utterance.onend = speakNext;
    utterance.onerror = handleSpeechError;
    utteranceRef.current = utterance;
    engine.speak(utterance);
  }

  async function start(restart = false) {
    if (!hasSpeechSupport()) {
      setError(t.speechUnsupported);
      return;
    }
    const sourceText = typeof text === "string" ? text.trim() : "";
    if (!sourceText) return;
    const engine = window.speechSynthesis;
    const wasPlaying = Boolean(engine.speaking || engine.pending || engine.paused);
    cancelledRef.current = false;
    setError("");
    setNotice("");
    setState("loading");
    engine.cancel();
    try {
      let speakableText = restart ? spokenTextRef.current : "";
      if (!speakableText) speakableText = await resolveSpeechText(sourceText);
      if (!speakableText || !speakableText.trim()) throw new Error(t.speechUnavailable);
      spokenTextRef.current = speakableText;
      const chunks = splitIntoSpeechChunks(speakableText);
      if (chunks.length === 0) throw new Error(t.speechUnavailable);
      const voices = await loadVoices();
      if (voices.length === 0) {
        setState("idle");
        setError(t.noVoices);
        return;
      }
      const matchedVoice = pickSpeechVoice(voices, speechLanguage);
      voiceRef.current = matchedVoice || getDefaultSpeechVoice(voices);
      localeRef.current = getSpeechLocale(speechLanguage);
      if (!matchedVoice) {
        const languageName = (t.languageNames && t.languageNames[speechLanguage]) || speechLanguage;
        setNotice(t.voiceMissing.replace("{language}", languageName));
      }
      chunksRef.current = chunks;
      indexRef.current = 0;
      // Chrome silently drops utterances queued in the same tick as cancel().
      if (wasPlaying) await waitFor(CANCEL_SETTLE_MS);
      if (cancelledRef.current) return;
      speakNext();
    } catch (playbackError) {
      setState("idle");
      setError(playbackError?.message || t.speechUnavailable);
    }
  }

  function pause() {
    if (!hasSpeechSupport() || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setState("paused");
  }

  function resume() {
    if (!hasSpeechSupport() || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setState("playing");
  }

  function stop() {
    cancelledRef.current = true;
    utteranceRef.current = null;
    if (hasSpeechSupport()) window.speechSynthesis.cancel();
    setNotice("");
    setState("idle");
  }

  if (!voiceEnabled) return null;

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
      {error && <span role="alert" className="text-xs text-rose-600 dark:text-rose-400">{error}</span>}
      {!error && notice && <span role="status" className="text-xs text-amber-600 dark:text-amber-400">{notice}</span>}
    </div>
  );
}

