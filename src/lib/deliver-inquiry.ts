import "server-only";
import { formOptions, site } from "@/content/site";
import { labelFor, type Inquiry } from "./inquiry";

/**
 * Notifies the practice about a new appointment inquiry.
 *
 * Configure ONE of the following in the deployment environment:
 *   - RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL on your Resend-verified domain) to send an email via Resend
 *   - CONTACT_WEBHOOK_URL to POST JSON to a form/CRM endpoint
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
    ? [
        `A new ${reason.toLowerCase()} was submitted on the website.`,
        "",
        `Sign in to view it: ${dashboardUrl}`,
      ].join("\n")
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

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, CONTACT_WEBHOOK_URL } = process.env;

  try {
    if (RESEND_API_KEY && CONTACT_TO_EMAIL) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL ?? `${site.shortName} Website <onboarding@resend.dev>`,
          // Comma-separated to notify several people, e.g. "a@x.com, b@x.com".
          to: CONTACT_TO_EMAIL.split(",").map((a) => a.trim()).filter(Boolean),
          // Only reply directly to the visitor when their details are in the email.
          reply_to: dashboardUrl ? undefined : inquiry.email || undefined,
          subject: `New website inquiry — ${reason}`,
          text: summary,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        // Resend explains rejections (e.g. unverified domain); it never echoes the email body.
        console.error(`Resend rejected the notification (${res.status}):`, await res.text().catch(() => ""));
      }
      return res.ok;
    }

    if (CONTACT_WEBHOOK_URL) {
      const payload = dashboardUrl
        ? { event: "inquiry.created", reason: inquiry.reason, dashboardUrl }
        : { ...inquiry, summary };
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok;
    }
  } catch (error) {
    console.error("Inquiry notification failed:", error instanceof Error ? error.message : error);
    return false;
  }

  // No notification channel configured.
  if (process.env.NODE_ENV !== "production") {
    console.info("[dev] Inquiry notification (no email/webhook configured):\n" + summary);
    return true;
  }
  return false;
}
