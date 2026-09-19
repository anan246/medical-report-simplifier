"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import ProcessingScreen from "@/components/ProcessingScreen";
import ReportResults from "@/components/ReportResults";
import ReportChatbot from "@/components/ReportChatbot";
import { DNAHelix, ECGLine, Molecule, Pill, MedicalCross } from "@/components/MedicalAnimations";
import { useAppContext } from "@/components/ThemeProvider";
import { getT } from "@/lib/i18n";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const FEATURE_ICONS = ["🔬", "📊", "🤖", "🔒"];
const TRUST_ICONS = ["🔒", "🚫", "🤖"];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FileTypeIcon({ type }) {
  const isPdf = type === "application/pdf";
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPdf ? "bg-rose-50 dark:bg-rose-900/20" : "bg-sky-50 dark:bg-sky-900/20"}`}>
      {isPdf ? (
        <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
}

export default function UploadPage() {
  const { language } = useAppContext();
  const t = getT(language);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState("idle");
  const [processingStep, setProcessingStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [report, setReport] = useState(null);
  const inputRef = useRef(null);

  function validateAndSetFile(f) {
    setValidationError("");
    setErrorMessage("");
    setStatus("idle");
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setValidationError(t.upload.unsupportedFile);
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setValidationError(t.upload.fileTooLarge);
      return;
    }
    setFile(f);
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  }

  function handleFileInput(e) {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSetFile(f);
  }, [t]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  function removeFile() {
    setFile(null);
    setPreviewUrl(null);
    setValidationError("");
    setErrorMessage("");
    setReport(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUploadAndAnalyze() {
    if (!file || isProcessing) return;
    setStatus("uploading");
    setProcessingStep(1);
    setErrorMessage("");
    setReport(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      setProcessingStep(2);
      const uploadRes = await fetch("/api/reports/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.message || "Upload failed");
      setStatus("analyzing");
      setProcessingStep(3);
      await new Promise((r) => setTimeout(r, 300));
      setProcessingStep(4);
      const analyzeRes = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: uploadData.reportId, filePath: uploadData.filePath, mimeType: uploadData.mimeType }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error(analyzeData.message || "Analysis failed");
      setProcessingStep(5);
      await new Promise((r) => setTimeout(r, 500));
      setReport(analyzeData);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const isProcessing = status === "uploading" || status === "analyzing";
  const canSubmit = !!file && !isProcessing && !validationError;

  return (
    <main className="min-h-screen bg-gradient-animated">

      {status !== "success" && (
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
          <div className="blob-glow absolute top-0 left-1/2 w-[600px] h-[220px] bg-emerald-400/15 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="animate-float delay-0 absolute top-8 left-[6%] w-10 h-10 rounded-full border-2 border-emerald-200/40 dark:border-emerald-700/30 hidden lg:block xl:hidden" />
          <div className="animate-float delay-400 absolute top-16 right-[8%] w-7 h-7 rounded-full border-2 border-emerald-300/30 dark:border-emerald-600/20 hidden lg:block xl:hidden" />
          <div className="hidden xl:flex flex-col items-center gap-6 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
            <DNAHelix />
            <MedicalCross size="w-8 h-8" className="opacity-60" />
          </div>
          <div className="hidden xl:flex flex-col items-center gap-6 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
            <Molecule color="teal" />
            <Pill rotate="12deg" animClass="animate-pill2" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
            <div className="animate-fade-down inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                {t.upload.badge}
              </span>
            </div>

            <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.upload.headline1}
              <span className="block text-shimmer">{t.upload.headline2}</span>
            </h1>

            <p className="animate-fade-up delay-200 mt-4 text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              {t.upload.sub}
            </p>

            <div className="animate-fade-up delay-300 mt-5 w-full max-w-xs mx-auto opacity-50">
              <ECGLine className="h-10" />
            </div>

            <div className="animate-fade-up delay-400 mt-6 flex flex-wrap justify-center gap-2">
              {t.upload.features.map((label, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm">
                  <span>{FEATURE_ICONS[i]}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className={`max-w-3xl mx-auto px-4 sm:px-6 ${status === "success" ? "py-8" : "py-10"}`}>

        {isProcessing ? (
          <div className="animate-scale-in bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <ProcessingScreen currentStep={processingStep} />
          </div>
        ) : status === "success" && report ? (
          <div className="animate-fade-up space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 px-5 py-4 shadow-sm animate-border-glow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.upload.analysisComplete}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{report.tests?.length || 0} {t.upload.testExtracted}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {t.upload.newReport}
              </button>
            </div>
            <ReportResults report={report} />
            <ReportChatbot report={report} />
          </div>
        ) : (
          <div className="animate-fade-up space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t.upload.cardTitle}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.upload.cardSub}</p>
              </div>

              <div className="p-6 space-y-4">
                {!file ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl cursor-pointer group ${
                      isDragging
                        ? "border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/10 dark:border-emerald-500 scale-[1.02] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 hover:shadow-md"
                    }`}
                    style={{ transition: "all 200ms cubic-bezier(0.16,1,0.3,1)" }}
                  >
                    <input ref={inputRef} type="file" accept={ACCEPTED_EXTENSIONS} onChange={handleFileInput} className="hidden" />
                    <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        isDragging ? "bg-emerald-100 dark:bg-emerald-900/40 scale-110" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20"
                      }`}>
                        <svg className={`w-8 h-8 transition-colors duration-200 ${isDragging ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold transition-colors ${isDragging ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                          {isDragging ? t.upload.dragActive : t.upload.dragIdle}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          or <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.upload.browse}</span> {t.upload.browseFrom}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {["PDF", "PNG", "JPG", "JPEG"].map((fmt) => (
                          <span key={fmt} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-mono rounded-lg shadow-sm">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
                      <FileTypeIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{formatBytes(file.size)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t.upload.readyLabel}</span>
                        </div>
                      </div>
                      <button onClick={removeFile} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {previewUrl && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <div className="relative w-full h-56 bg-white dark:bg-slate-900">
                          <Image src={previewUrl} alt="Report preview" fill className="object-contain" />
                        </div>
                      </div>
                    )}
                    {file.type === "application/pdf" && (
                      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-2 bg-white dark:bg-slate-900">
                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{t.upload.pdfReady}</span>
                      </div>
                    )}
                  </div>
                )}

                {validationError && (
                  <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
                  </div>
                )}

                {status === "error" && errorMessage && (
                  <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t.upload.analysisFailed}</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUploadAndAnalyze}
                  disabled={!canSubmit}
                  className={`btn-press w-full py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 ${
                    canSubmit
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-200 dark:hover:shadow-emerald-900/40 hover:shadow-lg"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                  style={{ transition: "all 150ms ease" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {t.upload.submitBtn}
                </button>
              </div>
            </div>

            <div className="animate-fade-up delay-200 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
              {t.upload.trust.map((text, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span>{TRUST_ICONS[i]}</span>
                  {text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
