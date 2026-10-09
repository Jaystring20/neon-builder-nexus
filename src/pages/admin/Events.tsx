import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, Download, ExternalLink, Loader2, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EVENT_KINDS,
  KIND_LABEL,
  LOCATION_LABEL,
  LOCATION_TYPES,
  REGISTRATION_LABEL,
  REGISTRATION_STATUSES,
  fmtEventWhen,
  fmtNaira,
  fmtPrice,
  isPast,
  slugify,
  type EventRecord,
  type RegistrationStatus,
} from "@/data/events";
import { adminApi, type EventInput, type EventListItem, type Registration } from "@/lib/adminApi";
import { FieldRow, ImageInput, TextArea, TextInput } from "./content";
import { ErrorNote, Loading, PageHeader, Panel, ago, fmtDate, selectClass } from "./ui";

// Lagos is UTC+1 all year (no daylight saving), so the form works in WAT
// whatever time zone the team member's browser is in.
const WAT_MS = 60 * 60 * 1000;
const toWatInput = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() + WAT_MS).toISOString().slice(0, 16) : "");
const fromWatInput = (v: string) => (v ? new Date(`${v}:00+01:00`).toISOString() : "");

const PAYMENT_KEY = "dch-admin-payment-instructions";
const lastPaymentInstructions = () => {
  try {
    return localStorage.getItem(PAYMENT_KEY) ?? "";
  } catch {
    return "";
  }
};

function statusOf(e: Pick<EventRecord, "status" | "starts_at" | "ends_at">) {
  if (e.status === "cancelled") return { label: "Cancelled", tone: "border-border/60 text-muted-foreground" };
  if (e.status === "draft") return { label: "Draft", tone: "border-border text-foreground/80" };
  if (isPast(e)) return { label: "Finished", tone: "border-border/60 text-muted-foreground" };
  return { label: "Published", tone: "border-primary/50 text-primary" };
}

const EventBadge = ({ e }: { e: Pick<EventRecord, "status" | "starts_at" | "ends_at"> }) => {
  const s = statusOf(e);
  return <span className={cn("inline-block whitespace-nowrap border px-2 py-0.5 text-xs", s.tone)}>{s.label}</span>;
};

const seats = (c: EventListItem["counts"]) => (c.confirmed ?? 0) + (c.attended ?? 0) + (c.no_show ?? 0);

// ---------------------------------------------------------------- list

export function EventsList() {
  const q = useQuery({ queryKey: ["admin", "events"], queryFn: adminApi.events });
  const now = Date.now();
  const upcoming = (q.data?.events ?? []).filter((e) => !isPast(e, now)).reverse();
  const past = (q.data?.events ?? []).filter((e) => isPast(e, now));

  const table = (rows: EventListItem[]) => (
    <ul className="divide-y divide-border/40 border border-border/60">
      {rows.map((e) => (
        <li key={e.id} className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 hover:bg-card/60">
          <div className="min-w-0">
            <Link to={`/admin/events/${e.id}`} className="font-medium text-foreground after:absolute after:inset-0 hover:text-primary">
              {e.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {fmtEventWhen(e)} · {KIND_LABEL[e.kind]} · {fmtPrice(e.price_ngn)}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="text-foreground">{seats(e.counts)}</span>
              {e.capacity ? ` / ${e.capacity}` : ""} confirmed
              {e.counts.pending_payment ? <span className="ml-2 text-secondary">{e.counts.pending_payment} awaiting payment</span> : null}
            </span>
            <EventBadge e={e} />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <PageHeader
        title="Events"
        lead="Webinars, workshops and masterclasses. Published events appear on /events with a registration form."
        action={
          <Button asChild>
            <Link to="/admin/events/new">
              <Plus className="h-4 w-4" /> New event
            </Link>
          </Button>
        }
      />
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <ErrorNote error={q.error} />
      ) : (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Coming up</h2>
            {upcoming.length ? table(upcoming) : <p className="text-muted-foreground">Nothing scheduled. Create your first event.</p>}
          </section>
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Past</h2>
              {table(past)}
            </section>
          )}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------- editor

const blank = (): EventInput => ({
  slug: "",
  title: "",
  kind: "webinar",
  summary: "",
  description: "",
  starts_at: "",
  ends_at: null,
  location_type: "online",
  venue: "",
  join_url: "",
  image_url: null,
  capacity: null,
  price_ngn: 0,
  payment_instructions: lastPaymentInstructions(),
  status: "draft",
});

const pick = (e: EventRecord): EventInput => ({
  slug: e.slug,
  title: e.title,
  kind: e.kind,
  summary: e.summary,
  description: e.description,
  starts_at: e.starts_at,
  ends_at: e.ends_at,
  location_type: e.location_type,
  venue: e.venue,
  join_url: e.join_url,
  image_url: e.image_url,
  capacity: e.capacity,
  price_ngn: e.price_ngn,
  payment_instructions: e.payment_instructions,
  status: e.status,
});

function EventForm({ initial, id, onSaved }: { initial: EventInput; id?: string; onSaved: (id: string) => void }) {
  const [f, setF] = useState<EventInput>(initial);
  const [slugTouched, setSlugTouched] = useState(!!id);
  useEffect(() => setF(initial), [initial]);
  const set = <K extends keyof EventInput>(k: K, v: EventInput[K]) => setF((x) => ({ ...x, [k]: v }));
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: (status: EventInput["status"]) => adminApi.saveEvent(id, { ...f, status }),
    onSuccess: (r) => {
      try {
        if (f.payment_instructions) localStorage.setItem(PAYMENT_KEY, f.payment_instructions);
      } catch {
        /* storage unavailable: nothing to remember */
      }
      qc.invalidateQueries({ queryKey: ["admin"] });
      onSaved(r.id);
    },
  });

  const cancelled = initial.status === "cancelled";
  const durationMin = f.starts_at && f.ends_at ? Math.round((Date.parse(f.ends_at) - Date.parse(f.starts_at)) / 60000) : null;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(f.status === "published" ? "published" : "draft");
      }}
    >
      <Panel title="The event">
        <div className="grid gap-4">
          <FieldRow label="Title">
            <TextInput
              value={f.title}
              disabled={cancelled}
              onChange={(v) => setF((x) => ({ ...x, title: v, slug: slugTouched ? x.slug : slugify(v) }))}
            />
          </FieldRow>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Type">
              <select value={f.kind} disabled={cancelled} onChange={(e) => set("kind", e.target.value as EventInput["kind"])} className={cn(selectClass, "w-full")}>
                {EVENT_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABEL[k]}
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Web address" hint={`/events/${f.slug || "…"}`}>
              <TextInput
                value={f.slug}
                disabled={cancelled}
                onChange={(v) => {
                  setSlugTouched(true);
                  set("slug", slugify(v));
                }}
              />
            </FieldRow>
          </div>
          <FieldRow label="Summary" hint="One or two lines, shown on the events list">
            <TextArea value={f.summary} rows={2} onChange={(v) => set("summary", v)} />
          </FieldRow>
          <FieldRow label="Full description" hint="What it covers, who it's for, who's speaking. Blank lines start new paragraphs.">
            <TextArea value={f.description} rows={8} onChange={(v) => set("description", v)} />
          </FieldRow>
        </div>
      </Panel>

      <Panel title="When and where">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Starts" hint="Lagos time (WAT)">
              <TextInput
                type="datetime-local"
                className="[color-scheme:dark]"
                value={toWatInput(f.starts_at || null)}
                disabled={cancelled}
                onChange={(v) => set("starts_at", fromWatInput(v))}
              />
            </FieldRow>
            <FieldRow label="Ends" hint={durationMin && durationMin > 0 ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m long` : "Optional"}>
              <TextInput
                type="datetime-local"
                className="[color-scheme:dark]"
                value={toWatInput(f.ends_at)}
                disabled={cancelled}
                onChange={(v) => set("ends_at", v ? fromWatInput(v) : null)}
              />
            </FieldRow>
          </div>
          <FieldRow label="Format">
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  disabled={cancelled}
                  onClick={() => set("location_type", t)}
                  className={cn("border px-3 py-2 text-sm", f.location_type === t ? "border-primary bg-primary/10 text-primary" : "border-border/60 hover:border-primary/60")}
                >
                  {LOCATION_LABEL[t]}
                </button>
              ))}
            </div>
          </FieldRow>
          {f.location_type !== "in_person" && (
            <FieldRow label="Join link" hint="Zoom, Google Meet, YouTube Live… Sent only to confirmed registrants, never shown publicly.">
              <TextInput value={f.join_url} placeholder="https://" onChange={(v) => set("join_url", v)} />
            </FieldRow>
          )}
          {f.location_type !== "online" && (
            <FieldRow label="Venue" hint="Address and any directions">
              <TextArea value={f.venue} rows={2} onChange={(v) => set("venue", v)} />
            </FieldRow>
          )}
        </div>
      </Panel>

      <Panel title="Places and price">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Places" hint="Leave empty for no limit">
              <TextInput
                type="number"
                min={1}
                value={f.capacity == null ? "" : String(f.capacity)}
                onChange={(v) => set("capacity", v ? Math.max(1, Math.round(Number(v))) : null)}
              />
            </FieldRow>
            <FieldRow label="Price (₦)" hint="0 for a free event">
              <TextInput type="number" min={0} step={500} value={String(f.price_ngn)} onChange={(v) => set("price_ngn", Math.max(0, Math.round(Number(v) || 0)))} />
            </FieldRow>
          </div>
          {f.price_ngn > 0 && (
            <FieldRow
              label="How to pay"
              hint="Bank name, account name and number, or other ways to pay. Sent by email with each person's reference; not shown on the website."
            >
              <TextArea value={f.payment_instructions} rows={4} onChange={(v) => set("payment_instructions", v)} />
            </FieldRow>
          )}
        </div>
      </Panel>

      <Panel title="Image">
        <div className="max-w-md">
          <ImageInput folder="events" url={f.image_url ?? undefined} fallback={undefined} onChange={(u) => set("image_url", u ?? null)} />
          <p className="mt-2 text-xs text-muted-foreground">Optional. Landscape works best (16 by 10).</p>
        </div>
      </Panel>

      {!cancelled && (
        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <p className="mr-auto text-sm">
            {save.error ? (
              <span className="text-destructive">{(save.error as Error).message}</span>
            ) : dirty ? (
              <span className="text-secondary">Unsaved changes</span>
            ) : initial.status === "published" ? (
              <span className="text-primary">Live on the website</span>
            ) : (
              <span className="text-muted-foreground">Draft: not on the website yet</span>
            )}
          </p>
          {initial.status === "published" ? (
            <>
              <Button type="button" variant="ghost" size="sm" disabled={save.isPending} onClick={() => save.mutate("draft")}>
                Unpublish
              </Button>
              <Button type="button" size="sm" disabled={save.isPending || !dirty} onClick={() => save.mutate("published")}>
                {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" size="sm" disabled={save.isPending || (!dirty && !!id)} onClick={() => save.mutate("draft")}>
                Save draft
              </Button>
              <Button type="button" size="sm" disabled={save.isPending} onClick={() => save.mutate("published")}>
                {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
              </Button>
            </>
          )}
        </div>
      )}
    </form>
  );
}

// ---------------------------------------------------------------- registrations

const REG_TONE: Record<RegistrationStatus, string> = {
  pending_payment: "border-secondary/60 text-secondary",
  confirmed: "border-primary/50 text-primary",
  attended: "border-emerald-400/50 text-emerald-300",
  no_show: "border-border/60 text-muted-foreground",
  cancelled: "border-border/60 text-muted-foreground line-through",
};

function csv(rows: Registration[], event: EventRecord) {
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["Name", "Email", "Phone", "Organisation", "Status", "Reference", "Paid (₦)", "Registered", "Note"].map(cell).join(","),
    ...rows.map((r) =>
      [r.name, r.email, r.phone, r.organisation, REGISTRATION_LABEL[r.status], r.reference, r.paid_amount, fmtDate(r.created_at, true), r.note].map(cell).join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${event.slug}-registrations.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Registrations({ event, rows }: { event: EventRecord; rows: Registration[] }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<RegistrationStatus | "">("");
  const [copied, setCopied] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const update = useMutation({
    mutationFn: (v: { id: string; status: RegistrationStatus; paid?: number }) => adminApi.updateRegistration(v.id, v.status, v.paid),
    onSuccess: refresh,
  });
  const resend = useMutation({ mutationFn: (id: string) => adminApi.resendRegistration(id) });

  const counts = useMemo(() => {
    const c: Partial<Record<RegistrationStatus, number>> = {};
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const shown = filter ? rows.filter((r) => r.status === filter) : rows;
  const past = isPast(event);
  const received = rows.reduce((n, r) => n + (r.paid_amount ?? 0), 0);

  const markPaid = (r: Registration) => {
    const answer = window.prompt(`Mark ${r.name} (${r.reference}) as paid. Amount received in naira:`, String(event.price_ngn));
    if (answer === null) return;
    const paid = Math.round(Number(answer.replace(/[^\d.]/g, "")));
    if (!Number.isFinite(paid)) return;
    update.mutate({ id: r.id, status: "confirmed", paid });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setFilter("")} className={cn("border px-3 py-1.5 text-sm", !filter ? "border-primary text-primary" : "border-border/60 text-muted-foreground")}>
          All {rows.length}
        </button>
        {REGISTRATION_STATUSES.filter((s) => counts[s]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn("border px-3 py-1.5 text-sm", filter === s ? "border-primary text-primary" : "border-border/60 text-muted-foreground")}
          >
            {REGISTRATION_LABEL[s]} {counts[s]}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!rows.length}
            onClick={async () => {
              const emails = rows.filter((r) => r.status !== "cancelled").map((r) => r.email).join(", ");
              try {
                await navigator.clipboard.writeText(emails);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                window.prompt("Copy these emails:", emails);
              }
            }}
          >
            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy emails"}
          </Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => csv(rows, event)}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      {event.price_ngn > 0 && (
        <p className="text-sm text-muted-foreground">
          Received so far: <span className="text-foreground">{fmtNaira(received)}</span>
          {counts.pending_payment ? ` · ${counts.pending_payment} still to pay` : ""}
        </p>
      )}
      {(update.error || resend.error) && <p className="text-sm text-destructive">{((update.error ?? resend.error) as Error).message}</p>}

      {shown.length === 0 ? (
        <p className="py-8 text-muted-foreground">{rows.length ? "Nobody with this status." : "No registrations yet. Share the event page to get the word out."}</p>
      ) : (
        <ul className="divide-y divide-border/40 border border-border/60">
          {shown.map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-foreground">
                  {r.name}
                  {r.organisation && <span className="text-muted-foreground"> · {r.organisation}</span>}
                </p>
                <p className="text-sm text-muted-foreground">
                  {r.email}
                  {r.phone ? ` · ${r.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.reference} · registered {ago(r.created_at)}
                  {r.paid_amount != null ? ` · paid ${fmtNaira(r.paid_amount)}` : ""}
                  {r.lead_id && (
                    <>
                      {" · "}
                      <Link to={`/admin/leads/${r.lead_id}`} className="text-primary hover:underline">
                        lead
                      </Link>
                    </>
                  )}
                </p>
                {r.note && <p className="mt-1 max-w-xl border-l-2 border-border pl-2 text-sm text-foreground/80">{r.note}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("inline-block whitespace-nowrap border px-2 py-0.5 text-xs", REG_TONE[r.status])}>{REGISTRATION_LABEL[r.status]}</span>
                {r.status === "pending_payment" && (
                  <Button size="sm" disabled={update.isPending} onClick={() => markPaid(r)}>
                    Mark paid
                  </Button>
                )}
                {past && (r.status === "confirmed" || r.status === "no_show" || r.status === "attended") && (
                  <select
                    aria-label={`Attendance for ${r.name}`}
                    value={r.status}
                    onChange={(e) => update.mutate({ id: r.id, status: e.target.value as RegistrationStatus })}
                    className={cn(selectClass, "h-8")}
                  >
                    <option value="confirmed">Not marked</option>
                    <option value="attended">Attended</option>
                    <option value="no_show">Didn't attend</option>
                  </select>
                )}
                {(r.status === "confirmed" || r.status === "pending_payment") && !past && (
                  <button
                    title="Email them their details again"
                    disabled={resend.isPending}
                    onClick={() => resend.mutate(r.id)}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                )}
                {r.status !== "cancelled" ? (
                  <button
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (window.confirm(`Cancel ${r.name}'s registration? This frees their place. They aren't emailed.`))
                        update.mutate({ id: r.id, status: "cancelled" });
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => update.mutate({ id: r.id, status: event.price_ngn > 0 ? "pending_payment" : "confirmed" })}
                  >
                    Restore
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- page

export function EventEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "event", id], queryFn: () => adminApi.event(id!), enabled: !isNew });
  const [tab, setTab] = useState<"details" | "people">("details");
  const initial = useMemo(() => (isNew ? blank() : q.data ? pick(q.data.event) : null), [isNew, q.data]);

  const cancel = useMutation({
    mutationFn: (message: string) => adminApi.cancelEvent(id!, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  if (!isNew && q.isLoading) return <Loading />;
  if (!isNew && q.error) return <ErrorNote error={q.error} />;
  const event = q.data?.event;
  const rows = q.data?.registrations ?? [];

  return (
    <>
      <Link to="/admin/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>
      <div className="mt-4">
        <PageHeader
          title={isNew ? "New event" : event!.title}
          lead={event ? `${fmtEventWhen(event)} · ${fmtPrice(event.price_ngn)}` : "Save it as a draft first if you're not ready to publish."}
          action={
            event && (
              <div className="flex flex-wrap items-center gap-3">
                <EventBadge e={event} />
                {event.status === "published" && (
                  <a
                    href={`/events/${event.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" /> View page
                  </a>
                )}
              </div>
            )
          }
        />
      </div>

      {!isNew && (
        <div role="tablist" className="mt-6 flex gap-1 border-b border-border/40">
          {(
            [
              ["details", "Details"],
              ["people", `Registrations (${rows.filter((r) => r.status !== "cancelled").length})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                "border-b-2 px-3 py-2 text-sm",
                tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {tab === "people" && event ? (
          <Registrations event={event} rows={rows} />
        ) : (
          initial && (
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
              <EventForm
                initial={initial}
                id={isNew ? undefined : id}
                onSaved={(newId) => {
                  if (isNew) navigate(`/admin/events/${newId}`, { replace: true });
                }}
              />
              <div className="space-y-8">
                <Panel title="How it works">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Published events appear on /events with a registration form.</li>
                    <li>Free events confirm people at once and email them the join link.</li>
                    <li>Paid events email the payment details and a reference. When the transfer arrives, mark them paid under Registrations and they get the join link.</li>
                    <li>Reminders go out automatically the day before (or the morning of).</li>
                    <li>Everyone who registers also appears in Leads.</li>
                  </ul>
                </Panel>
                {event && event.status !== "cancelled" && !isPast(event) && (
                  <Panel title="Cancel event">
                    <p className="mb-3 text-sm text-muted-foreground">Takes it off the website and emails everyone registered.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={cancel.isPending}
                      onClick={() => {
                        const msg = window.prompt("Cancel this event? Everyone registered will be emailed. Add a short message for them (optional):", "");
                        if (msg !== null) cancel.mutate(msg);
                      }}
                    >
                      {cancel.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel event"}
                    </Button>
                    {cancel.data && <p className="mt-2 text-sm text-muted-foreground">Cancelled. {cancel.data.emailed} people emailed.</p>}
                    {cancel.error && <p className="mt-2 text-sm text-destructive">{(cancel.error as Error).message}</p>}
                  </Panel>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
