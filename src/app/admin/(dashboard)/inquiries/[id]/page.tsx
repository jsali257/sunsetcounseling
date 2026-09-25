import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MessageSquareText } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getInquiry } from "@/lib/inquiries/repository";
import { statusLabels } from "@/lib/db/types";
import { formOptions } from "@/content/site";
import { labelFor } from "@/lib/inquiry";
import { formatDateTime, formatRelative } from "@/lib/admin/format";
import { Card, StatusBadge } from "@/components/admin/ui";
import { DeleteInquiryButton, NoteForm, StatusForm } from "@/components/admin/InquiryActions";

export const metadata: Metadata = { title: "Inquiry" };

export default async function InquiryPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  const phoneHref = inquiry.phone ? `tel:${inquiry.phone.replace(/[^\d+]/g, "")}` : undefined;
  const smsHref = inquiry.phone ? `sms:${inquiry.phone.replace(/[^\d+]/g, "")}` : undefined;
  const details: [string, string][] = [
    ["Inquiry type", labelFor(formOptions.reason, inquiry.reason)],
    ["Preferred contact", labelFor(formOptions.contactMethod, inquiry.contactMethod)],
    ["Session format", labelFor(formOptions.format, inquiry.format)],
    ["Preferred language", labelFor(formOptions.language, inquiry.language)],
    ["Received", formatDateTime(inquiry.createdAt)],
  ];

  const timeline = [
    ...inquiry.notes.map((n) => ({ kind: "note" as const, at: n.createdAt, key: n.id, n })),
    ...inquiry.history.map((h, i) => ({ kind: "status" as const, at: h.at, key: `h${i}`, h })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-700 hover:text-ink-950"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All inquiries
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="text-[1.75rem] leading-tight text-ink-900 sm:text-[2rem]">{inquiry.name}</h1>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-600 uppercase">Contact</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {phoneHref && (
                <>
                  <a href={phoneHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-terracotta-700 px-4 text-sm font-medium text-cream-50 hover:bg-terracotta-800">
                    <Phone aria-hidden="true" className="h-4 w-4" /> {inquiry.phone}
                  </a>
                  <a href={smsHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sand-300 bg-white px-4 text-sm text-ink-800 hover:border-ink-500/50">
                    <MessageSquareText aria-hidden="true" className="h-4 w-4" /> Text
                  </a>
                </>
              )}
              {inquiry.email && (
                <a href={`mailto:${inquiry.email}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sand-300 bg-white px-4 text-sm text-ink-800 hover:border-ink-500/50">
                  <Mail aria-hidden="true" className="h-4 w-4" /> {inquiry.email}
                </a>
              )}
            </div>
            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink-600">{label}</dt>
                  <dd className="mt-0.5 text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-600 uppercase">Message</h2>
            {inquiry.message ? (
              <p className="mt-3 leading-relaxed whitespace-pre-wrap text-ink-900">{inquiry.message}</p>
            ) : (
              <p className="mt-3 text-ink-600 italic">No message was included.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-600 uppercase">Notes &amp; activity</h2>
            <div className="mt-4">
              <NoteForm id={id} />
            </div>
            {timeline.length > 0 && (
              <ol className="mt-6 space-y-4 border-t border-sand-200 pt-6">
                {timeline.map((item) =>
                  item.kind === "note" ? (
                    <li key={item.key} className="rounded-xl bg-sand-100/70 p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink-900">{item.n.body}</p>
                      <p className="mt-2 text-xs text-ink-600">
                        {item.n.authorName} ·{" "}
                        <time dateTime={item.at.toISOString()} title={formatDateTime(item.at)}>
                          {formatRelative(item.at)}
                        </time>
                      </p>
                    </li>
                  ) : (
                    <li key={item.key} className="flex gap-2 px-1 text-sm text-ink-600">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-300" />
                      <span>
                        <span className="text-ink-800">{item.h.byName}</span> changed status from{" "}
                        {statusLabels[item.h.from]} to{" "}
                        <span className="text-ink-800">{statusLabels[item.h.to]}</span> ·{" "}
                        <time dateTime={item.at.toISOString()} title={formatDateTime(item.at)}>
                          {formatRelative(item.at)}
                        </time>
                      </span>
                    </li>
                  ),
                )}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 lg:sticky lg:top-8">
            <StatusForm id={id} status={inquiry.status} />
            <p className="mt-4 border-t border-sand-200 pt-4 text-xs leading-relaxed text-ink-600">
              Last updated {formatDateTime(inquiry.updatedAt)}
            </p>
            {user.role === "admin" && (
              <div className="mt-5 border-t border-sand-200 pt-5">
                <DeleteInquiryButton id={id} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
