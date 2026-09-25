import { getSessionUser } from "@/lib/auth/session";
import { collections } from "@/lib/db/mongodb";
import { statusLabels } from "@/lib/db/types";
import { formOptions } from "@/content/site";
import { formatPhone, labelFor } from "@/lib/inquiry";
import { formatDateTime } from "@/lib/admin/format";
import { audit } from "@/lib/audit";

/** Quotes a CSV cell and neutralizes spreadsheet formulas (CSV injection). */
function cell(value: unknown) {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword) return new Response("Unauthorized", { status: 401 });
  if (user.role !== "admin") return new Response("Forbidden", { status: 403 });

  const { inquiries } = await collections();
  const rows = await inquiries.find({}, { projection: { history: 0 } }).sort({ createdAt: -1 }).toArray();

  const header = [
    "Received", "Status", "Type", "Name", "Phone", "Email", "Preferred contact",
    "Format", "Language", "Message", "Notes", "First response",
  ];
  const lines = rows.map((r) =>
    [
      formatDateTime(r.createdAt),
      statusLabels[r.status],
      labelFor(formOptions.reason, r.reason),
      r.name,
      formatPhone(r.phone),
      r.email,
      labelFor(formOptions.contactMethod, r.contactMethod),
      labelFor(formOptions.format, r.format),
      labelFor(formOptions.language, r.language),
      r.message,
      r.notes.map((n) => `${n.authorName}: ${n.body}`).join(" | "),
      r.firstRespondedAt ? formatDateTime(r.firstRespondedAt) : "",
    ]
      .map(cell)
      .join(","),
  );

  await audit(user, `Exported ${rows.length} inquiries to CSV`, { targetType: "export" });

  const date = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens accented characters (e.g. Spanish names) correctly.
  return new Response("﻿" + [header.map(cell).join(","), ...lines].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inquiries-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
