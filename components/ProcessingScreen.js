"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: 1, label: "Uploading report", sublabel: "Sending your file securely" },
  { id: 2, label: "Reading document", sublabel: "Extracting text content" },
  { id: 3, label: "Identifying tests", sublabel: "Scanning all sections" },
  { id: 4, label: "AI structuring data", sublabel: "Gemini processing results" },
  { id: 5, label: "Preparing results", sublabel: "Almost ready" },
];

export default function ProcessingScreen({ currentStep = 1 }) {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimatedStep(i);
      if (i >= currentStep) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [currentStep]);

  const progress = Math.round((animatedStep / STEPS.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-6">
      {/* Animated icon */}
      <div className="relative w-20 h-20 mb-8">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-800" />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{progress}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        Analysing your report
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">
        Our AI is reading every page and extracting all test results
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((step) => {
          const isDone = animatedStep > step.id;
          const isActive = animatedStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50"
                  : isDone
                  ? "opacity-50"
                  : "opacity-25"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isDone ? "bg-emerald-500" : isActive ? "border-2 border-emerald-500 bg-white dark:bg-slate-900" : "bg-slate-200 dark:bg-slate-700"
              }`}>
                {isDone ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium leading-none ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{step.sublabel}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
