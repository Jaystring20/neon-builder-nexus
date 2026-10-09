import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { can } from "@/data/adminRoles";
import { TIER_LABEL } from "@/data/offerMatch";
import {
  DEFAULT_SETTINGS,
  TIER_KEYS,
  defaultProgrammes,
  type ProgrammesContent,
  type SettingsContent,
  type TierEdit,
} from "@/data/siteContent";
import { SITE_CONTENT_KEY } from "@/hooks/useSiteContent";
import { adminApi } from "@/lib/adminApi";
import { useMe } from "./AdminApp";
import { FieldRow, LinesInput, SaveBar, TextArea, TextInput, VersionsPanel, useContentEditor } from "./content";
import { ErrorNote, Loading, PageHeader, Panel, SEGMENT_LABEL, selectClass } from "./ui";

const BILLING = { "one-time": "One-time", monthly: "Per month", engagement: "Per engagement" } as const;

/** Owner-only: whether the diagnostic result shows price ranges. Saves on toggle. */
function PriceDisplay() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "content", "settings"], queryFn: () => adminApi.content<SettingsContent>("settings") });
  const current = q.data?.value ?? DEFAULT_SETTINGS;
  const save = useMutation({
    mutationFn: (showPrices: boolean) => adminApi.saveContent("settings", { ...current, showPrices }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "content", "settings"] });
      qc.invalidateQueries({ queryKey: SITE_CONTENT_KEY });
    },
  });
  return (
    <Panel title="Prices on the website">
      <label className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-foreground">Show price ranges on the diagnostic result</span>
          <span className="block text-sm text-muted-foreground">
            When off, visitors see each option without prices and you talk numbers on the call.
          </span>
        </span>
        <Switch checked={current.showPrices} disabled={q.isLoading || save.isPending} onCheckedChange={(v) => save.mutate(v)} />
      </label>
      {save.error && <p className="mt-2 text-sm text-destructive">{(save.error as Error).message}</p>}
    </Panel>
  );
}

function TierFields({ tier, label, pricesEditable, onChange }: { tier: TierEdit; label: string; pricesEditable: boolean; onChange: (fn: (t: TierEdit) => void) => void }) {
  return (
    <Panel title={label}>
      <div className="grid gap-4">
        <FieldRow label="Name">
          <TextInput value={tier.name} onChange={(v) => onChange((t) => (t.name = v))} />
        </FieldRow>
        <FieldRow label="Length" hint="For example: 4 weeks">
          <TextInput value={tier.duration} onChange={(v) => onChange((t) => (t.duration = v))} />
        </FieldRow>
        <FieldRow label="Best for" hint="Shown on the diagnostic result">
          <TextArea value={tier.ideal_for} rows={2} onChange={(v) => onChange((t) => (t.ideal_for = v))} />
        </FieldRow>
        <FieldRow label="Short description">
          <TextArea value={tier.description} rows={2} onChange={(v) => onChange((t) => (t.description = v))} />
        </FieldRow>
        <FieldRow label="What's included" hint="One item per line">
          <LinesInput value={tier.includes} rows={5} onChange={(v) => onChange((t) => (t.includes = v))} />
        </FieldRow>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldRow label="From (₦)">
            <TextInput
              type="number"
              min={0}
              step={1000}
              disabled={!pricesEditable}
              value={String(tier.price.min)}
              onChange={(v) => onChange((t) => (t.price.min = Math.max(0, Math.round(Number(v) || 0))))}
            />
          </FieldRow>
          <FieldRow label="To (₦)">
            <TextInput
              type="number"
              min={0}
              step={1000}
              disabled={!pricesEditable}
              value={String(tier.price.max)}
              onChange={(v) => onChange((t) => (t.price.max = Math.max(0, Math.round(Number(v) || 0))))}
            />
          </FieldRow>
          <FieldRow label="Billed">
            <select
              disabled={!pricesEditable}
              value={tier.price.billing}
              onChange={(e) => onChange((t) => (t.price.billing = e.target.value as TierEdit["price"]["billing"]))}
              className={cn(selectClass, "w-full disabled:opacity-60")}
            >
              {Object.entries(BILLING).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </FieldRow>
        </div>
        {!pricesEditable && <p className="text-xs text-muted-foreground">Prices can only be changed by an Owner.</p>}
        {pricesEditable && tier.price.max < tier.price.min && (
          <p className="text-xs text-secondary">The "To" price is lower than the "From" price.</p>
        )}
      </div>
    </Panel>
  );
}

export default function Programmes() {
  const me = useMe();
  const pricesEditable = can(me.role, "prices.edit");
  const editor = useContentEditor<ProgrammesContent>("programmes", defaultProgrammes);
  const segments = Object.keys(defaultProgrammes());
  const [segment, setSegment] = useState(segments[0]);

  if (editor.loading || !editor.draft) return editor.error ? <ErrorNote error={editor.error} /> : <Loading />;
  const programme = editor.draft[segment] ?? defaultProgrammes()[segment]!;

  return (
    <>
      <SaveBar editor={editor} livePath="/diagnostic" />
      <PageHeader
        title="Programmes"
        lead="The five programmes the Growth Diagnostic recommends, and the three ways to work on each. Changes show on the diagnostic result and in its emails."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <div role="tablist" aria-label="Programme" className="flex gap-1 overflow-x-auto border-b border-border/40">
            {segments.map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={s === segment}
                onClick={() => setSegment(s)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2 text-sm transition-colors",
                  s === segment ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {SEGMENT_LABEL[s] ?? s}
              </button>
            ))}
          </div>

          <Panel title="Programme">
            <div className="grid gap-4">
              <FieldRow label="Name">
                <TextInput value={programme.name} onChange={(v) => editor.edit((d) => (d[segment]!.name = v))} />
              </FieldRow>
              <FieldRow label="Tagline" hint="The line under the name on the result screen">
                <TextArea value={programme.tagline} rows={2} onChange={(v) => editor.edit((d) => (d[segment]!.tagline = v))} />
              </FieldRow>
            </div>
          </Panel>

          {TIER_KEYS.map((key, i) => (
            <TierFields
              key={`${segment}-${key}`}
              label={`Option ${i + 1} · ${TIER_LABEL[key]}`}
              tier={programme[key]}
              pricesEditable={pricesEditable}
              onChange={(fn) => editor.edit((d) => fn(d[segment]![key]))}
            />
          ))}
        </div>

        <div className="space-y-8">
          {pricesEditable && <PriceDisplay />}
          <VersionsPanel editor={editor} canReset={pricesEditable} />
        </div>
      </div>
    </>
  );
}
