import type { Metadata } from "next";
import Link from "next/link";
import { Search, Download, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { countByStatus, listInquiries } from "@/lib/inquiries/repository";
import { inquiryStatuses, statusLabels, type InquiryStatus } from "@/lib/db/types";
import { formOptions } from "@/content/site";
import { formatPhone, labelFor } from "@/lib/inquiry";
import { formatDateTime, formatRelative } from "@/lib/admin/format";
import { Card, Notice, PageTitle, StatusBadge, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Inquiries" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function InquiriesPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireUser();
  const params = await searchParams;
  const status = inquiryStatuses.find((s) => s === first(params.status));
  const reason = formOptions.reason.find((r) => r.value === first(params.reason))?.value;
  const q = first(params.q)?.slice(0, 100) ?? "";
  const page = Number(first(params.page)) || 1;

  const [counts, result] = await Promise.all([
    countByStatus(),
    listInquiries({ status, reason, q, page }),
  ]);

  const href = (overrides: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { status, reason, q: q || undefined, page: undefined, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "") sp.set(k, String(v));
    const s = sp.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const tabs: { key: InquiryStatus | undefined; label: string; count: number }[] = [
    { key: undefined, label: "All", count: counts.all },
    ...inquiryStatuses.map((s) => ({ key: s, label: statusLabels[s], count: counts[s] })),
  ];

  return (
    <>
      <PageTitle
        title="Inquiries"
        description="Appointment requests submitted through the website."
        actions={
          user.role === "admin" && counts.all > 0 ? (
            <a
              href="/admin/export"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sand-300 bg-cream-50 px-3.5 text-sm text-ink-800 hover:bg-white"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Export CSV
            </a>
          ) : null
        }
      />

      {params.deleted && <div className="mb-6"><Notice tone="success">The inquiry was deleted.</Notice></div>}
      {params.denied && (
        <div className="mb-6">
          <Notice tone="error">That page is only available to administrators.</Notice>
        </div>
      )}

      <nav aria-label="Filter by status" className="mb-4 overflow-x-auto [scrollbar-width:none]">
        <ul className="flex gap-1.5">
          {tabs.map((tab) => {
            const active = tab.key === status;
            return (
              <li key={tab.label} className="shrink-0">
                <Link
                  href={href({ status: tab.key })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors",
                    active
                      ? "bg-ink-900 text-cream-50"
                      : "border border-sand-300 bg-cream-50 text-ink-700 hover:bg-white",
                  )}
                >
                  {tab.label}
                  <span className={cn("text-xs", active ? "text-cream-50/75" : "text-ink-500")}>{tab.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form role="search" className="mb-6 flex flex-col gap-2 sm:flex-row" action="/admin">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <label htmlFor="q" className="sr-only">
            Search by name, email, or phone
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by name, email, or phone"
            className={cn(inputClass, "pl-10")}
          />
        </div>
        <label htmlFor="reason" className="sr-only">
          Inquiry type
        </label>
        <select id="reason" name="reason" defaultValue={reason ?? ""} className={cn(inputClass, "sm:w-60")}>
          <option value="">All inquiry types</option>
          {formOptions.reason.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-ink-900 px-5 text-sm font-medium text-cream-50 hover:bg-ink-950"
        >
          Search
        </button>
      </form>

      {result.items.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-16 text-center">
          <Inbox aria-hidden="true" className="h-10 w-10 text-ink-500" strokeWidth={1.4} />
          <p className="mt-4 font-serif text-xl text-ink-900">
            {q || status || reason ? "No inquiries match these filters" : "No inquiries yet"}
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-ink-600">
            {q || status || reason
              ? "Try a different search or clear the filters."
              : "New appointment requests from the website will appear here."}
          </p>
          {(q || status || reason) && (
            <Link href="/admin" className="mt-5 text-sm text-terracotta-700 underline underline-offset-4">
              Clear filters
            </Link>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Inquiries, newest first</caption>
            <thead className="hidden border-b border-sand-200 bg-sand-100/60 text-xs tracking-wide text-ink-600 uppercase md:table-header-group">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-5 py-3 font-medium">Type</th>
                <th scope="col" className="px-5 py-3 font-medium">Preferences</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {result.items.map((item) => (
                <tr
                  key={String(item._id)}
                  className={cn(
                    "relative grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-white md:table-row md:p-0",
                    item.status === "new" && "bg-peach-100/30",
                  )}
                >
                  <td className="md:px-5 md:py-4">
                    <Link
                      href={`/admin/inquiries/${item._id}`}
                      className="font-medium text-ink-900 after:absolute after:inset-0 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-ink-600">{item.phone ? formatPhone(item.phone) : item.email}</p>
                  </td>
                  <td className="col-start-1 text-ink-700 md:px-5 md:py-4">
                    {labelFor(formOptions.reason, item.reason)}
                  </td>
                  <td className="col-start-1 text-ink-600 md:px-5 md:py-4">
                    {labelFor(formOptions.format, item.format)} · {labelFor(formOptions.language, item.language)}
                  </td>
                  <td className="col-start-2 row-start-1 md:px-5 md:py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="col-start-2 row-start-2 text-right text-ink-600 md:px-5 md:py-4 md:text-left">
                    <time dateTime={item.createdAt.toISOString()} title={formatDateTime(item.createdAt)}>
                      {formatRelative(item.createdAt)}
                    </time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {result.pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm text-ink-700">
          <p>
            Page {result.page} of {result.pageCount} · {result.total} inquiries
          </p>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Link
                href={href({ page: result.page - 1 })}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-sand-300 bg-cream-50 px-3 hover:bg-white"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" /> Previous
              </Link>
            )}
            {result.page < result.pageCount && (
              <Link
                href={href({ page: result.page + 1 })}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-sand-300 bg-cream-50 px-3 hover:bg-white"
              >
                Next <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
