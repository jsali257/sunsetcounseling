import type { Metadata } from "next";
import { BellRing, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import { MAX_RECIPIENTS, envRecipients, getSavedRecipients } from "@/lib/notifications";
import { isResendConfigured } from "@/lib/email/resend";
import { formatDate } from "@/lib/admin/format";
import { Card, Notice, PageTitle } from "@/components/admin/ui";
import { AddRecipientForm, RecipientActions } from "@/components/admin/NotificationForms";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  await requireAdmin();
  const recipients = await getSavedRecipients();
  const fallback = envRecipients();
  const emailReady = isResendConfigured();

  return (
    <>
      <PageTitle
        title="Notifications"
        description="Choose who gets an email when someone submits the appointment request form."
      />

      {!emailReady && (
        <div className="mb-6">
          <Notice tone="error">
            Email isn’t configured, so alerts can’t be sent. Add <code>RESEND_API_KEY</code> and{" "}
            <code>CONTACT_FROM_EMAIL</code> in the hosting environment, then redeploy.
          </Notice>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-sand-200 px-5 py-4">
            <BellRing aria-hidden="true" className="h-4 w-4 text-terracotta-700" />
            <h2 className="font-sans text-sm font-semibold text-ink-900">
              New-inquiry alert recipients{" "}
              <span className="font-normal text-ink-600">
                ({recipients.length}/{MAX_RECIPIENTS})
              </span>
            </h2>
          </div>

          {recipients.length === 0 ? (
            <div className="p-5">
              {fallback.length ? (
                <Notice tone="info">
                  No recipients added here yet, so alerts currently go to the address set in the
                  hosting environment (<code>CONTACT_TO_EMAIL</code>):{" "}
                  <strong className="font-semibold">{fallback.join(", ")}</strong>. Once you add
                  someone below, this list is used instead.
                </Notice>
              ) : (
                <Notice tone="error">
                  No one receives new-inquiry alerts yet. Add at least one recipient below.
                  Inquiries are still saved in the dashboard either way.
                </Notice>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-sand-200">
              {recipients.map((r) => (
                <li key={r.email} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium break-all text-ink-900">{r.name || r.email}</p>
                    {r.name && <p className="text-sm break-all text-ink-600">{r.email}</p>}
                    <p className="mt-1 text-xs text-ink-600">
                      Added by {r.addedByName} on {formatDate(r.addedAt)}
                    </p>
                  </div>
                  <RecipientActions email={r.email} label={r.name || r.email} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-5 text-xl text-ink-900">Add a recipient</h2>
            <AddRecipientForm />
          </Card>

          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-900">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-sage-700" />
              What the alert contains
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-700">
              <li>The inquiry type, the time it was received, and a link to open it in this dashboard.</li>
              <li>
                <strong className="font-semibold">Never</strong> the person’s name, phone, email, or
                message. Recipients need a dashboard login to see those.
              </li>
              <li>Each recipient gets their own copy and can’t see who else receives it.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
