import "server-only";
import { collections, isDatabaseConfigured } from "@/lib/db/mongodb";
import type { NotificationRecipient } from "@/lib/db/types";

export const MAX_RECIPIENTS = 20;

/** Addresses from the CONTACT_TO_EMAIL environment variable (comma-separated). */
export function envRecipients(): string[] {
  return (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
}

export async function getSavedRecipients(): Promise<NotificationRecipient[]> {
  if (!isDatabaseConfigured()) return [];
  const { settings } = await collections();
  const doc = await settings.findOne({ _id: "notifications" });
  return doc?.recipients ?? [];
}

/**
 * Who receives new-inquiry alerts: the list managed on the dashboard's
 * Notifications page, or CONTACT_TO_EMAIL when that list is empty.
 */
export async function getAlertRecipients(): Promise<{ emails: string[]; source: "dashboard" | "environment" }> {
  try {
    const saved = await getSavedRecipients();
    if (saved.length) return { emails: saved.map((r) => r.email), source: "dashboard" };
  } catch (error) {
    console.error("Couldn’t load alert recipients; using CONTACT_TO_EMAIL:", error instanceof Error ? error.message : error);
  }
  return { emails: envRecipients(), source: "environment" };
}
