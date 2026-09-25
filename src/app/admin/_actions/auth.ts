"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { collections } from "@/lib/db/mongodb";
import {
  checkPasswordStrength,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";
import {
  createSession,
  destroyCurrentSession,
  destroyUserSessions,
  getSessionUser,
} from "@/lib/auth/session";
import { requireUser } from "@/lib/auth/dal";
import { LOGIN_PATH } from "@/lib/auth/constants";
import { audit } from "@/lib/audit";
import type { ActionState } from "@/lib/admin/form-state";

const WINDOW_MINUTES = 15;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

// Compared against when an email isn't found, so response time doesn't reveal which emails exist.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword(randomBytes(16).toString("hex")));

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/** Only allow redirects back into the dashboard. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("//") && !next.includes("\\")
    ? next
    : "/admin";
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Enter your email and password." };

  const { users, loginAttempts } = await collections();
  const ip = await clientIp();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const [emailFailures, ipFailures] = await Promise.all([
    loginAttempts.countDocuments({ email, createdAt: { $gt: since } }),
    loginAttempts.countDocuments({ ip, createdAt: { $gt: since } }),
  ]);
  if (emailFailures >= MAX_PER_EMAIL || ipFailures >= MAX_PER_IP) {
    return {
      error: `Too many sign-in attempts. Please wait ${WINDOW_MINUTES} minutes and try again.`,
    };
  }

  const user = await users.findOne({ email });
  const valid = user
    ? await verifyPassword(password, user.passwordHash)
    : (await verifyPassword(password, await getDummyHash()), false);

  if (!user || !valid || !user.active) {
    const now = new Date();
    await loginAttempts.insertOne({
      email,
      ip,
      createdAt: now,
      expiresAt: new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000),
    });
    if (user && valid && !user.active) {
      return { error: "This account has been deactivated. Contact an administrator." };
    }
    return { error: "Email or password is incorrect." };
  }

  await loginAttempts.deleteMany({ email });
  await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  await createSession(user._id);
  await audit(user, "Signed in");

  redirect(user.mustChangePassword ? "/admin/account?required=1" : safeNext(formData.get("next")));
}

export async function logout() {
  const user = await getSessionUser();
  await destroyCurrentSession();
  if (user) await audit(user, "Signed out");
  redirect(LOGIN_PATH);
}

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser({ allowPasswordChange: true });
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!current) fieldErrors.current = "Enter your current password.";
  const strength = checkPasswordStrength(next, user.email);
  if (strength) fieldErrors.next = strength;
  else if (next === current) fieldErrors.next = "Choose a password different from the current one.";
  if (next !== confirm) fieldErrors.confirm = "Passwords don’t match.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { users } = await collections();
  const record = await users.findOne({ _id: user._id });
  if (!record || !(await verifyPassword(current, record.passwordHash))) {
    return { fieldErrors: { current: "Current password is incorrect." } };
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordHash: await hashPassword(next),
        mustChangePassword: false,
        updatedAt: new Date(),
      },
    },
  );
  await destroyUserSessions(user._id, { keepCurrent: true });
  await audit(user, "Changed their password");

  // Re-render the dashboard layout so the navigation appears after a forced change.
  revalidatePath("/admin", "layout");
  if (user.mustChangePassword) redirect("/admin");
  return { ok: true, message: "Password updated. Other devices have been signed out." };
}
