const DEFAULT_SPEECH_LANGUAGE = "en";

export const SPEECH_LANGUAGES = {
  en: { locale: "en-US", fallbacks: ["en-US", "en-GB", "en-IN", "en"] },
  hi: { locale: "hi-IN", fallbacks: ["hi-IN", "hi"] },
  kn: { locale: "kn-IN", fallbacks: ["kn-IN", "kn"] },
};

export const MIN_SPEECH_RATE = 0.5;
export const MAX_SPEECH_RATE = 2;
export const MAX_SPEECH_CHUNK_LENGTH = 200;

export function normalizeLangTag(value) {
  return String(value || "").replace(/_/g, "-").trim().toLowerCase();
}

export function getSpeechLocale(language = DEFAULT_SPEECH_LANGUAGE) {
  return (SPEECH_LANGUAGES[language] || SPEECH_LANGUAGES[DEFAULT_SPEECH_LANGUAGE]).locale;
}

export function getSpeechFallbackLocales(language = DEFAULT_SPEECH_LANGUAGE) {
  return (SPEECH_LANGUAGES[language] || SPEECH_LANGUAGES[DEFAULT_SPEECH_LANGUAGE]).fallbacks;
}

// Offline (local) voices never fail with network/synthesis errors, so they are the
// most reliable choice when several voices match the requested language.
function preferReliableVoice(matches) {
  return matches.find((voice) => voice.localService === true)
    || matches.find((voice) => voice.default === true)
    || matches[0];
}

function usableVoices(voices) {
  return Array.isArray(voices) ? voices.filter((voice) => voice && voice.lang) : [];
}

// Resolves the voice that actually speaks the requested language: exact locale first,
// then the documented fallback locales, then any voice sharing the base language.
export function pickSpeechVoice(voices, language = DEFAULT_SPEECH_LANGUAGE) {
  const list = usableVoices(voices);
  if (list.length === 0) return null;
  for (const locale of getSpeechFallbackLocales(language)) {
    const target = normalizeLangTag(locale);
    const exact = list.filter((voice) => normalizeLangTag(voice.lang) === target);
    if (exact.length > 0) return preferReliableVoice(exact);
  }
  const base = normalizeLangTag(getSpeechLocale(language)).split("-")[0];
  const sameLanguage = list.filter((voice) => normalizeLangTag(voice.lang).split("-")[0] === base);
  return sameLanguage.length > 0 ? preferReliableVoice(sameLanguage) : null;
}

export function getDefaultSpeechVoice(voices) {
  const list = usableVoices(voices);
  return list.length > 0 ? preferReliableVoice(list) : null;
}

export function clampSpeechRate(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate <= 0) return 1;
  return Math.min(MAX_SPEECH_RATE, Math.max(MIN_SPEECH_RATE, rate));
}

// Speech engines fail on empty utterances ("synthesis-failed") and on very long ones,
// so text is split into non-empty sentences/sections of a safe length.
export function splitIntoSpeechChunks(value, maxLength = MAX_SPEECH_CHUNK_LENGTH) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const sentences = normalized.match(/[^.!?\u0964\u0965\u0ce4\u0ce5]+[.!?\u0964\u0965\u0ce4\u0ce5]*/g) || [];
  const chunks = [];
  for (const sentence of sentences) {
    let rest = sentence.trim();
    while (rest.length > maxLength) {
      const breakAt = rest.lastIndexOf(" ", maxLength);
      const cut = breakAt > 0 ? breakAt : maxLength;
      const head = rest.slice(0, cut).trim();
      if (head) chunks.push(head);
      rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest);
  }
  return chunks;
}
