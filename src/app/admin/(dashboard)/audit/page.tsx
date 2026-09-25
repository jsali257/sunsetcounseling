import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { collections } from "@/lib/db/mongodb";
import { formatDateTime } from "@/lib/admin/format";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Audit log" };

const LIMIT = 300;

export default async function AuditPage() {
  await requireAdmin();
  const { audit } = await collections();
  const entries = await audit.find({}).sort({ at: -1 }).limit(LIMIT).toArray();

  return (
    <>
      <PageTitle
        title="Audit log"
        description={`Sign-ins and changes made in the dashboard. Showing the latest ${LIMIT}.`}
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100/60 text-xs tracking-wide text-ink-600 uppercase">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">When</th>
              <th scope="col" className="px-5 py-3 font-medium">Who</th>
              <th scope="col" className="px-5 py-3 font-medium">What</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-ink-600">No activity yet.</td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={String(e._id)}>
                <td className="px-5 py-3 whitespace-nowrap text-ink-600">{formatDateTime(e.at)}</td>
                <td className="px-5 py-3 text-ink-900">{e.actorName}</td>
                <td className="px-5 py-3 text-ink-800">
                  {e.action}
                  {e.targetType === "inquiry" && e.targetId && (
                    <>
                      {" · "}
                      <Link href={`/admin/inquiries/${e.targetId}`} className="text-terracotta-700 underline underline-offset-2">
                        view
                      </Link>
                    </>
                  )}
                  {e.detail && <span className="text-ink-600"> · {e.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
