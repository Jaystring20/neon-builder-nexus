import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LEAD_STATUSES, STATUS_LABEL, can } from "@/data/adminRoles";
import { adminApi } from "@/lib/adminApi";
import { useMe } from "./AdminApp";
import { ActivityList, ErrorNote, Loading, PageHeader, Panel, fmtDate } from "./ui";

const Stat = ({ label, value, to, note }: { label: string; value: number; to?: string; note?: string }) => {
  const body = (
    <>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display-refined text-4xl tabular-nums text-foreground">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </>
  );
  return to ? (
    <Link to={to} className="block border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/60">
      {body}
    </Link>
  ) : (
    <div className="border border-border/60 bg-card/40 p-5">{body}</div>
  );
};

export default function Overview() {
  const me = useMe();
  const q = useQuery({ queryKey: ["admin", "overview"], queryFn: adminApi.overview });
  const linked = can(me.role, "leads.read");
  const canEvents = can(me.role, "events.manage");

  return (
    <>
      <PageHeader title={`Welcome${me.name ? `, ${me.name.split(/\s+/)[0]}` : ""}.`} lead="This week at DCH, at a glance." />
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <ErrorNote error={q.error} />
      ) : (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Call requests this week" value={q.data!.leads.thisWeek} to={linked ? "/admin/leads" : undefined} />
            <Stat
              label="High priority, waiting"
              value={q.data!.leads.openHigh}
              to={linked ? "/admin/leads?priority=high" : undefined}
              note="New or contacted"
            />
            <Stat label="Diagnostics this week" value={q.data!.diagnostics.thisWeek} to={linked ? "/admin/diagnostics" : undefined} />
            <Stat label="Diagnostics, all time" value={q.data!.diagnostics.total} />
          </div>

          <Panel title="Pipeline">
            <div className="grid grid-cols-2 gap-px bg-border/40 sm:grid-cols-5">
              {LEAD_STATUSES.map((s) => {
                const inner = (
                  <>
                    <p className="text-xs text-muted-foreground">{STATUS_LABEL[s]}</p>
                    <p className="mt-1 text-2xl tabular-nums text-foreground">{q.data!.leads.byStatus[s] ?? 0}</p>
                  </>
                );
                return linked ? (
                  <Link key={s} to={`/admin/leads?status=${s}`} className="bg-card p-4 hover:bg-card/60">
                    {inner}
                  </Link>
                ) : (
                  <div key={s} className="bg-card p-4">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="grid gap-8 lg:grid-cols-2">
            <Panel title="Upcoming calls">
              {q.data!.upcoming.length ? (
                <ul className="space-y-3">
                  {q.data!.upcoming.map((c) => (
                    <li key={c.id} className="flex justify-between gap-4 text-sm">
                      {linked ? (
                        <Link to={`/admin/leads/${c.id}`} className="text-foreground hover:text-primary">
                          {c.name}
                          {c.company ? `, ${c.company}` : ""}
                        </Link>
                      ) : (
                        <span>{c.name}</span>
                      )}
                      <span className="shrink-0 text-muted-foreground">{fmtDate(c.call_at, true)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No calls on the calendar. When someone books in Calendly, open their lead and set the call date.
                </p>
              )}
            </Panel>
            {q.data!.events && q.data!.events.length > 0 && (
              <Panel title="Upcoming events">
                <ul className="space-y-3">
                  {q.data!.events.map((e) => (
                    <li key={e.id} className="flex justify-between gap-4 text-sm">
                      {canEvents ? (
                        <Link to={`/admin/events/${e.id}`} className="text-foreground hover:text-primary">
                          {e.title}
                        </Link>
                      ) : (
                        <span>{e.title}</span>
                      )}
                      <span className="shrink-0 text-right text-muted-foreground">
                        {fmtDate(e.starts_at, true)}
                        <br />
                        {e.registered}
                        {e.capacity ? ` / ${e.capacity}` : ""} registered
                        {e.awaitingPayment ? <span className="text-secondary"> · {e.awaitingPayment} to pay</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            <Panel title="Recent activity">
              <ActivityList items={q.data!.activity} />
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
