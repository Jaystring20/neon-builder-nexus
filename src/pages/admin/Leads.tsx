import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, STATUS_LABEL, can, type LeadStatus } from "@/data/adminRoles";
import { PRACTICE_TITLES, describe } from "@/data/leadIntake";
import { adminApi, type Lead } from "@/lib/adminApi";
import { useMe } from "./AdminApp";
import { ActivityList, ErrorNote, Field, Loading, NotesPanel, PageHeader, Panel, PriorityMark, StatusBadge, ago, fmtDate, selectClass } from "./ui";

const SOURCE_LABEL: Record<string, string> = { book_a_call: "Book a call", diagnostic: "Growth diagnostic" };

export function LeadsList() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "";
  const priority = params.get("priority") ?? "";
  const [search, setSearch] = useState(params.get("q") ?? "");
  const q = params.get("q") ?? "";

  // Search as you type, but only ask the server once typing pauses.
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== q) set("q", search);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const list = useQuery({
    queryKey: ["admin", "leads", status, priority, q],
    queryFn: () => adminApi.leads({ status, priority, q }),
  });

  return (
    <>
      <PageHeader title="Leads" lead="Everyone who asked for a call, plus diagnostics added to the pipeline." />
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or company"
          className={cn(selectClass, "min-w-0 flex-1 sm:max-w-xs")}
        />
        <select aria-label="Status" value={status} onChange={(e) => set("status", e.target.value)} className={selectClass}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select aria-label="Priority" value={priority} onChange={(e) => set("priority", e.target.value)} className={selectClass}>
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {list.isLoading ? (
        <Loading />
      ) : list.error ? (
        <ErrorNote error={list.error} />
      ) : list.data!.leads.length === 0 ? (
        <p className="py-16 text-muted-foreground">{status || priority || q ? "No leads match these filters." : "No leads yet."}</p>
      ) : (
        <div className="mt-6 border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="hidden border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground md:table-header-group">
              <tr>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Points to</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Came in</th>
              </tr>
            </thead>
            <tbody>
              {list.data!.leads.map((l) => (
                <tr key={l.id} className="relative block border-b border-border/40 last:border-0 hover:bg-card/60 md:table-row">
                  <td className="block px-4 pt-3 md:table-cell md:py-3">
                    <Link to={`/admin/leads/${l.id}`} className="font-medium text-foreground after:absolute after:inset-0 hover:text-primary">
                      {l.name}
                    </Link>
                    <p className="text-muted-foreground">{l.company || l.email}</p>
                  </td>
                  <td className="block px-4 text-muted-foreground md:table-cell md:py-3">
                    {l.practice ? PRACTICE_TITLES[l.practice] ?? l.practice : "To decide"}
                    {l.source !== "book_a_call" && <span className="ml-2 text-xs text-primary">{SOURCE_LABEL[l.source] ?? l.source}</span>}
                  </td>
                  <td className="inline-block px-4 py-2 md:table-cell md:py-3">
                    <PriorityMark priority={l.priority} />
                  </td>
                  <td className="inline-block px-0 py-2 md:table-cell md:px-4 md:py-3">
                    <StatusBadge status={l.status} />
                    {l.call_at && <p className="mt-1 hidden text-xs text-muted-foreground md:block">Call {fmtDate(l.call_at, true)}</p>}
                  </td>
                  <td className="block px-4 pb-3 text-muted-foreground md:table-cell md:py-3">{ago(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/** ISO → the value a datetime-local input expects, in the viewer's time zone. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

export function LeadDetail() {
  const { id = "" } = useParams();
  const me = useMe();
  const qc = useQueryClient();
  const writable = can(me.role, "leads.write");
  const key = ["admin", "lead", id];
  const q = useQuery({ queryKey: key, queryFn: () => adminApi.lead(id) });
  const team = useQuery({ queryKey: ["admin", "team"], queryFn: adminApi.team, enabled: writable });
  const [callAt, setCallAt] = useState("");
  useEffect(() => setCallAt(toLocalInput(q.data?.lead.call_at ?? null)), [q.data?.lead.call_at]);

  const update = useMutation({
    mutationFn: (patch: Partial<Pick<Lead, "status" | "call_at" | "assigned_to">>) => adminApi.updateLead(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { lead, notes, activity } = q.data!;

  return (
    <>
      <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All leads
      </Link>
      <div className="mt-4">
        <PageHeader
          title={lead.name}
          lead={[describe.clientType(lead.client_type), lead.company].filter(Boolean).join(" · ")}
          action={
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 border border-border/60 px-3 py-2 text-sm hover:border-primary">
                <Mail className="h-4 w-4" /> Email
              </a>
              {lead.phone && (
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border/60 px-3 py-2 text-sm hover:border-primary"
                >
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          }
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <Panel title="The problem, in their words">
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">{lead.problem}</p>
          </Panel>
          <Panel title="Details">
            <dl className="divide-y divide-border/30">
              <Field label="Email">{lead.email}</Field>
              <Field label="Phone">{lead.phone}</Field>
              <Field label="Needs">{lead.needs.map(describe.need).join("\n")}</Field>
              <Field label="Points to">{lead.practice ? PRACTICE_TITLES[lead.practice] ?? lead.practice : "To decide on the call"}</Field>
              <Field label="Budget">{describe.budget(lead.currency, lead.budget)}</Field>
              <Field label="Timeline">{describe.timeline(lead.timeline)}</Field>
              <Field label="Source">{SOURCE_LABEL[lead.source] ?? lead.source}</Field>
              <Field label="Came in">{fmtDate(lead.created_at, true)}</Field>
            </dl>
            {lead.discovery_id && (
              <Link to={`/admin/diagnostics/${lead.discovery_id}`} className="mt-4 inline-block text-sm text-primary hover:underline">
                See their diagnostic answers
              </Link>
            )}
          </Panel>
          <NotesPanel type="lead" id={lead.id} notes={notes} canWrite={writable} queryKey={key} />
        </div>

        <div className="space-y-8">
          <Panel title="Status">
            <div className="flex items-center gap-3">
              <StatusBadge status={lead.status} />
              <PriorityMark priority={lead.priority} />
            </div>
            {writable && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {LEAD_STATUSES.map((s: LeadStatus) => (
                  <button
                    key={s}
                    disabled={s === lead.status || update.isPending}
                    onClick={() => update.mutate({ status: s })}
                    className={cn(
                      "border px-3 py-2 text-sm transition-colors",
                      s === lead.status ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-foreground hover:border-primary/60",
                    )}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Call">
            {writable ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update.mutate({ call_at: callAt ? new Date(callAt).toISOString() : null });
                }}
                className="space-y-3"
              >
                <input type="datetime-local" value={callAt} onChange={(e) => setCallAt(e.target.value)} className={cn(selectClass, "w-full")} />
                <div className="flex gap-3">
                  <button type="submit" disabled={update.isPending} className="border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/10">
                    Save date
                  </button>
                  {lead.call_at && (
                    <button type="button" onClick={() => update.mutate({ call_at: null })} className="text-sm text-muted-foreground hover:text-foreground">
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Copy it from the Calendly booking. Setting a date marks the lead as Call booked.</p>
              </form>
            ) : (
              <p className="text-foreground">{lead.call_at ? fmtDate(lead.call_at, true) : "Not booked"}</p>
            )}
          </Panel>

          {writable && (
            <Panel title="Follow-up owner">
              <select
                aria-label="Follow-up owner"
                value={lead.assigned_to ?? ""}
                onChange={(e) => update.mutate({ assigned_to: e.target.value || null })}
                className={cn(selectClass, "w-full")}
              >
                <option value="">Nobody yet</option>
                {(team.data?.team ?? [])
                  .filter((m) => m.active)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.email}
                    </option>
                  ))}
              </select>
            </Panel>
          )}

          {update.error && <p className="text-sm text-destructive">{(update.error as Error).message}</p>}

          <Panel title="History">
            <ActivityList items={activity} />
          </Panel>
        </div>
      </div>
    </>
  );
}
