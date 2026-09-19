"use client";

import { useState, useRef, useCallback } from "react";
import ProcessingScreen from "@/components/ProcessingScreen";
import ReportResults from "@/components/ReportResults";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

const FEATURES = [
  { icon: "🔬", label: "Extracts all test values" },
  { icon: "📊", label: "Reference range comparison" },
  { icon: "🤖", label: "Gemini AI powered" },
  { icon: "🔒", label: "Secure & private" },
];

export default function UploadPage() {
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
      setValidationError("Unsupported file type. Please upload a PDF, PNG, or JPG.");
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setValidationError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
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
  }, []);

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
      formData.append("userId", "anonymous");

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
    <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950">

      {/* Hero section */}
      {status !== "success" && (
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                AI-Powered Analysis
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Understand Your
              <span className="block text-emerald-600"> Medical Report</span>
            </h1>

            <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Upload any lab report and our AI instantly extracts every test result, compares it against reference ranges, and presents it in a clear, easy-to-read format.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {FEATURES.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 ${status === "success" ? "py-8" : "py-10"}`}>

        {isProcessing ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <ProcessingScreen currentStep={processingStep} />
          </div>
        ) : status === "success" && report ? (
          <div className="space-y-6">
            {/* Success banner */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Analysis complete</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{report.tests?.length || 0} test results extracted</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                New report
              </button>
            </div>
            <ReportResults report={report} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Upload your report</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supports PDF, PNG, JPG · Max {MAX_SIZE_MB} MB</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Drop zone */}
                {!file ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group ${
                      isDragging
                        ? "border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/10 dark:border-emerald-500 scale-[1.01]"
                        : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <input ref={inputRef} type="file" accept={ACCEPTED_EXTENSIONS} onChange={handleFileInput} className="hidden" />

                    <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
                      {/* Upload icon */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        isDragging
                          ? "bg-emerald-100 dark:bg-emerald-900/40 scale-110"
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20"
                      }`}>
                        <svg className={`w-8 h-8 transition-colors duration-200 ${isDragging ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold transition-colors ${isDragging ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                          {isDragging ? "Release to upload" : "Drag & drop your report here"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          or <span className="text-emerald-600 dark:text-emerald-400 font-semibold">browse files</span> from your device
                        </p>
                      </div>

                      {/* Format badges */}
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
                  /* File selected state */
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
                      <FileTypeIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{formatBytes(file.size)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready to analyse</span>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Image preview */}
                    {previewUrl && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <img src={previewUrl} alt="Report preview" className="w-full max-h-56 object-contain bg-white dark:bg-slate-900" />
                      </div>
                    )}

                    {/* PDF ready bar */}
                    {file.type === "application/pdf" && (
                      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-2 bg-white dark:bg-slate-900">
                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-slate-500 dark:text-slate-400">PDF loaded and ready for AI analysis</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation error */}
                {validationError && (
                  <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
                  </div>
                )}

                {/* API error */}
                {status === "error" && errorMessage && (
                  <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">Analysis failed</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-0.5 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleUploadAndAnalyze}
                  disabled={!canSubmit}
                  className={`w-full py-3.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 ${
                    canSubmit
                      ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-sm hover:shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Upload &amp; Analyse with AI
                </button>
              </div>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
              {[
                { icon: "🔒", text: "Secure upload" },
                { icon: "🚫", text: "No diagnosis provided" },
                { icon: "🤖", text: "Powered by Gemini AI" },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span>{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
