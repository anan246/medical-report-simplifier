import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Welcome back 👋
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Your Health Dashboard
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Understand your medical reports in simple language.
          </p>
        </div>


        {/* Upload Card */}
        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Upload a medical report
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Upload a PDF or image and let MediLens simplify it for you.
              </p>

            </div>

            <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">
              Upload Report
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
