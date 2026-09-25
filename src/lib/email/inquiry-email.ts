import "server-only";
import { formOptions, site } from "@/content/site";
import { labelFor, type Inquiry } from "@/lib/inquiry";
import { formatDateTime } from "@/lib/admin/format";

/**
 * The staff notification for a new website inquiry, as matching HTML and
 * plain-text versions. Sending both, with a clear explanation of why the
 * email was sent, helps it reach the inbox rather than junk.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const colors = {
  page: "#faf4ec",
  card: "#ffffff",
  ink: "#2d231e",
  muted: "#5f5048",
  line: "#ecdccb",
  button: "#8b452f",
};

type Row = [label: string, value: string];

function htmlLayout({
  heading,
  intro,
  rows,
  button,
  note,
}: {
  heading: string;
  intro: string;
  rows: Row[];
  button?: { href: string; label: string };
  note?: string;
}) {
  const domain = new URL(site.url).hostname.replace(/^www\./, "");
  const rowHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${colors.line};color:${colors.muted};font-size:14px;width:40%;vertical-align:top;">${esc(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${colors.line};color:${colors.ink};font-size:15px;vertical-align:top;white-space:pre-wrap;">${esc(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.page};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Arial,Helvetica,sans-serif;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${esc(new URL("/brand/logo-full.png", site.url).toString())}" width="120" alt="${esc(site.name)}" style="display:block;border:0;width:120px;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="background:${colors.card};border:1px solid ${colors.line};border-radius:12px;padding:28px;">
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:24px;color:${colors.ink};">${esc(heading)}</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${colors.muted};">${esc(intro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
              </table>
              ${
                button
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr><td style="border-radius:999px;background:${colors.button};">
                  <a href="${esc(button.href)}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;border-radius:999px;">${esc(button.label)}</a>
                </td></tr>
              </table>`
                  : ""
              }
              ${note ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${colors.muted};">${esc(note)}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:${colors.muted};text-align:center;">
              Sent automatically to staff by the ${esc(site.name)} website (${esc(domain)}).<br>
              ${esc(`${site.address.street} ${site.address.city}, ${site.address.state} ${site.address.zip}`)} · ${esc(site.phone.display)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function textLayout({ heading, intro, rows, button, note }: Parameters<typeof htmlLayout>[0]) {
  return [
    heading,
    "",
    intro,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(button ? ["", `${button.label}: ${button.href}`] : []),
    ...(note ? ["", note] : []),
    "",
    "—",
    `Sent automatically to staff by the ${site.name} website.`,
    `${site.address.street} ${site.address.city}, ${site.address.state} ${site.address.zip} · ${site.phone.display}`,
  ].join("\n");
}

export function buildInquiryEmail(inquiry: Inquiry, { dashboardUrl }: { dashboardUrl?: string }) {
  const reason = labelFor(formOptions.reason, inquiry.reason);
  const received = `${formatDateTime(new Date())} (Central Time)`;

  const content = dashboardUrl
    ? {
        heading: "New website inquiry",
        intro: "Someone submitted the appointment request form on the practice website.",
        rows: [
          ["Inquiry type", reason],
          ["Received", received],
        ] satisfies Row[],
        button: { href: dashboardUrl, label: "Open in the staff dashboard" },
        note: "For privacy, this email does not include the person’s name, contact details, or message. They are available in the staff dashboard.",
      }
    : {
        heading: "New website inquiry",
        intro: "Someone submitted the appointment request form on the practice website.",
        rows: [
          ["Inquiry type", reason],
          ["Name", inquiry.name],
          ["Phone", inquiry.phone || "—"],
          ["Email", inquiry.email || "—"],
          ["Preferred contact", labelFor(formOptions.contactMethod, inquiry.contactMethod)],
          ["Session format", labelFor(formOptions.format, inquiry.format)],
          ["Preferred language", labelFor(formOptions.language, inquiry.language)],
          ["Message", inquiry.message || "—"],
          ["Received", received],
        ] satisfies Row[],
      };

  return {
    subject: `New website inquiry: ${reason}`,
    html: htmlLayout(content),
    text: textLayout(content),
  };
}
