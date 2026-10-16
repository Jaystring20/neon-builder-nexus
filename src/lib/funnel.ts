/**
 * Counts the steps people take through the Growth Diagnostic, so the
 * dashboard can show where they stop. Anonymous: a random id per attempt, the
 * step reached and where they came from; never their answers.
 *
 * Fire and forget: a failed or blocked send never gets in the visitor's way.
 */

export type FunnelEvent = "start" | "question" | "finish" | "book_open" | "booked";

const SESSION_KEY = "dch-discovery-session";
const SOURCE_KEY = "dch-discovery-source";

// randomUUID needs a secure context; plain-http previews fall back to random bytes.
const newId = (): string => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

/** This attempt's id; a fresh one after Start over. */
export function funnelSession(fresh = false): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing && !fresh) return existing;
    const id = newId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return newId();
  }
}

/** utm_source if the link had one, else the referring site, else "direct". Kept from the first visit. */
function source(): string {
  try {
    const kept = sessionStorage.getItem(SOURCE_KEY);
    if (kept) return kept;
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    let found = utm || "direct";
    if (!utm && document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname.replace(/^www\./, "")) found = host;
    }
    found = found.toLowerCase().slice(0, 60);
    sessionStorage.setItem(SOURCE_KEY, found);
    return found;
  } catch {
    return "direct";
  }
}

export function track(event: FunnelEvent, detail: { step?: number; question?: string; audience?: unknown } = {}) {
  try {
    const body = JSON.stringify({
      session_id: funnelSession(),
      event,
      step: detail.step,
      question: detail.question,
      audience: typeof detail.audience === "string" ? detail.audience : undefined,
      source: source(),
    });
    const url = "/api/discovery?op=track";
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(url, blob)) return;
    void fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch {
    /* never let counting break the diagnostic */
  }
}
