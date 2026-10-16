import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { questions } from "@/data/discoveryQuestions";
import { adminApi, type Funnel } from "@/lib/adminApi";
import { cn } from "@/lib/utils";
import { ErrorNote, Loading, Panel, selectClass } from "./ui";

const pct = (n: number, of: number) => (of ? `${Math.round((n / of) * 100)}%` : "0%");
const questionText = (id: string | null) => (id ? (questions.find((q) => q.id === id)?.question ?? id) : "");

/**
 * Where people drop out of the Growth Diagnostic: how many start, how far
 * they get, and how many finish, leave an email, open the calendar or book.
 * One series, so one hue; the biggest drop is called out in words as well as
 * colour, and every bar carries its number.
 */
export function FunnelPanel() {
  const [days, setDays] = useState(30);
  const q = useQuery({ queryKey: ["admin", "funnel", days], queryFn: () => adminApi.funnel(days) });

  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">How people move through the diagnostic</h2>
        <select aria-label="Period" value={days} onChange={(e) => setDays(Number(e.target.value))} className={selectClass}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <ErrorNote error={q.error} />
      ) : !q.data!.ready ? (
        <p className="text-sm text-muted-foreground">
          Not counting yet. Run <code className="text-foreground">supabase/migrations/20261016090000_diagnostic_funnel.sql</code> in the Supabase SQL
          Editor, and counting starts with the next visitor.
        </p>
      ) : !q.data!.started ? (
        <p className="text-sm text-muted-foreground">Nobody has started the diagnostic in this period yet.</p>
      ) : (
        <FunnelBody data={q.data as Required<Funnel>} />
      )}
    </Panel>
  );
}

function FunnelBody({ data }: { data: Required<Funnel> }) {
  const { started, steps, finished, emailed, openedBooking, booked, sources } = data;
  // The step that loses the most people compared with the one before it.
  let drop = { step: 0, lost: 0 };
  steps.forEach((s, i) => {
    const before = i === 0 ? started : steps[i - 1].reached;
    if (before - s.reached > drop.lost) drop = { step: s.step, lost: before - s.reached };
  });
  const dropQuestion = steps.find((s) => s.step === drop.step - 1)?.question ?? null;

  const tiles: [string, number, string][] = [
    ["Started", started, ""],
    ["Finished", finished, pct(finished, started)],
    ["Left an email", emailed, pct(emailed, started)],
    ["Opened the calendar", openedBooking, pct(openedBooking, started)],
    ["Booked", booked, pct(booked, started)],
  ];

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-5">
        {tiles.map(([label, n, share]) => (
          <div key={label} className="bg-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {n}
              {share && <span className="ml-2 text-sm font-normal text-muted-foreground">{share}</span>}
            </dd>
          </div>
        ))}
      </dl>

      {drop.lost > 0 && (
        <p className="text-sm text-foreground">
          Biggest drop: {drop.lost} {drop.lost === 1 ? "person" : "people"} left {drop.step === 1 ? "before the first question" : `after question ${drop.step - 1}`}
          {dropQuestion && <span className="text-muted-foreground"> ("{questionText(dropQuestion)}")</span>}.
        </p>
      )}

      <div>
        <h3 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Reached each question</h3>
        <ol className="space-y-1.5">
          {steps.map((s) => (
            <li key={s.step} className="grid grid-cols-[2rem_1fr_5.5rem] items-center gap-3 text-sm" title={questionText(s.question)}>
              <span className="text-right text-muted-foreground">Q{s.step}</span>
              <span className="h-3 bg-border/30">
                <span
                  className={cn("block h-full rounded-r", s.step === drop.step ? "bg-secondary" : "bg-primary")}
                  style={{ width: `${(s.reached / started) * 100}%` }}
                />
              </span>
              <span className="text-foreground">
                {s.reached} <span className="text-muted-foreground">{pct(s.reached, started)}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground">Hover a row for the question. Question order depends on who they are, so later numbers mix audiences.</p>
      </div>

      {sources.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Where they came from</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-1 pr-4 font-medium">Source</th>
                <th className="py-1 pr-4 font-medium">Started</th>
                <th className="py-1 pr-4 font-medium">Finished</th>
                <th className="py-1 font-medium">Left an email</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.source} className="border-t border-border/40">
                  <td className="py-1.5 pr-4 text-foreground">{s.source}</td>
                  <td className="py-1.5 pr-4">{s.started}</td>
                  <td className="py-1.5 pr-4">
                    {s.finished} <span className="text-muted-foreground">{pct(s.finished, s.started)}</span>
                  </td>
                  <td className="py-1.5">
                    {s.emailed} <span className="text-muted-foreground">{pct(s.emailed, s.started)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
