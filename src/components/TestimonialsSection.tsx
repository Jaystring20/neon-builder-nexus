import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "DCH didn't just build us a website — they architected our entire growth engine. We went from invisible to industry reference in 90 days.",
    name: "Adaeze O.",
    role: "Founder",
    company: "Innerspace Studio",
    initials: "AO",
  },
  {
    quote:
      "Most agencies hand you a deliverable and disappear. DCH stayed in the build with us — calibrating, shipping, scaling. That's the difference.",
    name: "Marcus T.",
    role: "VP Marketing",
    company: "Ecopath",
    initials: "MT",
  },
  {
    quote:
      "They speak strategy and execution in the same breath. I've never had a creative partner translate brand into measurable revenue this fast.",
    name: "Funmi A.",
    role: "Creative Director",
    company: "DDO Learning",
    initials: "FA",
  },
  {
    quote:
      "The Builder's Blueprint alone is worth more than three agency retainers I've paid. Then they actually delivered on it.",
    name: "David K.",
    role: "Founder & CEO",
    company: "DigiTech Strategist",
    initials: "DK",
  },
  {
    quote:
      "What you get with DCH is a team that thinks like operators. They build systems that compound, not assets that sit.",
    name: "Sarah B.",
    role: "Head of Brand",
    company: "Soteria Health",
    initials: "SB",
  },
  {
    quote:
      "AI-fluent, brand-obsessed, ridiculously fast. The closest thing to a senior in-house team without the overhead.",
    name: "Chinedu I.",
    role: "Director of Growth",
    company: "Fitness Religion Co.",
    initials: "CI",
  },
];

const Card = ({ t }: { t: Testimonial }) => (
  <article className="group flex h-full w-[320px] flex-shrink-0 flex-col gap-4 rounded-2xl p-6 glass-card hover-lift sm:w-[380px]">
    <Quote className="h-6 w-6 flex-shrink-0 text-primary/60" />
    <p className="flex-1 text-sm leading-relaxed text-foreground/90 sm:text-base">
      "{t.quote}"
    </p>
    <div className="flex items-center gap-3 border-t border-border/20 pt-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-sm font-bold text-foreground">
        {t.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {t.role}, <span className="text-primary">{t.company}</span>
        </p>
      </div>
    </div>
  </article>
);

const Row = ({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div
        className="flex w-max gap-5 hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? "scroll-right" : "scroll-left"} 60s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="section-inverse section-padding relative overflow-hidden">
      <div className="absolute -left-20 top-1/2 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[70px] md:blur-[120px]" />

      <div className="container-narrow relative z-10 mb-12 text-center md:mb-16">
        <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl lg:text-5xl">
          Builder wins, <span className="text-secondary">told by our clients</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Real founders. Real outcomes. Real momentum.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <Row items={testimonials.slice(0, half)} />
        <Row items={testimonials.slice(half)} reverse />
      </div>
    </section>
  );
};

export default TestimonialsSection;
