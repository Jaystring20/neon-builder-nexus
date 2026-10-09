/**
 * Sign-in for /admin. Server-side only (imported by api/admin.ts).
 *
 * No passwords: a team member asks for a link, we email a one-time token via
 * Resend, and redeeming it sets a signed session cookie. The cookie holds only
 * the user id and an expiry, signed with HMAC-SHA256; their role and whether
 * they are still active are re-read from admin_users on every request, so a
 * role change or removal applies at once.
 *
 * The signing key is ADMIN_SESSION_SECRET, or, when that is not set, one
 * derived from SUPABASE_SERVICE_ROLE_KEY. Changing either signs everyone out.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "dch_admin";
export const SESSION_DAYS = 30;
export const LINK_MINUTES = 15;

const secret = () => {
  const own = process.env.ADMIN_SESSION_SECRET;
  if (own) return own;
  const derived = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!derived) throw new Error("No ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY to sign sessions with");
  return createHash("sha256").update(`dch-admin-session:${derived}`).digest("hex");
};

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function createSession(userId: string, now = Date.now()): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const payload = `${userId}.${Math.floor(now / 1000) + maxAge}`;
  return { value: `${payload}.${sign(payload)}`, maxAge };
}

/** The user id in a valid, unexpired session cookie, or null. */
export function readSession(value: string | undefined, now = Date.now()): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = Buffer.from(sign(`${userId}.${exp}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (!/^\d+$/.test(exp) || Number(exp) * 1000 < now) return null;
  return userId;
}

export const newLoginToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function readCookie(header: string | undefined, name: string): string | undefined {
  for (const part of (header ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return undefined;
}

export function sessionCookie(value: string, maxAge: number, secure: boolean): string {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/api/admin",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

/**
 * Where sign-in links point. The site itself, a Vercel preview of it, or a
 * local dev server; any other Host header falls back to the live site, so a
 * forged header cannot send someone's link elsewhere.
 */
export function siteOrigin(host: string | undefined): string {
  const h = (host ?? "").toLowerCase();
  if (/^(www\.)?digitalcreativeshubltd\.com$/.test(h) || /\.vercel\.app$/.test(h)) return `https://${h}`;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(h)) return `http://${h}`;
  return "https://www.digitalcreativeshubltd.com";
}
