import "server-only";
import { formOptions } from "@/content/site";
import { labelFor, type Inquiry } from "./inquiry";
import { buildInquiryEmail } from "./email/inquiry-email";
import { isResendConfigured, sendEmails } from "./email/resend";
import { getAlertRecipients } from "./notifications";

/**
 * Notifies the practice about a new appointment inquiry.
 *
 * Email (Resend): RESEND_API_KEY + CONTACT_FROM_EMAIL on your Resend-verified domain.
 * Recipients are managed on the dashboard's Notifications page, falling back to
 * CONTACT_TO_EMAIL. Each recipient receives their own copy.
 * Webhook: CONTACT_WEBHOOK_URL receives a JSON POST (used when email isn't configured).
 *
 * When the inquiry is stored in the database (`dashboardUrl` is passed), the
 * notification is privacy-minimal: it contains only the inquiry type and a link
 * to the dashboard, never the person's name, contact details, or message.
 * Without a database, the full inquiry is sent so it isn't lost.
 *
 * Before choosing a provider, the practice should confirm whether it will sign a
 * Business Associate Agreement if one is required. Do not describe the form as
 * HIPAA-compliant unless the deployed systems and agreements support that claim.
 *
 * Returns true when the notification was handed off successfully.
 */
export async function deliverInquiry(
  inquiry: Inquiry,
  { dashboardUrl }: { dashboardUrl?: string } = {},
): Promise<boolean> {
  const reason = labelFor(formOptions.reason, inquiry.reason);
  const summary = dashboardUrl
    ? `A new ${reason.toLowerCase()} was submitted on the website: ${dashboardUrl}`
    : [
        `Reason: ${reason}`,
        `Name: ${inquiry.name}`,
        `Phone: ${inquiry.phone || "—"}`,
        `Email: ${inquiry.email || "—"}`,
        `Preferred contact: ${labelFor(formOptions.contactMethod, inquiry.contactMethod)}`,
        `Session format: ${labelFor(formOptions.format, inquiry.format)}`,
        `Preferred language: ${labelFor(formOptions.language, inquiry.language)}`,
        "",
        "Message:",
        inquiry.message || "—",
      ].join("\n");

  if (isResendConfigured()) {
    const { emails: recipients } = await getAlertRecipients();
    if (recipients.length) {
      const email = buildInquiryEmail(inquiry, { dashboardUrl });
      const configuredReplyTo = process.env.CONTACT_REPLY_TO?.trim();
      const error = await sendEmails(
        recipients.map((to) => ({
          to,
          ...email,
          // Replies go to a real, monitored mailbox. When the visitor's details are
          // in the email (no database), replying goes straight to the visitor.
          replyTo: dashboardUrl
            ? configuredReplyTo || recipients[0]
            : inquiry.email || configuredReplyTo || recipients[0],
        })),
      );
      return error === null;
    }
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const payload = dashboardUrl
        ? { event: "inquiry.created", reason: inquiry.reason, dashboardUrl }
        : { ...inquiry, summary };
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok;
    } catch (error) {
      console.error("Inquiry webhook failed:", error instanceof Error ? error.message : error);
      return false;
    }
  }

  // No notification channel configured.
  if (process.env.NODE_ENV !== "production") {
    console.info("[dev] Inquiry notification (no email/webhook configured):\n" + summary);
    return true;
  }
  return false;
}
