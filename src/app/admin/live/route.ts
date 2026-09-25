import { getSessionUser } from "@/lib/auth/session";
import { getInquirySignature } from "@/lib/inquiries/repository";

/** Polled by the dashboard (see LiveUpdates) to notice new or changed inquiries. */
export async function GET() {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json(await getInquirySignature(), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
