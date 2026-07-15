/**
 * Password gate for the site editor. One cookie (`fm_admin`) whose value is the
 * sha256 hex of the admin password. All the path-matching + decision logic is
 * kept pure here so the middleware stays tiny and this is easy to reason about.
 *
 * Set the real password in the `ADMIN_PASSWORD` env var (locally in
 * `.env.local`, on Vercel in Project → Settings → Environment Variables).
 */

export const AUTH_COOKIE = "fm_admin";
export const LOGIN_PATH = "/admin/login";
export const DEFAULT_ADMIN_PASSWORD = "frostedmoon";

const PROTECTED_PAGES = ["/admin"];
const PROTECTED_APIS = ["/api/content", "/api/upload"];

/** sha256 hex via Web Crypto, so it runs in edge middleware and node alike. */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
}

/** True if `pathname` is `prefix` itself or a child segment of it. */
function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export type AuthOutcome = "allow" | "redirect-login" | "unauthorized";

/**
 * Decide what the middleware should do: given the path, the presented cookie
 * value, and the expected hash, return the action. The login page is always
 * allowed (so you can reach it while signed out); protected APIs get a 401,
 * protected pages get bounced to the login screen.
 */
export function authOutcome(
  pathname: string,
  cookieValue: string | undefined,
  expectedHash: string
): AuthOutcome {
  if (pathname === LOGIN_PATH) return "allow";

  const isProtectedPage = PROTECTED_PAGES.some((p) => matchesPrefix(pathname, p));
  const isProtectedApi = PROTECTED_APIS.some((p) => matchesPrefix(pathname, p));
  if (!isProtectedPage && !isProtectedApi) return "allow";

  if (cookieValue && cookieValue === expectedHash) return "allow";

  return isProtectedApi ? "unauthorized" : "redirect-login";
}
