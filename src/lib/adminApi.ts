/**
 * Browser side of /api/admin. The session lives in an HttpOnly cookie the
 * page never sees; every call just sends it along.
 */

import type { Role, LeadStatus } from "@/data/adminRoles";
import type { ContentKey } from "@/data/siteContent";

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function call<T>(op: string, opts: { body?: unknown; query?: Record<string, string | undefined> } = {}): Promise<T> {
  const params = new URLSearchParams({ op });
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v) params.set(k, v);
  const post = opts.body !== undefined;
  const res = await fetch(`/api/admin?${params}`, {
    method: post ? "POST" : "GET",
    credentials: "same-origin",
    headers: post ? { "Content-Type": "application/json", "X-DCH-Admin": "1" } : undefined,
    body: post ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(res.status, data.error || "Something went wrong.");
  return data as T;
}

export interface Me {
  id: string;
  email: string;
  name: string;
  role: Role;
}

type Person = { name: string; email: string } | null;

export interface Activity {
  id?: string;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  detail: Record<string, unknown>;
  created_at: string;
  actor: Person;
}

export interface Note {
  id: string;
  body: string;
  created_at: string;
  author: Person;
}

export interface LeadRow {
  id: string;
  created_at: string;
  source: string;
  name: string;
  email: string;
  company: string | null;
  client_type: string;
  practice: string | null;
  priority: "high" | "medium" | "low";
  status: LeadStatus;
  call_at: string | null;
  assigned_to: string | null;
  budget: string;
  currency: "NGN" | "USD";
  timeline: string;
}

export interface Lead extends LeadRow {
  phone: string | null;
  needs: string[];
  problem: string;
  discovery_id: string | null;
}

export interface DiagnosticRow {
  id: string;
  email: string;
  segment: string;
  program: string;
  capability_gap: string | null;
  created_at: string;
  updated_at: string;
  lead: { id: string; status: LeadStatus } | null;
}

export interface Diagnostic extends Omit<DiagnosticRow, "lead"> {
  answers: Record<string, unknown>;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  created_at?: string;
  last_seen_at?: string | null;
}

export interface Overview {
  leads: { total: number; thisWeek: number; openHigh: number; byStatus: Record<LeadStatus, number> };
  diagnostics: { total: number; thisWeek: number };
  upcoming: { id: string; name: string; company: string | null; call_at: string }[];
  activity: Activity[];
}

export interface ContentState<T> {
  value: T | null;
  updatedAt: string | null;
  updatedBy: Person;
  versions: { id: string; savedAt: string; savedBy: Person; reset: boolean }[];
}

/**
 * Shrink an image in the browser (longest side 1600px, WebP) and upload it
 * through a one-time link. Returns the public address to store.
 */
async function uploadImage(folder: "portfolio" | "leaders", file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new AdminApiError(400, "Choose an image file.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob) throw new AdminApiError(400, "That image couldn't be read.");

  const { uploadUrl, publicUrl } = await call<{ uploadUrl: string; publicUrl: string }>("upload-url", {
    body: { folder, contentType: blob.type },
  });
  const form = new FormData();
  form.append("cacheControl", "31536000");
  form.append("", blob);
  const res = await fetch(uploadUrl, { method: "PUT", body: form });
  if (!res.ok) throw new AdminApiError(res.status, "The upload didn't go through. Please try again.");
  return publicUrl;
}

export const adminApi = {
  login: (email: string) => call<{ ok: true }>("login", { body: { email } }),
  verify: (token: string) => call<{ ok: true }>("verify", { body: { token } }),
  logout: () => call<{ ok: true }>("logout", { body: {} }),
  me: () => call<{ user: Me }>("me"),
  overview: () => call<Overview>("overview"),
  leads: (q: { status?: string; priority?: string; q?: string }) => call<{ leads: LeadRow[] }>("leads", { query: q }),
  lead: (id: string) => call<{ lead: Lead; notes: Note[]; activity: Activity[] }>("lead", { query: { id } }),
  updateLead: (id: string, patch: Partial<Pick<Lead, "status" | "call_at" | "assigned_to">>) =>
    call<{ ok: true }>("lead-update", { body: { id, ...patch } }),
  addNote: (entity_type: "lead" | "diagnostic", entity_id: string, body: string) =>
    call<{ ok: true }>("note", { body: { entity_type, entity_id, body } }),
  diagnostics: () => call<{ diagnostics: DiagnosticRow[] }>("diagnostics"),
  diagnostic: (id: string) =>
    call<{ diagnostic: Diagnostic; lead: { id: string; status: LeadStatus } | null; notes: Note[]; activity: Activity[] }>("diagnostic", {
      query: { id },
    }),
  diagnosticToLead: (id: string) => call<{ leadId: string }>("diagnostic-to-lead", { body: { id } }),
  team: () => call<{ team: TeamMember[] }>("team"),
  saveMember: (m: { id?: string; email?: string; name: string; role: Role; active?: boolean }) =>
    call<{ ok?: true; id?: string }>("team-save", { body: m }),
  content: <T,>(key: ContentKey) => call<ContentState<T>>("content", { query: { key } }),
  saveContent: (key: ContentKey, value: unknown) => call<{ ok: true }>("content-save", { body: { key, value } }),
  resetContent: (key: ContentKey) => call<{ ok: true }>("content-reset", { body: { key } }),
  restoreContent: (id: string) => call<{ ok: true }>("content-restore", { body: { id } }),
  uploadImage,
};
