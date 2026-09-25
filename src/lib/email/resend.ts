import "server-only";
import { site } from "@/content/site";

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Sends one email per recipient through Resend's batch endpoint, so recipients
 * never see each other's addresses. Returns an error message, or null on success.
 */
export async function sendEmails(emails: OutgoingEmail[]): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return "RESEND_API_KEY is not configured.";
  if (emails.length === 0) return "There are no recipients.";

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() || `${site.shortName} Website <onboarding@resend.dev>`;

  try {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(
        emails.map((e) => ({
          from,
          to: [e.to],
          reply_to: e.replyTo,
          subject: e.subject,
          html: e.html,
          text: e.text,
        })),
      ),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return null;
    // Resend explains rejections (e.g. invalid sender, unverified domain); it never echoes email bodies.
    const detail = await res.text().catch(() => "");
    console.error(`Resend rejected the email (${res.status}):`, detail);
    try {
      return (JSON.parse(detail) as { message?: string }).message ?? `Resend error ${res.status}`;
    } catch {
      return `Resend error ${res.status}`;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Email send failed:", message);
    return "Couldn’t reach the email service. Please try again.";
  }
}
