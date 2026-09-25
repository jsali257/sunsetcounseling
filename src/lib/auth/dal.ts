import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./session";
import { LOGIN_PATH } from "./constants";

/**
 * Authorization checks for pages and server actions.
 * proxy.ts only redirects signed-out visitors as a convenience;
 * these functions are the real security boundary.
 */
export async function requireUser(
  options: { allowPasswordChange?: boolean } = {},
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(LOGIN_PATH);
  if (user.mustChangePassword && !options.allowPasswordChange) {
    redirect("/admin/account?required=1");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?denied=1");
  return user;
}

/** For server actions that return a result instead of redirecting. */
export async function getActionUser(role?: "admin"): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword) return null;
  if (role === "admin" && user.role !== "admin") return null;
  return user;
}
