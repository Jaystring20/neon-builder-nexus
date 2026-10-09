/**
 * Admin dashboard roles and what each may do. Shared by /admin (to show or
 * hide screens) and api/admin.ts (to allow or refuse each request), so the
 * two never disagree. The server check is the one that counts.
 */

export const ROLES = ["owner", "manager", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_SUMMARY: Record<Role, string> = {
  owner: "Everything, including prices and team accounts.",
  manager: "Leads, bookings, diagnostics and events: status, call dates, notes, registrations.",
  editor: "Website content and events: programmes, portfolio, bios, webinars. Not programme prices.",
  viewer: "Overview and numbers only. Changes nothing.",
};

export type Permission = "overview" | "leads.read" | "leads.write" | "content.edit" | "prices.edit" | "events.manage" | "team.manage";

const GRANTS: Record<Role, Permission[]> = {
  owner: ["overview", "leads.read", "leads.write", "content.edit", "prices.edit", "events.manage", "team.manage"],
  manager: ["overview", "leads.read", "leads.write", "events.manage"],
  editor: ["overview", "content.edit", "events.manage"],
  viewer: ["overview"],
};

export const can = (role: Role | undefined, p: Permission) => !!role && GRANTS[role].includes(p);

export const LEAD_STATUSES = ["new", "contacted", "booked", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Call booked",
  won: "Won",
  lost: "Lost",
};
