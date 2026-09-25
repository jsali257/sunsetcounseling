"use server";

import { site } from "@/content/site";
import { deliverInquiry } from "@/lib/deliver-inquiry";
import {
  inquiryFields,
  validateInquiry,
  type InquiryField,
  type InquiryState,
} from "@/lib/inquiry";

export async function submitAppointmentRequest(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success" };
  }

  const values = Object.fromEntries(
    inquiryFields.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as Record<InquiryField, string>;

  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      errors,
      values,
    };
  }

  const delivered = await deliverInquiry({
    reason: values.reason,
    name: values.name,
    phone: values.phone,
    email: values.email,
    contactMethod: values.contactMethod,
    format: values.format,
    language: values.language,
    message: values.message,
  });

  if (!delivered) {
    return {
      status: "error",
      message: `We couldn’t send your request right now. Please call the office at ${site.phone.display}.`,
      values,
    };
  }

  return { status: "success" };
}
