import "server-only";
import { formOptions, site } from "@/content/site";
import { labelFor, type Inquiry } from "./inquiry";

/**
 * Delivers an appointment inquiry to the practice.
 *
 * Configure ONE of the following in the deployment environment:
 *   - RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL) to send an email via Resend
 *   - CONTACT_WEBHOOK_URL to POST the inquiry as JSON to a form/CRM endpoint
 *
 * Before choosing a provider, the practice should confirm whether it will sign a
 * Business Associate Agreement if one is required. Do not describe the form as
 * HIPAA-compliant unless the deployed systems and agreements support that claim.
 *
 * Returns true when the inquiry was handed off successfully.
 */
export async function deliverInquiry(inquiry: Inquiry): Promise<boolean> {
  const summary = [
    `Reason: ${labelFor(formOptions.reason, inquiry.reason)}`,
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
          to: [CONTACT_TO_EMAIL],
          reply_to: inquiry.email || undefined,
          subject: `New website inquiry — ${labelFor(formOptions.reason, inquiry.reason)}`,
          text: summary,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok;
    }

    if (CONTACT_WEBHOOK_URL) {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inquiry, summary, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok;
    }
  } catch (error) {
    console.error("Inquiry delivery failed:", error instanceof Error ? error.message : error);
    return false;
  }

  // No delivery configured.
  if (process.env.NODE_ENV !== "production") {
    console.info("[dev] Appointment inquiry received (no delivery configured):\n" + summary);
    return true;
  }
  console.error("Inquiry delivery is not configured. Set RESEND_API_KEY/CONTACT_TO_EMAIL or CONTACT_WEBHOOK_URL.");
  return false;
}
