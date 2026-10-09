import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { questions, labelFor, type DiscoveryQuestion } from "@/data/discoveryQuestions";
import { calculateSegment, SEGMENT_PROFILES, type DiscoveryAnswers, type SegmentResult } from "@/data/segmentLogic";
import { serviceCategories } from "@/data/services";
import { calendlyUrl } from "@/lib/booking";
import { matchOffer, offerLine, priceRange, SHOW_PRICES, TIER_LABEL } from "@/data/offerMatch";
import CalendlyEmbed from "@/components/booking/CalendlyEmbed";
import discoveryCallQr from "@/assets/qr/discovery-call.svg";

/**
 * The discovery: twelve questions, then a result the visitor sees straight
 * away, with Book a call as the main next step and the emailed breakdown as
 * the second. Answers persist in this browser so a refresh doesn't lose them.
 *
 * Questions and their ids live in src/data/discoveryQuestions.ts; scoring is
 * segmentLogic.ts; POST /api/discovery saves and sends the emails.
 */

type Answers = Record<string, unknown>;
type Stage = "intro" | "questions" | "result";

const STORAGE_KEY = "dch-discovery";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const loadSaved = (): { answers: Answers; index: number; stage: Stage } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isAnswered = (q: DiscoveryQuestion, value: unknown) => {
  if (q.type === "multi_select") return Array.isArray(value) && value.length > 0;
  if (q.type === "text_input") return typeof value === "string" && value.trim().length > 0;
  return value !== undefined && value !== null && value !== "";
};

const DiscoveryFlow = () => {
  const reduce = useReducedMotion();
  const saved = useMemo(loadSaved, []);
  const [answers, setAnswers] = useState<Answers>(saved?.answers ?? {});
  const [index, setIndex] = useState(saved?.index ?? 0);
  const [stage, setStage] = useState<Stage>(saved?.stage ?? "intro");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, stage }));
    } catch {
      /* private mode or storage blocked: the flow still works, it just won't resume */
    }
  }, [answers, index, stage]);

  const q = questions[index];
  const answer = answers[q.id];
  const followUpShown = Boolean(q.followUp && q.followUpTrigger?.(answer));
  const canContinue = isAnswered(q, answer);
  const isLast = index === questions.length - 1;

  const setAnswer = useCallback((id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const next = useCallback(() => {
    if (!canContinue) return;
    if (isLast) {
      setStage("result");
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } else setIndex((i) => i + 1);
  }, [canContinue, isLast, reduce]);

  const back = () => (index === 0 ? setStage("intro") : setIndex((i) => i - 1));

  // Keyboard: number keys pick an option, Enter moves on.
  useEffect(() => {
    if (stage !== "questions") return;
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      // A focused button already handles its own Enter.
      if (e.target instanceof HTMLButtonElement) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        next();
        return;
      }
      if (typing) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      if (q.type === "scale" && q.labels && n <= q.labels.length) setAnswer(q.id, n);
      if (q.type === "single_select" && q.options && n <= q.options.length) setAnswer(q.id, q.options[n - 1].value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, q, next, setAnswer]);

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setStage("intro");
  };

  if (stage === "intro") {
    const resuming = saved && Object.keys(answers).length > 0;
    return (
      <Intro
        resuming={Boolean(resuming)}
        onStart={() => setStage("questions")}
        onRestart={restart}
      />
    );
  }

  if (stage === "result") {
    return (
      <Result
        answers={answers}
        onChange={() => {
          setIndex(0);
          setStage("questions");
        }}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Progress index={index} section={q.section} />

      <motion.div
        key={q.id}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <h1 className="font-display-refined mt-10 text-balance text-3xl leading-[1.08] text-foreground sm:text-4xl">
          {q.question}
        </h1>
        {q.subtitle && <p className="mt-3 text-lg text-muted-foreground">{q.subtitle}</p>}

        <div className="mt-8">
          <AnswerInput q={q} value={answer} onChange={(v) => setAnswer(q.id, v)} />
        </div>

        {followUpShown && q.followUp && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-l-2 border-primary/50 pl-5"
          >
            <p className="text-sm font-medium text-foreground">
              {q.followUp.question} <span className="font-normal text-muted-foreground">(optional)</span>
            </p>
            <div className="mt-3">
              {q.followUp.type === "single_select" && q.followUp.options ? (
                <OptionList
                  options={q.followUp.options}
                  isSelected={(v) => answers[`${q.id}_followup`] === v}
                  onSelect={(v) => setAnswer(`${q.id}_followup`, v)}
                  compact
                />
              ) : (
                <input
                  type="text"
                  value={(answers[`${q.id}_followup`] as string) ?? ""}
                  onChange={(e) => setAnswer(`${q.id}_followup`, e.target.value)}
                  placeholder={q.followUp.placeholder}
                  className="h-12 w-full border border-border/60 bg-card/40 px-4 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
                />
              )}
            </div>
          </motion.div>
        )}

        {q.getInsight && isAnswered(q, answer) && q.getInsight(answer) && (
          <p className="mt-6 text-sm leading-relaxed text-primary">{q.getInsight(answer)}</p>
        )}
      </motion.div>

      <div className="mt-10 flex items-center gap-3 border-t border-border/40 pt-6">
        <Button type="button" variant="ghost" size="lg" onClick={back} className="px-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          variant="action"
          size="lg"
          onClick={next}
          disabled={!canContinue}
          className="group ml-auto"
        >
          {isLast ? "See my result" : "Next"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      <p className="mt-3 hidden text-right text-xs text-muted-foreground sm:block">
        Press Enter to continue{q.type === "single_select" || q.type === "scale" ? ", or a number to choose" : ""}.
      </p>
    </div>
  );
};

/* ---------------------------------------------------------------------- */

const Intro = ({
  resuming,
  onStart,
  onRestart,
}: {
  resuming: boolean;
  onStart: () => void;
  onRestart: () => void;
}) => (
  <div className="mx-auto w-full max-w-2xl">
    <p className="text-sm font-medium text-primary">Growth diagnostic</p>
    <h1 className="font-display-refined mt-4 text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl">
      See where you <span className="text-primary">really stand.</span>
    </h1>
    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
      Twelve questions, about four minutes, before you talk to anyone. You&rsquo;ll see what kind of business
      you&rsquo;re building, what&rsquo;s holding it back, and the right first move.
    </p>
    <ul className="mt-8 space-y-2 text-base text-foreground/90">
      {["Your result on screen, free, no sign-up", "A plain read on your biggest gap", "The programme and way of working that fit"].map(
        (item) => (
          <li key={item} className="flex items-center gap-3">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            {item}
          </li>
        ),
      )}
    </ul>
    <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
      <Button variant="action" size="xl" onClick={onStart} className="group">
        {resuming ? "Continue where I left off" : "Start"}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>
      {resuming && (
        <button type="button" onClick={onRestart} className="text-base text-muted-foreground hover:text-foreground">
          Start over
        </button>
      )}
    </div>
  </div>
);

const Progress = ({ index, section }: { index: number; section: string }) => (
  <div>
    <div className="flex items-baseline justify-between text-sm">
      <span className="font-medium text-primary">{section}</span>
      <span className="tabular-nums text-muted-foreground">
        {String(index + 1).padStart(2, "0")} / {questions.length}
      </span>
    </div>
    <div className="mt-3 flex gap-1" aria-hidden="true">
      {questions.map((_, i) => (
        <span
          key={i}
          className={cn("h-1 flex-1 transition-colors duration-500", i <= index ? "bg-primary" : "bg-border/60")}
        />
      ))}
    </div>
  </div>
);

const OptionList = ({
  options,
  isSelected,
  onSelect,
  compact,
  multi,
}: {
  options: { value: string; label: string }[];
  isSelected: (value: string) => boolean;
  onSelect: (value: string) => void;
  compact?: boolean;
  multi?: boolean;
}) => (
  <div role={multi ? "group" : "radiogroup"} className="space-y-2">
    {options.map((opt, i) => {
      const selected = isSelected(opt.value);
      return (
        <button
          key={opt.value}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={selected}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex w-full items-center gap-4 border text-left transition-colors",
            compact ? "px-4 py-3" : "px-5 py-4",
            selected
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border/60 bg-card/40 text-foreground/90 hover:border-primary/50 hover:bg-card/70",
          )}
        >
          {!compact && (
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center border text-xs tabular-nums",
                selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
              )}
            >
              {selected ? <Check className="h-3.5 w-3.5" /> : multi ? "" : i + 1}
            </span>
          )}
          <span className={compact ? "text-sm" : "text-base"}>{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const AnswerInput = ({
  q,
  value,
  onChange,
}: {
  q: DiscoveryQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
}) => {
  if (q.type === "single_select" && q.options) {
    return <OptionList options={q.options} isSelected={(v) => value === v} onSelect={onChange} />;
  }
  if (q.type === "multi_select" && q.options) {
    const selected = (value as string[]) ?? [];
    const max = q.max ?? Infinity;
    return (
      <>
        <OptionList
          multi
          options={q.options}
          isSelected={(v) => selected.includes(v)}
          onSelect={(v) => {
            if (selected.includes(v)) onChange(selected.filter((x) => x !== v));
            else if (selected.length < max) onChange([...selected, v]);
          }}
        />
        {Number.isFinite(max) && (
          <p className="mt-3 text-sm text-muted-foreground">
            {selected.length} of {max} chosen
          </p>
        )}
      </>
    );
  }
  if (q.type === "scale" && q.labels) {
    const n = Number(value);
    return (
      <div role="radiogroup" className="grid grid-cols-5 gap-2">
        {q.labels.map((label, i) => {
          const selected = n === i + 1;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${i + 1}: ${label}`}
              onClick={() => onChange(i + 1)}
              className={cn(
                "flex flex-col items-center gap-2 border px-1 py-4 transition-colors",
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card/40 hover:border-primary/50 hover:bg-card/70",
              )}
            >
              <span className={cn("font-heading text-2xl tabular-nums", selected ? "text-primary" : "text-foreground")}>
                {i + 1}
              </span>
              <span className="text-center text-xs leading-tight text-muted-foreground">{label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <input
      type="text"
      autoFocus
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder}
      className="h-14 w-full border border-border/60 bg-card/40 px-5 text-lg text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
    />
  );
};

/* ---------------------------------------------------------------------- */

const Result = ({
  answers,
  onChange,
  onRestart,
}: {
  answers: Answers;
  onChange: () => void;
  onRestart: () => void;
}) => {
  const reduce = useReducedMotion();
  const segment: SegmentResult = useMemo(() => calculateSegment(answers as unknown as DiscoveryAnswers), [answers]);
  const profile = SEGMENT_PROFILES[segment.segment as keyof typeof SEGMENT_PROFILES];

  const offer = useMemo(() => matchOffer(segment.segment, answers), [segment.segment, answers]);
  const practices = offer.practices
    .map((s) => serviceCategories.find((c) => c.slug === s))
    .filter((c): c is (typeof serviceCategories)[number] => Boolean(c));

  type RecapRow = { label: string; value: string | null; quoted?: boolean };
  const rows: RecapRow[] = [
    { label: "What you're building", value: labelFor("q2_vision", answers.q2_vision), quoted: true },
    { label: "What's holding you back", value: labelFor("q9_challenge", answers.q9_challenge) },
    { label: "Your 90-day win", value: labelFor("q10_priority", answers.q10_priority), quoted: true },
  ];
  const recap = rows.filter((r): r is RecapRow & { value: string } => Boolean(r.value));

  // The booking carries the result into Calendly, so DCH starts the call informed.
  const [showCalendar, setShowCalendar] = useState(false);
  const bookingUrl = useMemo(
    () =>
      calendlyUrl("discovery", {
        notes: [
          `Discovery result: ${profile?.archetype ?? ""}`,
          offerLine(offer),
          ...recap.map((r) => `${r.label}: ${r.value}`),
        ].join("\n"),
      }),
    [profile, offer, recap],
  );

  const fade = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
  });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.p {...fade(0)} className="text-sm font-medium text-primary">
        Your result
      </motion.p>
      <motion.h1
        {...fade(1)}
        className="font-display-refined mt-4 text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl"
      >
        {profile?.archetype ?? "Your model"}
      </motion.h1>
      <motion.p {...fade(2)} className="mt-6 max-w-2xl text-xl leading-snug text-foreground/90">
        {segment.emailPersonalization.modelDescription}
      </motion.p>
      {profile && (
        <motion.p {...fade(3)} className="mt-4 text-base text-muted-foreground">
          Your next challenge: <span className="text-foreground">{profile.nextChallenge.toLowerCase()}</span>.
        </motion.p>
      )}

      {segment.capabilityGap && (
        <motion.div {...fade(4)} className="mt-10 border-l-2 border-secondary pl-5">
          <p className="text-sm font-medium text-secondary">Worth knowing</p>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/90">{segment.capabilityGap}</p>
        </motion.div>
      )}

      {recap.length > 0 && (
        <motion.dl {...fade(5)} className="mt-12 divide-y divide-border/40 border-y border-border/40">
          {recap.map((r) => (
            <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted-foreground">{r.label}</dt>
              <dd className="text-foreground">{r.quoted ? `“${r.value}”` : r.value}</dd>
            </div>
          ))}
        </motion.dl>
      )}

      {offer.program && (
        <motion.section {...fade(6)} aria-labelledby="path-heading" className="mt-14">
          <p className="text-sm font-medium text-primary">Your path</p>
          <h2 id="path-heading" className="font-display-refined mt-3 text-3xl leading-[1.05] text-foreground sm:text-4xl">
            {offer.program.name}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{offer.program.tagline}</p>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {(["paidProgram", "doneWithYou", "doneForYou"] as const).map((key) => {
              const tier = offer.program![key];
              const best = key === offer.bestTier;
              return (
                <li
                  key={key}
                  className={cn(
                    "relative flex flex-col border p-5",
                    best ? "border-secondary bg-secondary/[0.06]" : "border-border/60 bg-card/40",
                  )}
                >
                  <span className={cn("text-sm font-medium", best ? "text-secondary" : "text-primary")}>
                    {TIER_LABEL[key]}
                    {best && " · Best fit"}
                  </span>
                  <span className="mt-2 font-heading text-lg font-medium leading-snug text-foreground">
                    {tier.name.replace(/^Done (with|for) You:\s*/i, "")}
                  </span>
                  <span className="mt-2 text-sm text-muted-foreground">{tier.duration}</span>
                  {SHOW_PRICES && (
                    <span className="mt-1 text-sm text-foreground">{priceRange(offer.program!, key)}</span>
                  )}
                  <span className="mt-3 text-sm leading-relaxed text-foreground/80">{tier.ideal_for}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 max-w-2xl border-l-2 border-secondary pl-4 text-base text-foreground/90">{offer.reason}</p>

          {practices.length > 0 && (
            <p className="mt-6 text-sm text-muted-foreground">
              Delivered through{" "}
              {practices.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && (i === practices.length - 1 ? " and " : ", ")}
                  <Link to={`/services/${p.slug}`} className="font-medium text-primary hover:text-foreground">
                    {p.title}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </motion.section>
      )}

      <motion.section {...fade(7)} className="mt-14 border-t border-border/40 pt-10">
        <h2 className="font-display-refined text-3xl leading-[1.05] text-foreground sm:text-4xl">
          Start with a discovery call.
        </h2>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          One-on-one. We test this against your real numbers and confirm the right path before anything is sold.
        </p>
        <div className="mt-8">
          {showCalendar ? (
            <CalendlyEmbed url={bookingUrl} title="Book your discovery call" />
          ) : (
            <div className="flex items-center gap-8">
              <Button
                type="button"
                variant="action"
                size="xl"
                className="group w-full sm:w-auto"
                onClick={() => setShowCalendar(true)}
              >
                Book my discovery call
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              {/* For desktop visitors who'd rather book on their phone. */}
              <div className="hidden items-center gap-4 md:flex">
                <img
                  src={discoveryCallQr}
                  alt="QR code to book the discovery call"
                  width={88}
                  height={88}
                  className="h-[88px] w-[88px] bg-white p-1"
                />
                <p className="max-w-[10rem] text-sm leading-snug text-muted-foreground">Or scan to book on your phone.</p>
              </div>
            </div>
          )}
        </div>

        <EmailBreakdown answers={answers} />
      </motion.section>

      <div className="mt-14 flex flex-wrap gap-6 border-t border-border/40 pt-6 text-sm">
        <button type="button" onClick={onChange} className="text-muted-foreground hover:text-foreground">
          Change an answer
        </button>
        <button type="button" onClick={onRestart} className="text-muted-foreground hover:text-foreground">
          Start over
        </button>
      </div>
    </div>
  );
};

const EmailBreakdown = ({ answers }: { answers: Answers }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || state === "sending") return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), answers }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) throw new Error(body?.error ?? "We couldn't save your answers. Please try again.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't reach the server. Please try again.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <p className="mt-10 max-w-xl text-base text-foreground/90" role="status">
        <Check className="mr-2 inline h-4 w-4 text-primary" />
        Your full breakdown is on its way to <span className="font-medium text-foreground">{email.trim()}</span>, with two
        follow-ups over the next few days. Nothing yet? Check spam.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-xl">
      <label htmlFor="discovery-email" className="text-base text-foreground">
        Or get the full breakdown by email
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="discovery-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-invalid={error ? true : undefined}
          className="h-12 flex-1 border border-border/60 bg-card/40 px-4 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
        <Button type="submit" variant="outline" size="lg" disabled={!valid || state === "sending"} className="h-12 shadow-none">
          {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send it"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">Three emails about your result. We never share your address.</p>
    </form>
  );
};

export default DiscoveryFlow;
