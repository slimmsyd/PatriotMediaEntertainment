import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Optimistic gate on /admin — it only checks the cookie's signature and expiry
 * so a logged-out visitor lands on the login form instead of a flash of the
 * dashboard. The real authorization check runs again in every admin page and
 * server action via requireAdmin().
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const session = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!session && !isLoginRoute) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      url.searchParams.set("next", `${pathname}${search}`);
    }
    return NextResponse.redirect(url);
  }

  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/events", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
