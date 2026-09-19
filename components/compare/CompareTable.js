"use client";

/**
 * Trend icons and colour classes.
 * Purely directional — no medical diagnosis wording.
 */
const TREND_CONFIG = {
  increased: {
    icon: "▲",
    label: "Increased",
    classes: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
  },
  decreased: {
    icon: "▼",
    label: "Decreased",
    classes: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  },
  unchanged: {
    icon: "◼",
    label: "Unchanged",
    classes: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40",
  },
};

const STATUS_COLOR = {
  normal:   "text-emerald-600 dark:text-emerald-400",
  low:      "text-amber-600   dark:text-amber-400",
  high:     "text-orange-600  dark:text-orange-400",
  critical: "text-red-600     dark:text-red-400",
};

function StatusDot({ status }) {
  if (!status) return null;
  const color = STATUS_COLOR[status] ?? "text-slate-400";
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide ${color}`}>
      {status}
    </span>
  );
}

function DeltaChip({ delta, trend }) {
  if (delta === null) return null;
  const sign = delta > 0 ? "+" : "";
  const { classes } = TREND_CONFIG[trend] ?? TREND_CONFIG.unchanged;
  return (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${classes}`}>
      {sign}{delta}
    </span>
  );
}

/**
 * @param {object} props
 * @param {import("@/types/report").ComparisonRow[]} props.comparison
 * @param {import("@/types/report").Report} props.reportA
 * @param {import("@/types/report").Report} props.reportB
 */
export default function CompareTable({ comparison, reportA, reportB }) {
  if (!comparison || comparison.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-10 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No matching tests found between these two reports.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Tests are matched by name. Make sure both reports contain overlapping test panels.
        </p>
      </div>
    );
  }

  return (
    <div id="compare-table-root" className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800/60">
      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1fr_100px_1fr_1fr] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 gap-2">
        <span>Test</span>
        <span className="text-right">
          {new Date(reportA.reportDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="text-center">Trend</span>
        <span>
          {new Date(reportB.reportDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="text-center">Change</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {comparison.map((row, idx) => {
          const trend = TREND_CONFIG[row.trend] ?? TREND_CONFIG.unchanged;

          return (
            <div
              key={row.testName + idx}
              className="grid grid-cols-[2fr_1fr_100px_1fr_1fr] items-center px-4 py-3.5 gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
            >
              {/* Test name + reference */}
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {row.testName}
                </p>
                {row.referenceRange && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Ref: {row.referenceRange} {row.unit}
                  </p>
                )}
              </div>

              {/* Value A */}
              <div className="text-right">
                <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {row.valueA}
                  {row.unit && <span className="text-xs text-slate-400 ml-0.5">{row.unit}</span>}
                </p>
                <StatusDot status={row.statusA} />
              </div>

              {/* Trend */}
              <div className="flex flex-col items-center gap-0.5">
                <span className={`text-lg font-bold ${trend.classes.split(" ")[0]} ${trend.classes.split(" ")[1]}`}>
                  {trend.icon}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {trend.label}
                </span>
              </div>

              {/* Value B */}
              <div>
                <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {row.valueB}
                  {row.unit && <span className="text-xs text-slate-400 ml-0.5">{row.unit}</span>}
                </p>
                <StatusDot status={row.statusB} />
              </div>

              {/* Delta chip */}
              <div className="flex items-center justify-center">
                <DeltaChip delta={row.delta} trend={row.trend} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          ▲ Increased &nbsp;·&nbsp; ▼ Decreased &nbsp;·&nbsp; ◼ Unchanged &nbsp;·&nbsp;
          Trends are objective numerical changes. Consult your doctor for medical interpretation.
        </p>
      </div>
    </div>
  );
}
