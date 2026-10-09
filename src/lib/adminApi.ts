/**
 * Browser side of /api/admin. The session lives in an HttpOnly cookie the
 * page never sees; every call just sends it along.
 */

import type { Role, LeadStatus } from "@/data/adminRoles";

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
};
