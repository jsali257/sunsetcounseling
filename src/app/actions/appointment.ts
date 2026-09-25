"use server";

import { site } from "@/content/site";
import { deliverInquiry } from "@/lib/deliver-inquiry";
import { isDatabaseConfigured } from "@/lib/db/mongodb";
import { createInquiry } from "@/lib/inquiries/repository";
import {
  inquiryFields,
  validateInquiry,
  type Inquiry,
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

  const inquiry: Inquiry = {
    reason: values.reason,
    name: values.name,
    phone: values.phone,
    email: values.email,
    contactMethod: values.contactMethod,
    format: values.format,
    language: values.language,
    message: values.message,
  };

  const failure: InquiryState = {
    status: "error",
    message: `We couldn’t send your request right now. Please call the office at ${site.phone.display}.`,
    values,
  };

  if (isDatabaseConfigured()) {
    // The database is the record of truth; the email/webhook is only an alert.
    let id;
    try {
      id = await createInquiry(inquiry);
    } catch (error) {
      console.error("Saving inquiry failed:", error instanceof Error ? error.message : error);
      return failure;
    }
    const notified = await deliverInquiry(inquiry, {
      dashboardUrl: new URL(`/admin/inquiries/${id}`, site.url).toString(),
    });
    if (!notified) console.warn(`Inquiry ${id} saved, but the notification was not sent.`);
    return { status: "success" };
  }

  return (await deliverInquiry(inquiry)) ? { status: "success" } : failure;
}
