import { formOptions } from "@/content/site";

export const inquiryFields = [
  "reason",
  "name",
  "phone",
  "email",
  "contactMethod",
  "format",
  "language",
  "message",
  "acknowledgement",
] as const;

export type InquiryField = (typeof inquiryFields)[number];

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<InquiryField, string>>;
  values?: Partial<Record<InquiryField, string>>;
};

export type Inquiry = {
  reason: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  format: string;
  language: string;
  message: string;
};

export const MESSAGE_MAX = 1000;

const allowed = (list: readonly { value: string }[], value: string) =>
  list.some((o) => o.value === value);

export function labelFor(list: readonly { value: string; label: string }[], value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------
// Field rules — shared by the contact form (instant feedback) and the server
// action (authoritative), so both always agree.
// ---------------------------------------------------------------------------

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please enter your name.";
  if (v.length < 2) return "Please enter your full name.";
  if (v.length > 100) return "Please use 100 characters or fewer.";
  if (!/\p{L}/u.test(v)) return "Please enter a name using letters.";
  if (/https?:|www\.|@/i.test(v)) return "Please enter just your name.";
  return null;
}

const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export function validateEmail(value: string, required: boolean): string | null {
  const v = value.trim();
  if (!v) return required ? "Please enter an email address so we can reach you." : null;
  if (/\s/.test(v)) return "Email addresses can’t contain spaces.";
  if (!v.includes("@")) return "Please include an “@” in the email address.";
  if (v.length > 254 || v.split("@")[0].length > 64 || !EMAIL_PATTERN.test(v)) {
    return "Please enter a valid email address, like name@example.com.";
  }
  return null;
}

export function validatePhone(value: string, required: boolean): string | null {
  const v = value.trim();
  if (!v) return required ? "Please enter a phone number so we can reach you." : null;
  if (/[A-Za-z]/.test(v)) return "Please use numbers only, like 956-601-8486.";
  const digits = v.replace(/\D/g, "");
  // International numbers with a country code, e.g. +52 …
  if (v.startsWith("+") && !v.startsWith("+1")) {
    return digits.length >= 8 && digits.length <= 15
      ? null
      : "Please enter a valid international number, including the country code.";
  }
  const us = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (us.length !== 10) return "Please enter a 10-digit phone number, like 956-601-8486.";
  // US area codes and exchanges never start with 0 or 1.
  if (/^[01]/.test(us) || /^[01]/.test(us.slice(3))) {
    return "That doesn’t look like a valid phone number. Please check the area code.";
  }
  return null;
}

const COMMON_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "icloud.com",
  "aol.com", "msn.com", "comcast.net", "att.net", "sbcglobal.net", "yahoo.com.mx",
  "hotmail.com.mx", "prodigy.net.mx",
];

/** Edit distance where swapped neighbors ("gmial" → "gmail") count as one typo. */
function editDistance(a: string, b: string) {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
}

/** Suggests a fix for a likely typo in a common email domain, e.g. "gmial.com" → "gmail.com". */
export function suggestEmail(value: string): string | null {
  const v = value.trim();
  const at = v.lastIndexOf("@");
  if (at < 1) return null;
  const domain = v.slice(at + 1).toLowerCase();
  if (domain.length < 4 || COMMON_EMAIL_DOMAINS.includes(domain)) return null;
  let best: { domain: string; d: number } | null = null;
  for (const candidate of COMMON_EMAIL_DOMAINS) {
    const d = editDistance(domain, candidate);
    if (d > 0 && d <= (candidate.length > 8 ? 2 : 1) && (!best || d < best.d)) {
      best = { domain: candidate, d };
    }
  }
  return best ? `${v.slice(0, at)}@${best.domain}` : null;
}

/** Validates raw form values. Shared by the server action (authoritative). */
export function validateInquiry(values: Record<InquiryField, string>) {
  const errors: Partial<Record<InquiryField, string>> = {};
  const set = (field: InquiryField, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("name", validateName(values.name));

  if (!allowed(formOptions.contactMethod, values.contactMethod)) {
    errors.contactMethod = "Please choose how you would like to be contacted.";
  }
  const wantsPhone = values.contactMethod === "phone" || values.contactMethod === "text";
  set("phone", validatePhone(values.phone, wantsPhone));
  set("email", validateEmail(values.email, values.contactMethod === "email"));
  if (!values.phone.trim() && !values.email.trim() && !errors.phone && !errors.email) {
    errors.phone = "Please enter a phone number or email address so we can reach you.";
  }

  if (!allowed(formOptions.format, values.format)) {
    errors.format = "Please choose in-person, telehealth, or not sure yet.";
  }
  if (!allowed(formOptions.language, values.language)) {
    errors.language = "Please choose a preferred language.";
  }
  if (!allowed(formOptions.reason, values.reason)) {
    errors.reason = "Please choose a reason for your inquiry.";
  }
  if (values.message.length > MESSAGE_MAX) {
    errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
  }
  if (values.acknowledgement !== "on") {
    errors.acknowledgement = "Please confirm you have read this notice.";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Phone formatting
// ---------------------------------------------------------------------------

/** US/NANP digits: strips a leading country code "1" from 11-digit numbers. */
function usDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

/**
 * Formats a phone number as 956-601-8486. Numbers that aren't 10 digits
 * (e.g. international numbers with a country code) are returned trimmed, as entered.
 */
export function formatPhone(value: string) {
  const digits = usDigits(value);
  if (digits.length !== 10) return value.trim();
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Progressive formatting while typing: "956" → "956-5" → "956-601-8486". */
export function formatPhoneAsTyped(value: string) {
  // Leave international numbers (e.g. "+52 …") alone.
  if (value.trim().startsWith("+") && !value.trim().startsWith("+1")) return value;
  // US area codes never start with 1, so a leading 1 is always the country code.
  const d = value.replace(/\D/g, "").replace(/^1/, "");
  if (d.length > 10) return value;
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
}
