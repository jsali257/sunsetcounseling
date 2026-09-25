import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getInquiryStats } from "@/lib/inquiries/stats";
import { formatDuration } from "@/lib/admin/format";
import { PageTitle } from "@/components/admin/ui";
import { BreakdownBars, MonthlyColumns, StatTile } from "@/components/admin/Charts";

export const metadata: Metadata = { title: "Stats" };

function trend(current: number, previous: number) {
  if (previous === 0) return current === 0 ? "No change from the prior 30 days" : "Up from 0 in the prior 30 days";
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return `Same as the prior 30 days (${previous})`;
  return `${pct > 0 ? "Up" : "Down"} ${Math.abs(pct)}% from ${previous} in the prior 30 days`;
}

export default async function StatsPage() {
  await requireAdmin();
  const s = await getInquiryStats();

  return (
    <>
      <PageTitle title="Stats" description="An overview of website inquiries and how quickly the team responds." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total inquiries" value={s.total} detail="All time" />
        <StatTile label="Last 30 days" value={s.last30} detail={trend(s.last30, s.prev30)} />
        <StatTile
          label="Awaiting first response"
          value={s.open}
          tone={s.waitingOver48h > 0 ? "attention" : "default"}
          detail={
            s.waitingOver48h > 0 ? (
              <>
                <strong className="font-semibold text-terracotta-800">{s.waitingOver48h} waiting over 48 hours.</strong>{" "}
                <Link href="/admin?status=new" className="underline underline-offset-2">Review</Link>
              </>
            ) : (
              "None waiting over 48 hours"
            )
          }
        />
        <StatTile
          label="Median time to first response"
          value={s.medianResponseMs == null ? "—" : formatDuration(s.medianResponseMs)}
          detail={
            s.respondedCount90
              ? `Across ${s.respondedCount90} ${s.respondedCount90 === 1 ? "inquiry" : "inquiries"} in the last 90 days`
              : "Appears once inquiries are marked contacted"
          }
        />
      </div>

      <div className="mt-6">
        <MonthlyColumns data={s.monthly} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BreakdownBars title="By status" data={s.byStatus} />
        <BreakdownBars title="By inquiry type" data={s.byReason} />
        <BreakdownBars title="Preferred language" data={s.byLanguage} />
        <BreakdownBars title="In-person vs. telehealth" data={s.byFormat} />
        <BreakdownBars title="Preferred contact method" data={s.byContactMethod} />
        <BreakdownBars title="Status updates by team member (30 days)" data={s.responders} />
      </div>
    </>
  );
}
