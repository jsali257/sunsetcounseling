import "server-only";
import { collections } from "@/lib/db/mongodb";
import type { AuditEntry } from "@/lib/db/types";
import type { SessionUser } from "@/lib/auth/session";

/** Records who did what. Failures are logged but never block the action itself. */
export async function audit(
  actor: Pick<SessionUser, "_id" | "name"> | null,
  action: string,
  target?: Pick<AuditEntry, "targetType" | "targetId" | "detail">,
) {
  try {
    const { audit } = await collections();
    await audit.insertOne({
      at: new Date(),
      actorId: actor?._id,
      actorName: actor?.name ?? "System",
      action,
      ...target,
    });
  } catch (error) {
    console.error("Audit log write failed:", error instanceof Error ? error.message : error);
  }
}
