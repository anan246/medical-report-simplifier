"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to create your account.");
      router.push("/report-dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <section className="relative hidden lg:block overflow-hidden min-h-screen">

          {/* Medical Background */}
          <img
            src="/medical-side.png"
            alt="MediLens medical workspace"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Light overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7fbf8]/95 via-[#f7fbf8]/55 to-transparent" />

          {/* LEFT CONTENT */}
          <div className="relative z-10 h-full min-h-screen flex flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                M
              </div>

              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Medi<span className="text-emerald-600">Lens</span>
                </h1>

                <p className="text-sm text-slate-600">
                  See Deeper. Understand Better.
                </p>
              </div>

            </div>


            {/* HERO CONTENT */}
            <div className="max-w-xl">

          

              <h2 className="text-5xl xl:text-6xl font-bold leading-[1.08] text-slate-900">

                Understand your

                <br />

                <span className="text-emerald-600">
                  health reports
                </span>

                <br />

                simply.

              </h2>

              <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
                Upload your medical reports and get clear,
                simple explanations powered by AI.
              </p>


              {/* FEATURES */}
              

            </div>


            {/* BOTTOM */}
            <div>

              <p className="text-xl italic text-slate-700">
                Better insights.
              </p>

              <p className="text-xl italic text-emerald-700">
                Healthier understanding.
              </p>

            </div>

          </div>

        </section>


        {/* ================= RIGHT SIDE ================= */}
        <section className="flex items-center justify-center min-h-screen px-6 sm:px-10 lg:px-16 bg-[#fdfefd] dark:bg-slate-950">

          <div className="w-full max-w-md">

            {/* Logo on mobile */}
            <div className="lg:hidden mb-10">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  M
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Medi<span className="text-emerald-600">Lens</span>
                </h1>

              </div>

            </div>


            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                Create your account
              </h2>

              <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
                Start understanding your medical reports
                in simple language.
              </p>

            </div>


            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Name */}
              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                  placeholder="Enter your full name"
                  className="
                    w-full
                    h-14
                    px-4
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    text-slate-900
                    dark:text-white
                    placeholder:text-slate-400
                    outline-none
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition
                  "
                />

              </div>


              {/* Email */}
              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                  placeholder="you@example.com"
                  className="
                    w-full
                    h-14
                    px-4
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    text-slate-900
                    dark:text-white
                    placeholder:text-slate-400
                    outline-none
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition
                  "
                />

              </div>


              {/* Password */}
              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  minLength={8}
                  required
                  placeholder="Create a password"
                  className="
                    w-full
                    h-14
                    px-4
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    text-slate-900
                    dark:text-white
                    placeholder:text-slate-400
                    outline-none
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition
                  "
                />

              </div>


              {/* Button */}
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-14
                  rounded-xl
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  font-semibold
                  shadow-lg
                  shadow-emerald-600/20
                  transition
                "
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>

            </form>


            {/* OR */}
            <div className="flex items-center gap-4 my-7">

              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />

              <span className="text-sm text-slate-400">
                or
              </span>

              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />

            </div>


            {/* Google */}
            <button
              type="button"
              className="
                w-full
                h-14
                rounded-xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-slate-900
                text-slate-700
                dark:text-slate-200
                font-medium
                hover:bg-slate-50
                dark:hover:bg-slate-800
                transition
              "
            >
              <span className="mr-2 font-bold">
                G
              </span>

              Continue with Google
            </button>


            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">

              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Login
              </Link>

            </p>


            {/* Security */}
            <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
              🔒 Your information is handled securely.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}


/* ================= FEATURE ================= */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">

      <div className="
        w-11
        h-11
        shrink-0
        rounded-full
        bg-white/90
        border
        border-emerald-100
        shadow-sm
        flex
        items-center
        justify-center
        text-emerald-600
        font-bold
      ">
        {icon}
      </div>

      <div>

        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="text-sm text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}
