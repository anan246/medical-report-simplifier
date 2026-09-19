import { Suspense } from "react";
import CompareView from "@/components/compare/CompareView";

export const metadata = {
  title: "Compare Reports — MediLens",
  description: "Side-by-side objective comparison of two medical reports with trend indicators.",
};

/**
 * /compare?a=<reportId>&b=<reportId>
 *
 * Next.js App Router: searchParams is provided as a prop to Page server components.
 * We pass idA/idB down to the CompareView client component to avoid Suspense issues.
 */
export default async function ComparePage({ searchParams }) {
  // In Next.js 15+, searchParams is a Promise that must be awaited
  const params = await searchParams;
  const idA = params?.a ?? null;
  const idB = params?.b ?? null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 space-y-3 h-32" />
                ))}
              </div>
            </div>
          }
        >
          <CompareView idA={idA} idB={idB} />
        </Suspense>
      </div>
    </main>
  );
}
