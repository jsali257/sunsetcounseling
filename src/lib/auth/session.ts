import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/mongodb";
import type { UserDoc } from "@/lib/db/types";
import { SESSION_COOKIE, SESSION_TTL_HOURS } from "./constants";

export type SessionUser = Pick<UserDoc, "_id" | "email" | "name" | "role" | "mustChangePassword">;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Creates a database-backed session and sets the httpOnly cookie. */
export async function createSession(userId: ObjectId) {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_HOURS * 60 * 60 * 1000);
  const { sessions } = await collections();
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? undefined;

  await sessions.insertOne({
    _id: new ObjectId(),
    tokenHash: hashToken(token),
    userId,
    createdAt: now,
    expiresAt,
    userAgent,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Signs out the current browser. */
export async function destroyCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const { sessions } = await collections();
    await sessions.deleteOne({ tokenHash: hashToken(token) });
  }
  store.delete(SESSION_COOKIE);
}

/** Signs a user out everywhere, optionally keeping the current browser signed in. */
export async function destroyUserSessions(userId: ObjectId, { keepCurrent = false } = {}) {
  const { sessions } = await collections();
  const token = keepCurrent ? (await cookies()).get(SESSION_COOKIE)?.value : undefined;
  await sessions.deleteMany({
    userId,
    ...(token ? { tokenHash: { $ne: hashToken(token) } } : {}),
  });
}

/**
 * The signed-in user for this request, or null.
 * Checks the session on every request, so deactivating a user or
 * changing their role takes effect immediately.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { sessions, users } = await collections();
  const session = await sessions.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const user = await users.findOne(
    { _id: session.userId, active: true },
    { projection: { email: 1, name: 1, role: 1, mustChangePassword: 1 } },
  );
  return user ?? null;
});
