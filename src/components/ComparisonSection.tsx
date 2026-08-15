import { Check, Minus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Cell = "yes" | "partial" | "no";

const columns = [
  { key: "dch", label: "DCH", accent: true },
  { key: "inhouse", label: "In-House" },
  { key: "agency", label: "Agencies" },
  { key: "freelancer", label: "Freelancers" },
  { key: "ai", label: "AI Tools" },
];

const rows: { label: string; values: Record<string, Cell> }[] = [
  {
    label: "Speed to Market",
    values: { dch: "yes", inhouse: "partial", agency: "no", freelancer: "partial", ai: "yes" },
  },
  {
    label: "Strategic Depth",
    values: { dch: "yes", inhouse: "yes", agency: "yes", freelancer: "no", ai: "no" },
  },
  {
    label: "Brand Intelligence",
    values: { dch: "yes", inhouse: "yes", agency: "partial", freelancer: "no", ai: "no" },
  },
  {
    label: "Scalable Output",
    values: { dch: "yes", inhouse: "no", agency: "partial", freelancer: "no", ai: "yes" },
  },
  {
    label: "AI-Native Workflow",
    values: { dch: "yes", inhouse: "no", agency: "no", freelancer: "no", ai: "yes" },
  },
  {
    label: "Accountable Outcomes",
    values: { dch: "yes", inhouse: "yes", agency: "partial", freelancer: "no", ai: "no" },
  },
];

const Icon = ({ v }: { v: Cell }) => {
  if (v === "yes") return <Check className="mx-auto h-5 w-5 text-primary" strokeWidth={3} />;
  if (v === "partial") return <Minus className="mx-auto h-5 w-5 text-secondary" strokeWidth={3} />;
  return <X className="mx-auto h-5 w-5 text-muted-foreground/50" strokeWidth={2.5} />;
};

const ComparisonSection = () => {
  const [activeAlt, setActiveAlt] = useState("agency");
  const altCols = columns.filter((c) => c.key !== "dch");

  return (
    <section className="section-inverse section-padding relative overflow-hidden">
      <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[70px] md:blur-[120px]" />

      <div className="container-narrow relative z-10">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            DCH vs. The Alternatives
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl lg:text-5xl">
            Hiring an agency, freelancers, or AI tools?{" "}
            <span className="gradient-text">None of the above.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            We're a Growth Architect — pairing strategic creative with AI-first systems so you ship
            faster without sacrificing brand integrity.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl glass-card-elevated md:block">
          <div className="grid grid-cols-6 border-b border-border/30 bg-card/40">
            <div className="p-5 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Capability
            </div>
            {columns.map((c) => (
              <div
                key={c.key}
                className={cn(
                  "p-5 text-center font-heading text-base font-bold",
                  c.accent
                    ? "bg-gradient-to-b from-primary/15 to-transparent text-primary"
                    : "text-muted-foreground",
                )}
              >
                {c.label}
              </div>
            ))}
          </div>
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-6 transition-colors hover:bg-card/30",
                idx % 2 === 0 ? "bg-card/10" : "bg-transparent",
              )}
            >
              <div className="border-t border-border/20 p-5 text-sm font-semibold text-foreground">
                {row.label}
              </div>
              {columns.map((c) => (
                <div
                  key={c.key}
                  className={cn(
                    "border-t border-border/20 p-5",
                    c.accent && "bg-primary/5",
                  )}
                >
                  <Icon v={row.values[c.key]} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile: DCH vs. one alternative tabs */}
        <div className="md:hidden">
          <div className="mb-4 flex flex-wrap gap-2">
            {altCols.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveAlt(c.key)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                  activeAlt === c.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 text-muted-foreground hover:text-foreground",
                )}
              >
                vs. {c.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl glass-card-elevated">
            <div className="grid grid-cols-3 border-b border-border/30 bg-card/40 text-xs font-bold uppercase tracking-wider">
              <div className="p-3 text-muted-foreground">Capability</div>
              <div className="bg-primary/15 p-3 text-center text-primary">DCH</div>
              <div className="p-3 text-center text-muted-foreground">
                {columns.find((c) => c.key === activeAlt)?.label}
              </div>
            </div>
            {rows.map((row, idx) => (
              <div
                key={row.label}
                className={cn("grid grid-cols-3", idx % 2 === 0 ? "bg-card/10" : "")}
              >
                <div className="border-t border-border/20 p-3 text-xs font-semibold text-foreground">
                  {row.label}
                </div>
                <div className="border-t border-border/20 bg-primary/5 p-3">
                  <Icon v={row.values.dch} />
                </div>
                <div className="border-t border-border/20 p-3">
                  <Icon v={row.values[activeAlt]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-primary" strokeWidth={3} /> Excellent
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="h-4 w-4 text-secondary" strokeWidth={3} /> Partial
          </div>
          <div className="flex items-center gap-1.5">
            <X className="h-4 w-4 text-muted-foreground/50" strokeWidth={2.5} /> Falls short
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
