import "server-only";
import { collections } from "@/lib/db/mongodb";
import { inquiryStatuses, statusLabels } from "@/lib/db/types";
import { formOptions } from "@/content/site";
import { TIME_ZONE } from "@/lib/admin/format";

export type Breakdown = { label: string; count: number }[];

const DAY = 86_400_000;

function median(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Last `n` calendar months (Central Time) as "YYYY-MM" keys, oldest first. */
function monthKeys(n: number, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit" })
    .formatToParts(now);
  let year = Number(parts.find((p) => p.type === "year")!.value);
  let month = Number(parts.find((p) => p.type === "month")!.value);
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    keys.unshift(`${year}-${String(month).padStart(2, "0")}`);
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return keys;
}

export async function getInquiryStats() {
  const { inquiries } = await collections();
  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * DAY);
  const d60 = new Date(now.getTime() - 60 * DAY);
  const d90 = new Date(now.getTime() - 90 * DAY);
  const d2 = new Date(now.getTime() - 2 * DAY);
  const months = monthKeys(12, now);

  type FacetRow = { _id: string; n: number };
  const [facets] = await inquiries
    .aggregate<{
      total: { n: number }[];
      last30: { n: number }[];
      prev30: { n: number }[];
      waiting: { n: number }[];
      status: FacetRow[];
      reason: FacetRow[];
      language: FacetRow[];
      format: FacetRow[];
      contactMethod: FacetRow[];
      monthly: FacetRow[];
      responders: FacetRow[];
    }>([
      {
        $facet: {
          total: [{ $count: "n" }],
          last30: [{ $match: { createdAt: { $gte: d30 } } }, { $count: "n" }],
          prev30: [{ $match: { createdAt: { $gte: d60, $lt: d30 } } }, { $count: "n" }],
          waiting: [{ $match: { status: "new", createdAt: { $lt: d2 } } }, { $count: "n" }],
          status: [{ $group: { _id: "$status", n: { $sum: 1 } } }],
          reason: [{ $group: { _id: "$reason", n: { $sum: 1 } } }],
          language: [{ $group: { _id: "$language", n: { $sum: 1 } } }],
          format: [{ $group: { _id: "$format", n: { $sum: 1 } } }],
          contactMethod: [{ $group: { _id: "$contactMethod", n: { $sum: 1 } } }],
          monthly: [
            { $match: { createdAt: { $gte: new Date(now.getTime() - 400 * DAY) } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: TIME_ZONE } },
                n: { $sum: 1 },
              },
            },
          ],
          responders: [
            { $unwind: "$history" },
            { $match: { "history.at": { $gte: d30 } } },
            { $group: { _id: "$history.byName", n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            { $limit: 8 },
          ],
        },
      },
    ])
    .toArray();

  const responseTimes = await inquiries
    .find(
      { firstRespondedAt: { $exists: true }, createdAt: { $gte: d90 } },
      { projection: { createdAt: 1, firstRespondedAt: 1 } },
    )
    .toArray();

  const count = (rows: { n: number }[]) => rows[0]?.n ?? 0;
  const toMap = (rows: FacetRow[]) => new Map(rows.map((r) => [r._id, r.n]));

  /** Keeps every known option (even at zero) in the form's order. */
  const fromOptions = (rows: FacetRow[], options: readonly { value: string; label: string }[]): Breakdown => {
    const map = toMap(rows);
    return options.map((o) => ({ label: o.label, count: map.get(o.value) ?? 0 }));
  };

  const monthlyMap = toMap(facets.monthly);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

  return {
    total: count(facets.total),
    last30: count(facets.last30),
    prev30: count(facets.prev30),
    waitingOver48h: count(facets.waiting),
    open: toMap(facets.status).get("new") ?? 0,
    medianResponseMs: median(
      responseTimes.map((r) => r.firstRespondedAt!.getTime() - r.createdAt.getTime()),
    ),
    respondedCount90: responseTimes.length,
    monthly: months.map((key) => {
      const [y, m] = key.split("-").map(Number);
      return {
        key,
        label: monthLabel.format(new Date(Date.UTC(y, m - 1, 15))),
        count: monthlyMap.get(key) ?? 0,
      };
    }),
    byStatus: inquiryStatuses.map((s) => ({ label: statusLabels[s], count: toMap(facets.status).get(s) ?? 0 })),
    byReason: fromOptions(facets.reason, formOptions.reason),
    byLanguage: fromOptions(facets.language, formOptions.language),
    byFormat: fromOptions(facets.format, formOptions.format),
    byContactMethod: fromOptions(facets.contactMethod, formOptions.contactMethod),
    responders: facets.responders.map((r) => ({ label: r._id, count: r.n })),
  };
}
