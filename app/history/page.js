import ReportList from "@/components/history/ReportList";

export const metadata = {
  title: "Report History — MediLens",
  description: "View and manage your uploaded medical reports. Select two reports to compare them side-by-side.",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Report History
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-11">
            Your uploaded medical reports — select two to compare trends over time.
          </p>
        </div>

        {/* Report list with filter + selection */}
        <ReportList />

      </div>
    </main>
  );
}
