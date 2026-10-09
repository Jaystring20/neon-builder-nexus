import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Loader2, MapPin, Monitor, Users } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  KIND_LABEL,
  LOCATION_LABEL,
  calendarLink,
  fmtEventDate,
  fmtEventTime,
  fmtEventWhen,
  fmtNaira,
  fmtPrice,
  isPast,
  type PublicEvent,
} from "@/data/events";

// Events published from /admin (Phase 3). The list and each event page read
// GET /api/events; registering POSTs to it. Join links and payment details
// only ever travel by email.

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "Something went wrong."), { status: res.status });
  return data as T;
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

const Meta = ({ e, className }: { e: PublicEvent; className?: string }) => (
  <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground", className)}>
    <li className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-primary" />
      {fmtEventDate(e.starts_at)}, {fmtEventTime(e.starts_at)} WAT
    </li>
    <li className="flex items-center gap-2">
      {e.location_type === "online" ? <Monitor className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
      {LOCATION_LABEL[e.location_type]}
    </li>
    <li className="text-foreground">{fmtPrice(e.price_ngn)}</li>
  </ul>
);

// ---------------------------------------------------------------- list

export function EventsPage() {
  const q = useQuery({ queryKey: ["events"], queryFn: () => getJson<{ events: PublicEvent[] }>("/api/events") });
  const upcoming = (q.data?.events ?? []).filter((e) => !isPast(e));
  const past = (q.data?.events ?? []).filter((e) => isPast(e)).reverse();

  return (
    <Shell>
      <SEO title="Events" description="Webinars, workshops and masterclasses from Digital Creatives Hub, on brand, growth, platforms and AI." path="/events" />
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="blueprint-grid" />
        <div className="container-narrow relative z-10">
          <h1 className="font-display-refined hero-animate max-w-4xl text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
            Learn it live. <span className="text-primary">Build it after.</span>
          </h1>
          <p className="hero-animate mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "120ms" }}>
            Webinars, workshops and masterclasses on brand, growth, platforms and AI.
          </p>
        </div>
      </section>

      <section className="border-t border-border/40 py-16 md:py-24">
        <div className="container-narrow">
          {q.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading events
            </div>
          ) : q.error ? (
            <p className="text-muted-foreground">Events couldn't load just now. Please refresh in a moment.</p>
          ) : upcoming.length === 0 ? (
            <div className="max-w-xl">
              <h2 className="font-display-refined text-3xl text-foreground">Nothing on the calendar right now.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                New sessions are announced here first. In the meantime, find out where your business stands.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/diagnostic">
                  Take the free diagnostic <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {upcoming.map((e) => (
                <li key={e.slug} className="group relative flex flex-col border border-border/60 bg-card/40 transition-colors hover:border-primary/60">
                  {e.image_url && (
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60">
                      <img src={e.image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-medium text-primary">{KIND_LABEL[e.kind]}</p>
                    <h2 className="mt-2 font-display-refined text-2xl leading-tight text-foreground sm:text-3xl">
                      <Link to={`/events/${e.slug}`} className="after:absolute after:inset-0">
                        {e.title}
                      </Link>
                    </h2>
                    {e.summary && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{e.summary}</p>}
                    <Meta e={e} className="mt-auto pt-6" />
                    {e.spots_left === 0 && <p className="mt-3 text-sm text-secondary">Fully booked</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {past.length > 0 && (
            <div className="mt-20">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Recent</h2>
              <ul className="mt-4 divide-y divide-border/40 border-y border-border/40">
                {past.map((e) => (
                  <li key={e.slug} className="flex flex-wrap justify-between gap-2 py-4 text-sm">
                    <span className="text-foreground">{e.title}</span>
                    <span className="text-muted-foreground">
                      {KIND_LABEL[e.kind]} · {fmtEventDate(e.starts_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

// ---------------------------------------------------------------- one event

interface RegisterResult {
  status: "confirmed" | "pending_payment";
  already?: boolean;
  reference?: string;
  payment_instructions?: string;
  price_ngn: number;
  emailed?: boolean;
}

const inputClass =
  "h-12 w-full border border-border/60 bg-card/40 px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";

function RegisterForm({ event }: { event: PublicEvent }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", organisation: "", note: "", website: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events?slug=${encodeURIComponent(event.slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't register you just now. Please try again.");
      return data as RegisterResult;
    },
  });
  useEffect(() => {
    if (submit.isSuccess) document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submit.isSuccess]);

  if (submit.data) {
    const r = submit.data;
    return r.status === "pending_payment" ? (
      <div>
        <p className="text-sm font-medium text-secondary">One more step</p>
        <h2 className="mt-2 font-display-refined text-3xl text-foreground">Your place is held.</h2>
        <p className="mt-4 text-muted-foreground">To confirm it, pay {fmtNaira(r.price_ngn)} and quote your reference.</p>
        {r.payment_instructions && (
          <div className="mt-6 border border-border/60 bg-card/40 p-5">
            <p className="text-sm text-muted-foreground">How to pay</p>
            <p className="mt-2 whitespace-pre-line text-foreground">{r.payment_instructions}</p>
          </div>
        )}
        {r.reference && (
          <p className="mt-6 text-foreground">
            Your reference: <span className="font-mono text-xl tracking-wider text-secondary">{r.reference}</span>
          </p>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          {r.emailed === false ? "" : "We've emailed you these details too. "}Once we've matched your payment, you'll get your confirmation and joining details by email.
        </p>
      </div>
    ) : (
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Check className="h-4 w-4" /> {r.already ? "Already registered" : "You're in"}
        </p>
        <h2 className="mt-2 font-display-refined text-3xl text-foreground">See you there.</h2>
        <p className="mt-4 text-muted-foreground">
          {r.already ? "We've sent your details to your email again." : "Your confirmation is on its way to your email"}
          {event.location_type !== "in_person" ? ", with the join link." : "."} We'll remind you the day before.
        </p>
        <a
          href={calendarLink(event, `https://www.digitalcreativeshubltd.com/events/${event.slug}`)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <CalendarDays className="h-4 w-4" /> Add to Google Calendar
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        submit.mutate();
      }}
      className="space-y-4"
    >
      <h2 className="font-display-refined text-3xl text-foreground">Save your place</h2>
      <p className="text-sm text-muted-foreground">
        {event.price_ngn > 0 ? `${fmtNaira(event.price_ngn)}. Pay by bank transfer after registering.` : "Free."}
        {event.spots_left != null && event.spots_left <= 20 ? ` ${event.spots_left} ${event.spots_left === 1 ? "place" : "places"} left.` : ""}
      </p>
      <input aria-label="Full name" required placeholder="Full name" autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
      <input aria-label="Email" required type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
      <div className="grid gap-4">
        <input aria-label="Phone or WhatsApp (optional)" placeholder="Phone / WhatsApp (optional)" autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputClass} />
        <input aria-label="Organisation (optional)" placeholder="Organisation (optional)" autoComplete="organization" value={form.organisation} onChange={set("organisation")} className={inputClass} />
      </div>
      <textarea
        aria-label="Anything you'd like us to cover? (optional)"
        placeholder="Anything you'd like us to cover? (optional)"
        rows={3}
        value={form.note}
        onChange={set("note")}
        className={cn(inputClass, "h-auto py-3")}
      />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")} className="absolute left-[-9999px] h-px w-px opacity-0" />
      {submit.error && (
        <p role="alert" className="text-sm text-destructive">
          {(submit.error as Error).message}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={submit.isPending}>
        {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : event.price_ngn > 0 ? "Register and get payment details" : "Register"}
      </Button>
    </form>
  );
}

export function EventPage() {
  const { slug = "" } = useParams();
  const q = useQuery({
    queryKey: ["event", slug],
    queryFn: () => getJson<{ event: PublicEvent }>(`/api/events?slug=${encodeURIComponent(slug)}`),
    retry: (n, err) => (err as { status?: number }).status !== 404 && n < 1,
  });
  const e = q.data?.event;

  if (q.isLoading)
    return (
      <Shell>
        <div className="container-narrow flex items-center gap-2 pt-40 pb-32 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading
        </div>
      </Shell>
    );

  if (!e)
    return (
      <Shell>
        <div className="container-narrow pt-40 pb-32">
          <h1 className="font-display-refined text-4xl text-foreground">We couldn't find that event.</h1>
          <Link to="/events" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> See all events
          </Link>
        </div>
      </Shell>
    );

  const past = isPast(e);
  const closed = e.status === "cancelled" || past || e.spots_left === 0;

  return (
    <Shell>
      <SEO title={e.title} description={e.summary || `${KIND_LABEL[e.kind]} from Digital Creatives Hub, ${fmtEventWhen(e)}.`} path={`/events/${e.slug}`} image={e.image_url ?? undefined} />
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="blueprint-grid" />
        <div className="container-narrow relative z-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <p className="mt-8 text-sm font-medium text-primary">{KIND_LABEL[e.kind]}</p>
          <h1 className="mt-3 max-w-4xl font-display-refined text-balance text-[2.4rem] leading-[1.04] text-foreground sm:text-6xl">{e.title}</h1>
          {e.summary && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{e.summary}</p>}
          <Meta e={e} className="mt-8" />
        </div>
      </section>

      <section className="border-t border-border/40 py-16 md:py-20">
        <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_26rem]">
          <div className="min-w-0">
            {e.image_url && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-border/60">
                <img src={e.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-foreground/90">
              {e.description
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
            </div>
            <dl className="mt-10 grid max-w-2xl gap-4 border-t border-border/40 pt-8 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">When</dt>
                <dd className="mt-1 text-foreground">{fmtEventWhen(e)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Where</dt>
                <dd className="mt-1 whitespace-pre-line text-foreground">
                  {e.location_type === "online" ? "Online. The link comes by email once you're confirmed." : e.venue || LOCATION_LABEL[e.location_type]}
                </dd>
              </div>
              {e.spots_left != null && !closed && (
                <div>
                  <dt className="text-muted-foreground">Places</dt>
                  <dd className="mt-1 flex items-center gap-2 text-foreground">
                    <Users className="h-4 w-4 text-primary" /> {e.spots_left} left
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <aside id="register" className="scroll-mt-28 self-start border border-border/60 bg-card/40 p-6 lg:sticky lg:top-28">
            {e.status === "cancelled" ? (
              <p className="text-foreground">This event has been cancelled.</p>
            ) : past ? (
              <p className="text-foreground">This event has taken place.</p>
            ) : e.spots_left === 0 ? (
              <p className="text-foreground">This event is fully booked.</p>
            ) : (
              <RegisterForm event={e} />
            )}
            {closed && (
              <Link to="/events" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                See other events <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </aside>
        </div>
      </section>
    </Shell>
  );
}
