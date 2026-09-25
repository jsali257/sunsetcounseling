"use server";

import { revalidatePath } from "next/cache";
import { ObjectId, MongoServerError } from "mongodb";
import { collections } from "@/lib/db/mongodb";
import { getActionUser } from "@/lib/auth/dal";
import { destroyUserSessions } from "@/lib/auth/session";
import { generateTemporaryPassword, hashPassword } from "@/lib/auth/password";
import { parseObjectId } from "@/lib/inquiries/repository";
import { audit } from "@/lib/audit";
import { roleLabels, roles, type Role } from "@/lib/db/types";
import type { ActionState } from "@/lib/admin/form-state";

const adminOnly: ActionState = { error: "Only administrators can manage team members." };

async function activeAdminCount() {
  const { users } = await collections();
  return users.countDocuments({ role: "admin", active: true });
}

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const role = String(formData.get("role")) as Role;

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Enter a name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fieldErrors.email = "Enter a valid email.";
  if (!roles.includes(role)) fieldErrors.role = "Choose a role.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const temporaryPassword = generateTemporaryPassword();
  const now = new Date();
  const { users } = await collections();
  try {
    await users.insertOne({
      _id: new ObjectId(),
      name,
      email,
      role,
      passwordHash: await hashPassword(temporaryPassword),
      active: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return { fieldErrors: { email: "A team member with this email already exists." } };
    }
    throw error;
  }

  await audit(actor, `Added ${roleLabels[role].toLowerCase()} ${name}`, { targetType: "user", targetId: email });
  revalidatePath("/admin/team");
  return {
    ok: true,
    message: `${name} was added. Share this temporary password privately — it is shown only once. They’ll choose their own password at first sign-in.`,
    secret: temporaryPassword,
  };
}

export async function setUserRole(userId: string, role: Role): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;
  const _id = parseObjectId(userId);
  if (!_id || !roles.includes(role)) return { error: "Invalid request." };
  if (_id.equals(actor._id)) return { error: "You can’t change your own role." };

  const { users } = await collections();
  const target = await users.findOne({ _id });
  if (!target) return { error: "This team member no longer exists." };
  if (target.role === "admin" && role !== "admin" && target.active && (await activeAdminCount()) <= 1) {
    return { error: "At least one active administrator is required." };
  }

  await users.updateOne({ _id }, { $set: { role, updatedAt: new Date() } });
  await audit(actor, `Changed ${target.name}’s role to ${roleLabels[role].toLowerCase()}`, {
    targetType: "user",
    targetId: target.email,
  });
  revalidatePath("/admin/team");
  return { ok: true, message: `${target.name} is now ${roleLabels[role].toLowerCase()}.` };
}

export async function setUserActive(userId: string, active: boolean): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;
  const _id = parseObjectId(userId);
  if (!_id) return { error: "Invalid request." };
  if (_id.equals(actor._id)) return { error: "You can’t deactivate your own account." };

  const { users } = await collections();
  const target = await users.findOne({ _id });
  if (!target) return { error: "This team member no longer exists." };
  if (!active && target.role === "admin" && (await activeAdminCount()) <= 1) {
    return { error: "At least one active administrator is required." };
  }

  await users.updateOne({ _id }, { $set: { active, updatedAt: new Date() } });
  if (!active) await destroyUserSessions(_id);
  await audit(actor, `${active ? "Reactivated" : "Deactivated"} ${target.name}`, {
    targetType: "user",
    targetId: target.email,
  });
  revalidatePath("/admin/team");
  return { ok: true, message: `${target.name} was ${active ? "reactivated" : "deactivated"}.` };
}

export async function resetUserPassword(userId: string): Promise<ActionState> {
  const actor = await getActionUser("admin");
  if (!actor) return adminOnly;
  const _id = parseObjectId(userId);
  if (!_id) return { error: "Invalid request." };
  if (_id.equals(actor._id)) return { error: "Use the Account page to change your own password." };

  const { users } = await collections();
  const target = await users.findOne({ _id });
  if (!target) return { error: "This team member no longer exists." };

  const temporaryPassword = generateTemporaryPassword();
  await users.updateOne(
    { _id },
    {
      $set: {
        passwordHash: await hashPassword(temporaryPassword),
        mustChangePassword: true,
        updatedAt: new Date(),
      },
    },
  );
  await destroyUserSessions(_id);
  await audit(actor, `Reset ${target.name}’s password`, { targetType: "user", targetId: target.email });
  revalidatePath("/admin/team");
  return {
    ok: true,
    message: `Temporary password for ${target.name} — shown only once. They’ve been signed out everywhere.`,
    secret: temporaryPassword,
  };
}
