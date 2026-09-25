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

/** Validates raw form values. Shared by the server action (authoritative). */
export function validateInquiry(values: Record<InquiryField, string>) {
  const errors: Partial<Record<InquiryField, string>> = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > 100) errors.name = "Please use 100 characters or fewer.";

  if (!allowed(formOptions.contactMethod, values.contactMethod)) {
    errors.contactMethod = "Please choose how you would like to be contacted.";
  }

  if (values.phone && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    errors.phone = "Please enter a valid phone number, including area code.";
  } else if (
    !values.phone &&
    (values.contactMethod === "phone" || values.contactMethod === "text")
  ) {
    errors.phone = "Please enter a phone number so we can reach you.";
  }

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  } else if (!values.email && values.contactMethod === "email") {
    errors.email = "Please enter an email address so we can reach you.";
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
