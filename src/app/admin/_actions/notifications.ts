"use server";

import { revalidatePath } from "next/cache";
import { collections } from "@/lib/db/mongodb";
import { getActionUser } from "@/lib/auth/dal";
import { audit } from "@/lib/audit";
import { MAX_RECIPIENTS, getSavedRecipients } from "@/lib/notifications";
import { buildInquiryEmail } from "@/lib/email/inquiry-email";
import { isResendConfigured, sendEmails } from "@/lib/email/resend";
import { site } from "@/content/site";
import type { ActionState } from "@/lib/admin/form-state";
import { EMAIL_RE } from "@/lib/admin/validation";

const adminOnly: ActionState = { error: "Only administrators can manage notifications." };

export async function addRecipient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;

  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  if (!EMAIL_RE.test(email)) return { fieldErrors: { email: "Enter a valid email address." } };

  const current = await getSavedRecipients();
  if (current.some((r) => r.email === email)) {
    return { fieldErrors: { email: "This address already receives alerts." } };
  }
  if (current.length >= MAX_RECIPIENTS) {
    return { error: `You can have up to ${MAX_RECIPIENTS} recipients.` };
  }

  const { settings } = await collections();
  await settings.updateOne(
    { _id: "notifications" },
    {
      $push: { recipients: { email, ...(name ? { name } : {}), addedAt: new Date(), addedByName: actor.name } },
      $set: { updatedAt: new Date() },
    },
    { upsert: true },
  );
  await audit(actor, `Added ${email} to inquiry alerts`);
  revalidatePath("/admin/notifications");
  return { ok: true, message: `${name || email} will now receive new-inquiry alerts.` };
}

export async function removeRecipient(email: string): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;

  const { settings } = await collections();
  const result = await settings.updateOne(
    { _id: "notifications" },
    { $pull: { recipients: { email } }, $set: { updatedAt: new Date() } },
  );
  if (!result.modifiedCount) return { error: "That address isn’t on the list." };
  await audit(actor, `Removed ${email} from inquiry alerts`);
  revalidatePath("/admin/notifications");
  return { ok: true };
}

export async function sendTestAlert(email: string): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;
  if (!EMAIL_RE.test(email)) return { error: "Invalid address." };
  if (!isResendConfigured()) return { error: "Email isn’t configured yet (RESEND_API_KEY is missing)." };

  const sample = buildInquiryEmail(
    {
      reason: "counseling",
      name: "",
      phone: "",
      email: "",
      contactMethod: "phone",
      format: "in-person",
      language: "english",
      message: "",
    },
    { dashboardUrl: new URL("/admin", site.url).toString(), test: true },
  );
  const error = await sendEmails([{ to: email, ...sample }]);
  if (error) return { error: `The test couldn’t be sent: ${error}` };
  await audit(actor, `Sent a test alert to ${email}`);
  return { ok: true, message: `Test sent to ${email}. Check the inbox (and junk folder) in a minute.` };
}
