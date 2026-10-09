import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { can } from "@/data/adminRoles";
import { questions, labelFor } from "@/data/discoveryQuestions";
import { TIER_LABEL, matchOffer } from "@/data/offerMatch";
import { PRACTICE_TITLES } from "@/data/leadIntake";
import { adminApi } from "@/lib/adminApi";
import { useMe } from "./AdminApp";
import { ActivityList, ErrorNote, Loading, NotesPanel, PageHeader, Panel, SEGMENT_LABEL, StatusBadge, ago, fmtDate } from "./ui";

export function DiagnosticsList() {
  const list = useQuery({ queryKey: ["admin", "diagnostics"], queryFn: adminApi.diagnostics });

  return (
    <>
      <PageHeader title="Diagnostics" lead="Everyone who finished the Growth Diagnostic and asked for their breakdown." />
      {list.isLoading ? (
        <Loading />
      ) : list.error ? (
        <ErrorNote error={list.error} />
      ) : list.data!.diagnostics.length === 0 ? (
        <p className="py-16 text-muted-foreground">No diagnostics yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border/40 border border-border/60">
          {list.data!.diagnostics.map((d) => (
            <li key={d.id} className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 hover:bg-card/60">
              <div className="min-w-0">
                <Link to={`/admin/diagnostics/${d.id}`} className="font-medium text-foreground after:absolute after:inset-0 hover:text-primary">
                  {d.email}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {d.program} · {SEGMENT_LABEL[d.segment] ?? d.segment}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {d.lead ? <StatusBadge status={d.lead.status} /> : <span className="text-xs">Not in pipeline</span>}
                <span>{ago(d.updated_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const showAnswer = (id: string, v: unknown, labels?: string[]): string | null => {
  if (Array.isArray(v)) return v.map((x) => labelFor(id, x) ?? String(x)).join("\n") || null;
  if (typeof v === "number") return labels?.[v - 1] ? `${v} of 5: ${labels[v - 1]}` : `${v} of 5`;
  return labelFor(id, v);
};

export function DiagnosticDetail() {
  const { id = "" } = useParams();
  const me = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const writable = can(me.role, "leads.write");
  const key = ["admin", "diagnostic", id];
  const q = useQuery({ queryKey: key, queryFn: () => adminApi.diagnostic(id) });
  const toLead = useMutation({
    mutationFn: () => adminApi.diagnosticToLead(id),
    onSuccess: ({ leadId }) => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      navigate(`/admin/leads/${leadId}`);
    },
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { diagnostic: d, lead, notes, activity } = q.data!;
  const offer = matchOffer(d.segment, d.answers ?? {});

  return (
    <>
      <Link to="/admin/diagnostics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All diagnostics
      </Link>
      <div className="mt-4">
        <PageHeader
          title={d.email}
          lead={`Took the diagnostic ${fmtDate(d.updated_at, true)}`}
          action={
            <a href={`mailto:${d.email}`} className="inline-flex items-center gap-2 border border-border/60 px-3 py-2 text-sm hover:border-primary">
              <Mail className="h-4 w-4" /> Email
            </a>
          }
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <Panel title="Their answers">
            <ol className="space-y-5">
              {questions.map((question, i) => {
                const answer = showAnswer(question.id, d.answers?.[question.id], question.labels);
                const follow = d.answers?.[`${question.id}_followup`];
                return (
                  <li key={question.id}>
                    <p className="text-sm text-muted-foreground">
                      {i + 1}. {question.question}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-foreground">{answer ?? <span className="text-muted-foreground">Skipped</span>}</p>
                    {typeof follow === "string" && follow.trim() && (
                      <p className="mt-1 border-l-2 border-border pl-3 text-sm text-foreground/80">
                        {question.followUp?.options?.find((o) => o.value === follow)?.label ?? follow}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </Panel>
          <NotesPanel type="diagnostic" id={d.id} notes={notes} canWrite={writable} queryKey={key} />
        </div>

        <div className="space-y-8">
          <Panel title="Result">
            <p className="text-lg text-foreground">{d.program}</p>
            <p className="text-sm text-muted-foreground">{SEGMENT_LABEL[d.segment] ?? d.segment}</p>
            {d.capability_gap && (
              <p className="mt-4 text-sm">
                <span className="text-muted-foreground">Gap flagged: </span>
                <span className="text-foreground">{d.capability_gap}</span>
              </p>
            )}
          </Panel>
          {offer.program && (
            <Panel title="Best fit">
              <p className="text-xs uppercase tracking-wide text-primary">{TIER_LABEL[offer.bestTier]}</p>
              <p className="mt-1 text-foreground">{offer.program[offer.bestTier].name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{offer.reason}</p>
              {offer.practices.length > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Through {offer.practices.map((p) => PRACTICE_TITLES[p] ?? p).join(", ")}
                </p>
              )}
            </Panel>
          )}
          <Panel title="Pipeline">
            {lead ? (
              <div className="space-y-3">
                <StatusBadge status={lead.status} />
                <Link to={`/admin/leads/${lead.id}`} className="block text-sm text-primary hover:underline">
                  Open the lead
                </Link>
              </div>
            ) : writable ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">Add them to Leads to track the follow-up like any call request.</p>
                <Button size="sm" disabled={toLead.isPending} onClick={() => toLead.mutate()}>
                  Add to leads
                </Button>
                {toLead.error && <p className="mt-2 text-sm text-destructive">{(toLead.error as Error).message}</p>}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not in the pipeline.</p>
            )}
          </Panel>
          <Panel title="History">
            <ActivityList items={activity} />
          </Panel>
        </div>
      </div>
    </>
  );
}
