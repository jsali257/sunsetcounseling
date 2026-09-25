"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { collections } from "@/lib/db/mongodb";
import { getActionUser } from "@/lib/auth/dal";
import { parseObjectId } from "@/lib/inquiries/repository";
import { audit } from "@/lib/audit";
import { inquiryStatuses, statusLabels, type InquiryStatus } from "@/lib/db/types";
import type { ActionState } from "@/lib/admin/form-state";

const NOTE_MAX = 2000;
const signedOut: ActionState = { error: "Your session has ended. Please sign in again." };

export async function updateInquiryStatus(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getActionUser();
  if (!user) return signedOut;
  const _id = parseObjectId(id);
  const status = String(formData.get("status")) as InquiryStatus;
  if (!_id || !inquiryStatuses.includes(status)) return { error: "Invalid request." };

  const { inquiries } = await collections();
  const current = await inquiries.findOne({ _id }, { projection: { status: 1, firstRespondedAt: 1 } });
  if (!current) return { error: "This inquiry no longer exists." };
  if (current.status === status) return { ok: true };

  const now = new Date();
  await inquiries.updateOne(
    { _id },
    {
      $set: {
        status,
        updatedAt: now,
        ...(!current.firstRespondedAt && status !== "new" ? { firstRespondedAt: now } : {}),
      },
      $push: { history: { at: now, byId: user._id, byName: user.name, from: current.status, to: status } },
    },
  );
  await audit(user, `Marked inquiry ${statusLabels[status].toLowerCase()}`, {
    targetType: "inquiry",
    targetId: id,
  });
  revalidatePath("/admin", "layout");
  return { ok: true, message: `Status set to ${statusLabels[status]}.` };
}

export async function addInquiryNote(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getActionUser();
  if (!user) return signedOut;
  const _id = parseObjectId(id);
  const body = String(formData.get("body") ?? "").trim();
  if (!_id) return { error: "Invalid request." };
  if (!body) return { fieldErrors: { body: "Write a note first." } };
  if (body.length > NOTE_MAX) {
    return { fieldErrors: { body: `Keep notes under ${NOTE_MAX} characters.` } };
  }

  const { inquiries } = await collections();
  const now = new Date();
  const result = await inquiries.updateOne(
    { _id },
    {
      $push: { notes: { id: randomUUID(), body, authorId: user._id, authorName: user.name, createdAt: now } },
      $set: { updatedAt: now },
    },
  );
  if (!result.matchedCount) return { error: "This inquiry no longer exists." };
  await audit(user, "Added a note", { targetType: "inquiry", targetId: id });
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true, message: "Note added." };
}

export async function deleteInquiry(id: string): Promise<ActionState> {
  const user = await getActionUser("admin");
  if (!user) return { error: "Only administrators can delete inquiries." };
  const _id = parseObjectId(id);
  if (!_id) return { error: "Invalid request." };

  const { inquiries } = await collections();
  const doc = await inquiries.findOneAndDelete({ _id }, { projection: { name: 1 } });
  if (!doc) return { error: "This inquiry no longer exists." };
  // The name is deliberately not logged, so deletions don't leave personal data behind.
  await audit(user, "Deleted an inquiry", { targetType: "inquiry", targetId: id });
  revalidatePath("/admin", "layout");
  redirect("/admin?deleted=1");
}
