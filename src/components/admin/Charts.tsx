import type { ReactNode } from "react";
import type { Breakdown } from "@/lib/inquiries/stats";
import { cn } from "@/lib/cn";

/*
 * Single-series magnitude charts in plain HTML/CSS (no chart library).
 * One validated hue (terracotta-500, ≥3:1 on the card surface); values and
 * labels always use text colors, never the bar color.
 */

export function StatTile({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "default" | "attention";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-cream-50 p-5 shadow-[var(--shadow-soft)]",
        tone === "attention" ? "border-terracotta-300" : "border-sand-200",
      )}
    >
      <p className="text-sm text-ink-600">{label}</p>
      <p className="mt-2 font-serif text-[2.25rem] leading-none text-ink-900 tabular-nums">{value}</p>
      {detail && <p className="mt-2 text-xs leading-relaxed text-ink-600">{detail}</p>}
    </div>
  );
}

/** Ranked horizontal bars with the count and share printed beside each. */
export function BreakdownBars({ title, data }: { title: string; data: Breakdown }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="rounded-2xl border border-sand-200 bg-cream-50 p-5 shadow-[var(--shadow-soft)]">
      <h2 className="font-sans text-sm font-semibold text-ink-900">{title}</h2>
      {total === 0 ? (
        <p className="mt-4 text-sm text-ink-600">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((d) => {
            const share = Math.round((d.count / total) * 100);
            return (
              <li key={d.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink-800">{d.label}</span>
                  <span className="text-ink-900 tabular-nums">
                    {d.count} <span className="text-xs text-ink-600">· {share}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-sand-100" aria-hidden="true">
                  <div
                    className="h-2 rounded-full bg-terracotta-500"
                    style={{ width: d.count ? `max(4px, ${(d.count / max) * 100}%)` : 0 }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Monthly column chart. Each column is focusable and shows its value on
 * hover/focus; the busiest and latest months are labeled directly, and the
 * same numbers are available as a table.
 */
export function MonthlyColumns({ data }: { data: { key: string; label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const peakIndex = data.findIndex((d) => d.count === max && max > 0);
  const lastIndex = data.length - 1;
  const ticks = [niceMax, niceMax / 2, 0];

  return (
    <div className="rounded-2xl border border-sand-200 bg-cream-50 p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <h2 className="font-sans text-sm font-semibold text-ink-900">Inquiries per month</h2>
      <p className="text-xs text-ink-600">Last 12 months, Central Time</p>

      <div className="mt-6 flex gap-3">
        {/* y-axis */}
        <div className="flex h-48 flex-col justify-between text-right text-[0.7rem] text-ink-500 tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {t}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* recessive gridlines */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48" aria-hidden="true">
            {ticks.map((t, i) => (
              <div
                key={t}
                className={cn("absolute inset-x-0 border-t", i === ticks.length - 1 ? "border-sand-300" : "border-dashed border-sand-200")}
                style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          <ol className="relative flex h-48 items-end gap-[2px]" aria-label="Inquiries per month">
            {data.map((d, i) => {
              const labeled = i === peakIndex || (i === lastIndex && d.count > 0);
              return (
                <li key={d.key} className="group relative flex h-full flex-1 items-end justify-center">
                  <div
                    tabIndex={0}
                    aria-label={`${d.label}: ${d.count} ${d.count === 1 ? "inquiry" : "inquiries"}`}
                    className="relative flex h-full w-full max-w-10 items-end justify-center rounded-t focus-visible:outline-offset-2"
                  >
                    <div
                      className="w-full rounded-t-[4px] bg-terracotta-500 transition-colors group-hover:bg-terracotta-600 group-focus-within:bg-terracotta-600"
                      style={{ height: d.count ? `max(3px, ${(d.count / niceMax) * 100}%)` : 0 }}
                    />
                    {labeled && (
                      <span
                        aria-hidden="true"
                        className="absolute text-xs font-medium text-ink-900 tabular-nums"
                        style={{ bottom: `calc(${(d.count / niceMax) * 100}% + 4px)` }}
                      >
                        {d.count}
                      </span>
                    )}
                  </div>
                  {/* tooltip */}
                  <div
                    role="presentation"
                    className="pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-cream-50 shadow-lg group-focus-within:block group-hover:block"
                  >
                    {d.label}: <strong className="font-semibold tabular-nums">{d.count}</strong>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* x-axis labels: every other month on small screens */}
          <div className="mt-2 flex gap-[2px] text-center text-[0.7rem] text-ink-600" aria-hidden="true">
            {data.map((d, i) => (
              <span key={d.key} className={cn("flex-1 truncate", i % 2 === 1 && i !== lastIndex && "invisible sm:visible")}>
                {d.label.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer text-ink-700 hover:text-ink-950">Show as table</summary>
        <table className="mt-3 w-full max-w-sm text-left">
          <thead>
            <tr className="border-b border-sand-200 text-xs text-ink-600">
              <th scope="col" className="py-1.5 font-medium">Month</th>
              <th scope="col" className="py-1.5 text-right font-medium">Inquiries</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key} className="border-b border-sand-200/70">
                <td className="py-1.5 text-ink-800">{d.label}</td>
                <td className="py-1.5 text-right text-ink-900 tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
