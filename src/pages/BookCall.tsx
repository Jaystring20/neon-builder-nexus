import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import FocusedShell from "@/components/layout/FocusedShell";
import CalendlyEmbed from "@/components/booking/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calendlyUrl } from "@/lib/booking";
import {
  BUDGETS,
  CLIENT_TYPES,
  CURRENCIES,
  NEEDS,
  TIMELINES,
  routeLead,
  type Choice,
  type Currency,
  type LeadIntake,
} from "@/data/leadIntake";

/**
 * Book a call. Three short steps (who you are, the problem, budget and
 * timing), then the calendar with everything prefilled, so DCH walks into
 * every call already knowing the client, the problem and the budget.
 *
 * The intake goes to POST /api/lead (stored, DCH alerted, lead confirmed and
 * nudged). If that request fails, the calendar still opens: a person ready to
 * book should never be blocked by our plumbing.
 */

type Step = 0 | 1 | 2 | 3;
const STEPS = ["You", "The problem", "Budget and timing"];
const STORAGE_KEY = "dch-book-a-call";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const empty: LeadIntake = {
  clientType: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  needs: [],
  problem: "",
  currency: "NGN",
  budget: "",
  timeline: "",
};

const load = (): LeadIntake => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const BookCall = () => {
  const reduce = useReducedMotion();
  const [lead, setLead] = useState<LeadIntake>(load);
  const [step, setStep] = useState<Step>(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    } catch {
      /* storage blocked: fine, just no resume */
    }
  }, [lead]);

  const set = <K extends keyof LeadIntake>(key: K, value: LeadIntake[K]) =>
    setLead((prev) => ({ ...prev, [key]: value }));

  const valid = [
    Boolean(lead.clientType && lead.name.trim() && emailOk(lead.email)),
    lead.needs.length > 0 && lead.problem.trim().length >= 10,
    Boolean(lead.budget && lead.timeline),
  ];

  const route = useMemo(() => routeLead({ ...lead, name: lead.name.trim(), email: lead.email.trim() }), [lead]);
  const bookingUrl = useMemo(
    () => calendlyUrl("intro", { name: lead.name.trim(), email: lead.email.trim(), notes: route.summary }),
    [lead.name, lead.email, route.summary],
  );

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, website: honeypot }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 400 && body?.error) {
        setError(body.error);
        return;
      }
      if (!res.ok || !body?.success) console.error("Lead not saved", res.status, body);
      else setSaved(true);
    } catch (err) {
      console.error("Lead not sent", err);
    } finally {
      setSending(false);
    }
    // Saved or not, they're ready to book: show the calendar.
    setStep(3);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const next = () => {
    if (!valid[step as 0 | 1 | 2]) return;
    if (step === 2) void submit();
    else setStep((s) => (s + 1) as Step);
  };

  return (
    <FocusedShell>
      <SEO
        title="Book a call"
        description="Tell us about you and the problem in three short steps, then pick a time. We read everything before the call."
        path="/book"
      />
      <div className="mx-auto w-full max-w-2xl">
        {step < 3 ? (
          <>
            <p className="text-sm font-medium text-primary">Book a call</p>
            <h1 className="font-display-refined mt-4 text-balance text-[2.4rem] leading-[1.04] text-foreground sm:text-5xl">
              {step === 0 && "First, a little about you."}
              {step === 1 && "What do you want to move?"}
              {step === 2 && "Budget and timing."}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {step === 0 && "Three short steps, then you pick a time. We read everything before we talk."}
              {step === 1 && "The more specific, the more useful the call."}
              {step === 2 && "A range is fine. It helps us suggest the right size of first step."}
            </p>

            <ol className="mt-8 flex gap-2" aria-label="Progress">
              {STEPS.map((label, i) => (
                <li key={label} className="flex-1">
                  <span className={cn("block h-1", i <= step ? "bg-primary" : "bg-border/60")} />
                  <span className={cn("mt-2 block text-xs", i === step ? "text-foreground" : "text-muted-foreground")}>
                    {label}
                  </span>
                </li>
              ))}
            </ol>

            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-10 space-y-8"
            >
              {step === 0 && (
                <>
                  <Field label="I am">
                    <ChoiceGrid
                      choices={CLIENT_TYPES}
                      isSelected={(v) => lead.clientType === v}
                      onPick={(v) => set("clientType", v)}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" htmlFor="name">
                      <TextInput id="name" value={lead.name} onChange={(v) => set("name", v)} autoComplete="name" />
                    </Field>
                    <Field label="Email" htmlFor="email">
                      <TextInput
                        id="email"
                        type="email"
                        value={lead.email}
                        onChange={(v) => set("email", v)}
                        autoComplete="email"
                      />
                    </Field>
                    <Field label="Company or organisation" htmlFor="company" optional>
                      <TextInput
                        id="company"
                        value={lead.company ?? ""}
                        onChange={(v) => set("company", v)}
                        autoComplete="organization"
                      />
                    </Field>
                    <Field label="Phone or WhatsApp" htmlFor="phone" optional>
                      <TextInput id="phone" type="tel" value={lead.phone ?? ""} onChange={(v) => set("phone", v)} autoComplete="tel" />
                    </Field>
                  </div>
                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute left-[-9999px] h-px w-px opacity-0"
                    name="website"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="Where do you need help?" hint="Pick all that apply.">
                    <ChoiceGrid
                      multi
                      choices={NEEDS}
                      isSelected={(v) => lead.needs.includes(v)}
                      onPick={(v) =>
                        set(
                          "needs",
                          lead.needs.includes(v) ? lead.needs.filter((n) => n !== v) : [...lead.needs, v],
                        )
                      }
                    />
                  </Field>
                  <Field label="What's the problem you want solved?" htmlFor="problem">
                    <textarea
                      id="problem"
                      rows={5}
                      value={lead.problem}
                      onChange={(e) => set("problem", e.target.value)}
                      placeholder="We get traffic but few enquiries, and our team spends hours on manual follow-up."
                      className="w-full border border-border/60 bg-card/40 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                    />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Budget for this">
                    <div className="mb-3 inline-flex border border-border/60" role="radiogroup" aria-label="Currency">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={lead.currency === c}
                          onClick={() => set("currency", c as Currency)}
                          className={cn(
                            "px-4 py-2 text-sm",
                            lead.currency === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <ChoiceGrid
                      choices={BUDGETS[lead.currency]}
                      isSelected={(v) => lead.budget === v}
                      onPick={(v) => set("budget", v)}
                    />
                  </Field>
                  <Field label="When do you want to start?">
                    <ChoiceGrid
                      choices={TIMELINES}
                      isSelected={(v) => lead.timeline === v}
                      onPick={(v) => set("timeline", v)}
                    />
                  </Field>
                </>
              )}
            </motion.div>

            {error && (
              <p role="alert" className="mt-6 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-10 flex items-center gap-3 border-t border-border/40 pt-6">
              {step > 0 ? (
                <Button type="button" variant="ghost" size="lg" className="px-4" onClick={() => setStep((s) => (s - 1) as Step)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Link to="/discovery" className="text-sm text-muted-foreground hover:text-foreground">
                  Not ready to talk? <span className="font-medium text-foreground">Take the discovery.</span>
                </Link>
              )}
              <Button
                type="button"
                variant="action"
                size="lg"
                className="group ml-auto"
                disabled={!valid[step as 0 | 1 | 2] || sending}
                onClick={next}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {step === 2 ? "Choose a time" : "Next"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm font-medium text-primary">Last step</p>
            <h1 className="font-display-refined mt-4 text-balance text-[2.4rem] leading-[1.04] text-foreground sm:text-5xl">
              Pick a time, {lead.name.trim().split(/\s+/)[0]}.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Your answers are already with us, so the call starts where it should: with your problem.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-border/40 py-4 text-sm">
              <span>
                <span className="text-muted-foreground">Likely fit: </span>
                <span className="text-foreground">{route.practiceTitle}</span>
              </span>
              {saved && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Confirmation on its way to {lead.email.trim()}
                </span>
              )}
            </div>
            <div className="mt-8">
              <CalendlyEmbed url={bookingUrl} title="Book a call with DCH" />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground"
            >
              Change my answers
            </button>
          </div>
        )}
      </div>
    </FocusedShell>
  );
};

/* ---------------------------------------------------------------------- */

const Field = ({
  label,
  hint,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-base font-medium text-foreground">
      {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
    </label>
    {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    <div className="mt-3">{children}</div>
  </div>
);

const TextInput = ({
  id,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) => (
  <input
    id={id}
    type={type}
    value={value}
    autoComplete={autoComplete}
    onChange={(e) => onChange(e.target.value)}
    className="h-12 w-full border border-border/60 bg-card/40 px-4 text-base text-foreground focus:border-primary focus:outline-none"
  />
);

const ChoiceGrid = ({
  choices,
  isSelected,
  onPick,
  multi,
}: {
  choices: Choice[];
  isSelected: (v: string) => boolean;
  onPick: (v: string) => void;
  multi?: boolean;
}) => (
  <div role={multi ? "group" : "radiogroup"} className="grid gap-2 sm:grid-cols-2">
    {choices.map((c) => {
      const on = isSelected(c.value);
      return (
        <button
          key={c.value}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={on}
          onClick={() => onPick(c.value)}
          className={cn(
            "flex items-center gap-3 border px-4 py-3 text-left text-sm transition-colors",
            on
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border/60 bg-card/40 text-foreground/90 hover:border-primary/50 hover:bg-card/70",
          )}
        >
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center border",
              multi ? "" : "rounded-full",
              on ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            {on && <Check className="h-3 w-3" />}
          </span>
          {c.label}
        </button>
      );
    })}
  </div>
);

export default BookCall;
