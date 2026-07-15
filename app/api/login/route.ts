import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, adminPassword, sha256Hex } from "@/lib/auth";

export const runtime = "nodejs";

// POST { password } — sign in. Sets the admin cookie to the sha256 of the
// password when it matches, so the middleware recognises the session.
export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const password = body.password ?? "";
  if (password !== adminPassword()) {
    return NextResponse.json({ success: false, error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, await sha256Hex(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// DELETE — sign out.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
