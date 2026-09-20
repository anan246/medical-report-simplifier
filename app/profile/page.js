"use client";

import { useEffect, useRef, useState } from "react";
import { getTranslations, LANGUAGE_LABELS } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";

const defaults = {
	name: "",
	email: "",
	profileImage: "",
	language: "en",
	theme: "system",
	notifications: { email: true, reportReady: true, productUpdates: false },
	voice: { enabled: true, autoReadSummary: false, language: "en", rate: 1 },
};

function mergeSettings(user) {
	return {
		...defaults,
		...user,
		notifications: { ...defaults.notifications, ...user.notifications },
		voice: { ...defaults.voice, ...user.voice },
	};
}

function Section({ title, description, children }) {
	return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"><h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}<div className="mt-5">{children}</div></section>;
}

function Toggle({ label, description, checked, onChange }) {
	return <label className="flex items-center justify-between gap-4 py-3 cursor-pointer"><span><span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>{description && <span className="block mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</span>}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-emerald-600" /></label>;
}

export default function ProfilePage() {
	const { setLanguage, setThemePreference } = useTheme();
	const [settings, setSettings] = useState(defaults);
	const [savedSettings, setSavedSettings] = useState(defaults);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const fileRef = useRef(null);
	const loadedRef = useRef(false);
	const t = getTranslations(settings.language);

	useEffect(() => {
		if (loadedRef.current) return;
		loadedRef.current = true;
		let cancelled = false;
		fetch("/api/settings").then(async (response) => {
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Unable to load settings.");
			if (!cancelled) {
				const next = mergeSettings(data.user);
				setSettings(next); setSavedSettings(next); setLanguage(next.language); setThemePreference(next.theme);
			}
		}).catch((loadError) => { if (!cancelled) setError(loadError.message); }).finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, [setLanguage, setThemePreference]);

	function update(field, value) { setSettings((current) => ({ ...current, [field]: value })); setStatus(""); setError(""); }
	function updateNested(section, field, value) { setSettings((current) => ({ ...current, [section]: { ...current[section], [field]: value } })); setStatus(""); setError(""); }
	function changeLanguage(language) { update("language", language); updateNested("voice", "language", language); setLanguage(language); }
	function changeVoiceLanguage(language) { updateNested("voice", "language", language); update("language", language); setLanguage(language); }
	function changeTheme(theme) { update("theme", theme); setThemePreference(theme); }
	function changeAvatar(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/") || file.size > 1_400_000) { setError("Choose an image smaller than 1.4 MB."); return; }
		const reader = new FileReader(); reader.onload = () => update("profileImage", reader.result); reader.readAsDataURL(file);
	}
	async function saveChanges(event) {
		event.preventDefault(); setSaving(true); setStatus(""); setError("");
		try {
			const response = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
			const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save settings.");
			const next = mergeSettings(data.user);
			setSettings(next); setSavedSettings(next); setStatus(t.saved);
			localStorage.setItem("medilens-language", data.user.language || "en");
			localStorage.setItem("medilens-voice-language", data.user.voice?.language || data.user.language || "en");
			localStorage.setItem("medilens-voice-rate", String(data.user.voice?.rate || 1));
			localStorage.setItem("medilens-voice-enabled", String(data.user.voice?.enabled !== false));
		} catch (saveError) { setError(saveError.message); } finally { setSaving(false); }
	}

	return <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6"><form onSubmit={saveChanges} className="max-w-4xl mx-auto space-y-6">
		<header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-600">MediLens</p><h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{t.settings}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.settingsIntro}</p></div><div className="flex items-center gap-3">{status && <span role="status" className="text-sm text-emerald-600">{status}</span>}<button type="button" onClick={() => { setSettings(savedSettings); setStatus(""); setError(""); }} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{t.cancel}</button><button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? "Saving..." : t.save}</button></div></header>
		{error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
		<Section title={t.profile} description="Your account information is shared only with your authenticated account."><div className="flex items-center gap-4">{settings.profileImage ? <img src={settings.profileImage} alt="Profile" className="h-20 w-20 rounded-2xl object-cover" /> : <div className="h-20 w-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl font-bold text-emerald-700">{settings.name?.charAt(0)?.toUpperCase() || "M"}</div>}<div><button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Change photo</button><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={changeAvatar} className="hidden" /><p className="mt-2 text-xs text-slate-500">PNG, JPG, or WebP up to 1.4 MB</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.name}<input value={settings.name} onChange={(event) => update("name", event.target.value)} maxLength={80} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm" /></label><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.email}<input value={settings.email} readOnly className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-500" /></label></div></Section>
		<Section title={t.preferences}><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.language}<select value={settings.language} onChange={(event) => changeLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm">{Object.entries(LANGUAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.theme}<select value={settings.theme} onChange={(event) => changeTheme(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label></div><div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800"><Toggle label={t.notifications} description="Receive important account and report updates." checked={settings.notifications.email} onChange={(value) => updateNested("notifications", "email", value)} /><Toggle label="Report ready notifications" checked={settings.notifications.reportReady} onChange={(value) => updateNested("notifications", "reportReady", value)} /><Toggle label="Product updates" checked={settings.notifications.productUpdates} onChange={(value) => updateNested("notifications", "productUpdates", value)} /></div></Section>
		<Section title={t.voice} description="MediLens reads existing report information only. It does not provide medical advice."><div className="divide-y divide-slate-100 dark:divide-slate-800"><Toggle label={t.readAloud} checked={settings.voice.enabled} onChange={(value) => updateNested("voice", "enabled", value)} /><Toggle label={t.autoRead} description="Nothing plays unless you explicitly enable this option." checked={settings.voice.autoReadSummary} onChange={(value) => updateNested("voice", "autoReadSummary", value)} /></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.voiceLanguage}<select value={settings.voice.language} onChange={(event) => changeVoiceLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm">{Object.entries(LANGUAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.speed}<input type="range" min="0.5" max="2" step="0.1" value={settings.voice.rate} onChange={(event) => updateNested("voice", "rate", Number(event.target.value))} className="mt-4 w-full accent-emerald-600" /><span className="text-xs text-slate-500">{settings.voice.rate}x</span></label></div></Section>
		<Section title={t.privacy} description="Reports, comparisons, and profile data are scoped to your authenticated account."><div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-800 dark:text-emerald-300">{t.secureAccount}</div><p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{t.disclaimer}</p></Section>
		<Section title={t.about}><p className="text-sm text-slate-600 dark:text-slate-300">MediLens helps patients understand information already present in medical reports. Version 1.0.</p></Section>
	</form></main>;
}
