"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What is MediLens?",
      answer:
        "MediLens is an AI-powered medical report simplifier that converts complex report information into a clearer and more structured format.",
    },
    {
      question: "Can MediLens diagnose a disease?",
      answer:
        "No. MediLens only helps simplify and organize information contained in a medical report. It does not provide a medical diagnosis or replace professional medical advice.",
    },
    {
      question: "Can I compare previous reports?",
      answer:
        "Yes. You can compare selected test values from different reports and see whether values increased, decreased, or remained unchanged.",
    },
    {
      question: "Can I download my report summary?",
      answer:
        "Yes. After your report is processed, you can download a structured summary for your personal reference.",
    },
  ];

  return (
    <main className="dashboard-page min-h-screen bg-[#f6fbf7] text-slate-900">

      {/* =====================================================
          HERO — ONLY THIS SECTION HAS BEEN CHANGED
      ====================================================== */}
      <section className="relative min-h-[680px] overflow-hidden bg-white dark:bg-slate-950">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/medilens-hero.png')",
          }}
        />

        {/* Soft overlay so our text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-950 dark:via-slate-950/85 dark:to-transparent" />

        {/* Green subtle overlay on right */}
        <div className="absolute inset-0 bg-gradient-to-l from-green-900/10 via-transparent to-transparent" />

        {/* Hero content */}
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-20 md:px-10">

          <div className="max-w-[570px]">

            {/* Main heading */}
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[64px]">
              Your health,
              <span className="block text-green-600 dark:text-emerald-400">
                in clearer words.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              MediLens transforms complex medical reports into clear,
              structured information that is easier to read and understand.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/upload"
                className="group inline-flex min-h-[54px] items-center gap-3 rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 transition duration-300 hover:-translate-y-1 hover:bg-green-700"
              >
                Upload Report
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-[54px] items-center rounded-xl border border-green-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:text-green-700 dark:hover:text-emerald-400"
              >
                How it works
              </a>
            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950 text-xs font-bold text-green-700 dark:text-emerald-400">
                  ✓
                </span>
                Easy to understand
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950 text-xs font-bold text-green-700 dark:text-emerald-400">
                  ✓
                </span>
                Structured results
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950 text-xs font-bold text-green-700 dark:text-emerald-400">
                  ✓
                </span>
                Compare reports
              </span>
            </div>

            {/* Small product card */}
            <div className="mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-green-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg backdrop-blur">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-emerald-950 text-xl text-green-700 dark:text-emerald-400">
                ✦
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  MediLens 
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Turning complicated medical information into something easier
                  to understand.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Small floating badge on image */}
        <div className="absolute bottom-8 right-8 hidden rounded-2xl border border-green-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-5 py-4 shadow-xl backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400">
              ✓
            </div>
            <div>
              <p className="text-xs text-slate-400">
                MediLens
              </p>
              <p className="font-bold text-slate-800 dark:text-white">
                Understand better
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* =====================================================
          PRODUCT INTRODUCTION
      ====================================================== */}
      <section className="border-y border-green-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600 dark:text-emerald-400">
              Meet MediLens
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Your medical report, explained clearly
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Instead of searching through complicated terminology and numbers,
              MediLens organizes the important information in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="✦"
              title="Simplify"
              description="Understand complicated medical terminology through simple, patient-friendly explanations."
            />
            <FeatureCard
              icon="▤"
              title="Organize"
              description="View test names, values, units, reference ranges and statuses in a structured format."
            />
            <FeatureCard
              icon="↗"
              title="Compare"
              description="Compare selected test values across different reports and track changes over time."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section
        id="how-it-works"
        className="bg-[#f6fbf7] dark:bg-slate-950 px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600 dark:text-emerald-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
              Three simple steps
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              From uploading your report to understanding its information.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[330px_1fr]">
            <div className="space-y-3">
              <StepButton
                number="01"
                title="Upload"
                description="Add your report"
                active={activeStep === 1}
                onClick={() => setActiveStep(1)}
              />
              <StepButton
                number="02"
                title="Analyze"
                description="Extract important information"
                active={activeStep === 2}
                onClick={() => setActiveStep(2)}
              />
              <StepButton
                number="03"
                title="Understand"
                description="View simplified results"
                active={activeStep === 3}
                onClick={() => setActiveStep(3)}
              />
            </div>

            <div className="rounded-3xl border border-green-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm md:p-10">
              {activeStep === 1 && (
                <ProcessContent
                  number="01"
                  title="Upload your medical report"
                  text="Upload your medical report and let MediLens begin organizing the information contained within it."
                  icon="↑"
                />
              )}
              {activeStep === 2 && (
                <ProcessContent
                  number="02"
                  title="Important information is extracted"
                  text="Relevant details such as test names, values, units and reference ranges are organized into a structured format."
                  icon="✦"
                />
              )}
              {activeStep === 3 && (
                <ProcessContent
                  number="03"
                  title="Understand your report"
                  text="Explore simplified explanations, individual test information, report history and comparisons."
                  icon="✓"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REPORT COMPARISON
      ====================================================== */}
      <section className="bg-white dark:bg-slate-900 px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600 dark:text-emerald-400">
              Track changes
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
              Compare reports over time
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              When you have multiple reports, MediLens helps place
              corresponding test values side by side so changes are easier to
              notice.
            </p>

            <div className="mt-7 space-y-4">
              <Bullet text="Compare corresponding test values" />
              <Bullet text="See numerical differences between reports" />
              <Bullet text="Review your report history" />
              <Bullet text="Download a structured summary" />
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 dark:border-slate-800 bg-[#f6fbf7] dark:bg-slate-950 p-5 shadow-sm">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-emerald-400">
                    Report comparison
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    Test trends
                  </p>
                </div>
                <span className="rounded-full bg-green-100 dark:bg-emerald-950 px-3 py-1 text-xs font-semibold text-green-700 dark:text-emerald-400">
                  2 Reports
                </span>
              </div>

              <ComparisonRow
                test="HbA1c"
                oldValue="6.1%"
                newValue="6.7%"
                change="+0.6"
              />
              <ComparisonRow
                test="Glucose"
                oldValue="112"
                newValue="126"
                change="+14"
              />
              <ComparisonRow
                test="Hemoglobin"
                oldValue="13.5"
                newValue="13.8"
                change="+0.3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CTA
      ====================================================== */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-r from-green-700 to-emerald-700 px-7 py-14 text-white shadow-xl md:px-14">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
                Get started with MediLens
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Make your next medical report easier to understand.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-green-50">
                Upload your report and explore its important information in a
                clearer, structured format.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-green-700 transition hover:-translate-y-1 hover:bg-green-50"
            >
              Upload Report →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}
      <section className="bg-[#f6fbf7] dark:bg-slate-950 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600 dark:text-emerald-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-green-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-800 dark:text-slate-200 transition hover:text-green-700 dark:hover:text-emerald-400"
                  >
                    <span>{faq.question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-slate-800 text-xl text-green-600 dark:text-emerald-400">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-green-50 dark:border-slate-800 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER / DISCLAIMER
      ====================================================== */}
      <footer className="border-t border-green-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 md:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 font-bold text-amber-700 dark:text-amber-400">
            !
          </div>
          <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
            Important medical information
          </h3>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            MediLens is an information and report-simplification tool. It does
            not provide medical diagnosis, treatment recommendations or
            professional medical advice. Always discuss your medical results
            with a qualified healthcare professional.
          </p>
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} MediLens. Built to make medical
              information easier to understand.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function ReportRow({
  name,
  value,
  status,
  statusClass,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

      <div>
        <p className="text-sm font-semibold text-slate-700">
          {name}
        </p>

        <p className="text-xs text-slate-400">
          {value}
        </p>
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
      >
        {status}
      </span>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-3xl border border-green-100 bg-[#f6fbf7] p-7 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:bg-white hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl font-bold text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}


function StepButton({
  number,
  title,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[82px] w-full items-center gap-4 rounded-2xl px-5 text-left transition ${
        active
          ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
          : "border border-green-100 bg-white text-slate-700 hover:border-green-200"
      }`}
    >

      <span
        className={`text-sm font-bold ${
          active
            ? "text-green-100"
            : "text-green-600"
        }`}
      >
        {number}
      </span>

      <span>

        <span className="block font-semibold">
          {title}
        </span>

        <span
          className={`mt-1 block text-xs ${
            active
              ? "text-green-100"
              : "text-slate-400"
          }`}
        >
          {description}
        </span>

      </span>

      <span className="ml-auto text-lg">
        →
      </span>

    </button>
  );
}


function ProcessContent({
  number,
  title,
  text,
  icon,
}) {
  return (
    <div className="flex flex-col gap-7 md:flex-row md:items-center">

      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-green-100 dark:bg-emerald-950 text-3xl font-bold text-green-700 dark:text-emerald-400">
        {icon}
      </div>

      <div>

        <p className="text-sm font-bold text-green-600 dark:text-emerald-400">
          STEP {number}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
          {text}
        </p>

      </div>

    </div>
  );
}


function ComparisonRow({
  test,
  oldValue,
  newValue,
  change,
}) {
  return (
    <div className="mb-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 last:mb-0">

      <div className="flex items-center justify-between">

        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {test}
        </span>

        <span className="rounded-full bg-green-100 dark:bg-emerald-950 px-2.5 py-1 text-xs font-bold text-green-700 dark:text-emerald-400">
          {change}
        </span>

      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">

        <div>
          <p className="text-xs text-slate-400">
            Previous
          </p>

          <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
            {oldValue}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Current
          </p>

          <p className="mt-1 font-semibold text-green-700 dark:text-emerald-400">
            {newValue}
          </p>
        </div>

      </div>

    </div>
  );
}


function Bullet({ text }) {
  return (
    <div className="flex items-center gap-3">

      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950 text-sm font-bold text-green-600 dark:text-emerald-400">
        ✓
      </span>

      <span className="text-slate-700 dark:text-slate-300">
        {text}
      </span>

    </div>
  );
}


function Check() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
      ✓
    </span>
  );
}


function DocumentIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 3h8l4 4v14H7V3Z"
        stroke="currentColor"
        className="text-green-600"
        strokeWidth="1.8"
      />

      <path
        d="M15 3v5h4"
        stroke="currentColor"
        className="text-green-600"
        strokeWidth="1.8"
      />

      <path
        d="M10 13h6M10 17h4"
        stroke="currentColor"
        className="text-green-600"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function HeartIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 4 1.2 6 3.5C14 6.2 16 5 18 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21Z"
        fill="#16a34a"
      />
    </svg>
  );
}
