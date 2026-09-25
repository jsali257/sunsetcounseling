import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Fast, optimistic redirect for signed-out visitors to /admin.
 * This only checks that a session cookie exists — every admin page and
 * action still verifies the session against the database.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === LOGIN_PATH;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!isLogin && !hasSession) {
    const url = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
