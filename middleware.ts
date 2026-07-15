import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, LOGIN_PATH, adminPassword, authOutcome, sha256Hex } from "@/lib/auth";

// Gates the editor (/admin) and its mutation APIs behind the shared admin
// cookie. Everything public — the homepage, /api/login — passes straight
// through. Decision logic lives in lib/auth.ts.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const expectedHash = await sha256Hex(adminPassword());
  const cookieValue = req.cookies.get(AUTH_COOKIE)?.value;

  switch (authOutcome(pathname, cookieValue, expectedHash)) {
    case "unauthorized":
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    case "redirect-login": {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      return NextResponse.redirect(url);
    }
    default:
      return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/content", "/api/upload"],
};
