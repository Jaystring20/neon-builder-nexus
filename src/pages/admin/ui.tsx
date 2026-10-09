import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type LeadStatus } from "@/data/adminRoles";
import { adminApi, type Activity, type Note } from "@/lib/adminApi";

export const SEGMENT_LABEL: Record<string, string> = {
  msme_value: "Business, premium",
  msme_volume: "Business, volume",
  startup: "Startup",
  professional_service: "Professional service",
  development_org: "Development organisation",
};

export const fmtDate = (iso: string | null | undefined, withTime = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "";

export const ago = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days < 30 ? `${days} d ago` : fmtDate(iso);
};

export const PageHeader = ({ title, lead, action }: { title: string; lead?: string; action?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-6">
    <div>
      <h1 className="font-display-refined text-3xl text-foreground sm:text-4xl">{title}</h1>
      {lead && <p className="mt-2 text-muted-foreground">{lead}</p>}
    </div>
    {action}
  </div>
);

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "border-primary/50 text-primary",
  contacted: "border-border text-foreground",
  booked: "border-secondary/60 text-secondary",
  won: "border-emerald-400/50 text-emerald-300",
  lost: "border-border/60 text-muted-foreground",
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={cn("inline-block whitespace-nowrap border px-2 py-0.5 text-xs", STATUS_TONE[status])}>{STATUS_LABEL[status]}</span>
);

export const PriorityMark = ({ priority }: { priority: string }) => (
  <span
    className={cn(
      "text-xs font-semibold uppercase tracking-wide",
      priority === "high" ? "text-secondary" : priority === "medium" ? "text-foreground/80" : "text-muted-foreground",
    )}
  >
    {priority}
  </span>
);

export const Panel = ({ title, children, className }: { title?: string; children: ReactNode; className?: string }) => (
  <section className={cn("border border-border/60 bg-card/40 p-5", className)}>
    {title && <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>}
    {children}
  </section>
);

export const Field = ({ label, children }: { label: string; children: ReactNode }) =>
  children ? (
    <div className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-line text-foreground">{children}</dd>
    </div>
  ) : null;

export const Loading = () => (
  <div className="flex items-center gap-2 py-16 text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" /> Loading
  </div>
);

export const ErrorNote = ({ error }: { error: unknown }) => (
  <p role="alert" className="py-8 text-destructive">
    {error instanceof Error ? error.message : "Something went wrong."}
  </p>
);

const who = (p: { name: string; email: string } | null) => (p ? p.name || p.email : "Someone");

const CONTENT_LABEL: Record<string, string> = {
  programmes: "the programmes",
  settings: "price display",
  portfolio: "the portfolio",
  leaders: "the leadership bios",
};

const ACTION_TEXT: Record<string, (d: Record<string, unknown>) => string> = {
  "lead.status": (d) => `moved it to ${STATUS_LABEL[d.to as LeadStatus] ?? d.to}`,
  "lead.call_at": (d) => (d.to ? `set the call for ${fmtDate(d.to as string, true)}` : "cleared the call date"),
  "lead.assigned_to": (d) => (d.to ? "assigned the follow-up" : "unassigned the follow-up"),
  "note.add": () => "added a note",
  "diagnostic.to_lead": () => "added it to the leads pipeline",
  "lead.created_from_diagnostic": () => "created this lead from a diagnostic",
  "team.add": (d) => `added ${d.email} to the team`,
  "team.update": (d) => `updated ${d.email}${d.active === false ? " (access removed)" : ""}`,
  "content.save": (d) => `updated ${CONTENT_LABEL[d.key as string] ?? d.key} on the website`,
  "content.restore": (d) => `restored an earlier version of ${CONTENT_LABEL[d.key as string] ?? d.key}`,
  "content.reset": (d) => `put ${CONTENT_LABEL[d.key as string] ?? d.key} back to the original`,
};

export const describeActivity = (a: Activity) => `${who(a.actor)} ${(ACTION_TEXT[a.action] ?? (() => a.action))(a.detail ?? {})}`;

export const ActivityList = ({ items }: { items: Activity[] }) =>
  items.length ? (
    <ul className="space-y-3 text-sm">
      {items.map((a, i) => (
        <li key={a.id ?? i} className="flex justify-between gap-4">
          <span className="text-foreground/90">{describeActivity(a)}</span>
          <span className="shrink-0 text-muted-foreground">{ago(a.created_at)}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">Nothing yet.</p>
  );

/** Notes on a lead or diagnostic, newest first, with a box to add one. */
export function NotesPanel({
  type,
  id,
  notes,
  canWrite,
  queryKey,
}: {
  type: "lead" | "diagnostic";
  id: string;
  notes: Note[];
  canWrite: boolean;
  queryKey: unknown[];
}) {
  const [text, setText] = useState("");
  const qc = useQueryClient();
  const add = useMutation({
    mutationFn: () => adminApi.addNote(type, id, text),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey });
    },
  });

  return (
    <Panel title="Notes">
      {canWrite && (
        <form
          className="mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) add.mutate();
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="What happened, what's next"
            className="w-full border border-border/60 bg-background/60 px-3 py-2 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" size="sm" disabled={!text.trim() || add.isPending}>
              {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add note"}
            </Button>
            {add.error && <span className="text-sm text-destructive">{(add.error as Error).message}</span>}
          </div>
        </form>
      )}
      {notes.length ? (
        <ul className="space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="border-l-2 border-primary/40 pl-3">
              <p className="whitespace-pre-line text-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {who(n.author)} · {fmtDate(n.created_at, true)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      )}
    </Panel>
  );
}

export const selectClass =
  "h-10 border border-border/60 bg-background/60 px-3 text-sm [color-scheme:dark] text-foreground focus:border-primary focus:outline-none";
