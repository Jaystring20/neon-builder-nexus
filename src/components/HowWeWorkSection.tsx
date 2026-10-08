import { motion, useReducedMotion } from "framer-motion";
import StoryImage from "@/components/StoryImage";

// Copy: docs/landing-copy.md, section 7. The panorama reads left to right as
// the same four stages, so the steps sit directly beneath it as a timeline.
const STAGES = [
  { name: "Diagnose.", line: "We find the problem behind the brief." },
  { name: "Architect.", line: "Brand, platform and people mapped before anything is built." },
  { name: "Build.", line: "In parallel, with AI in every layer and checkpoints you can see." },
  { name: "Compound.", line: "After launch we measure, refine and keep it moving." },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HowWeWorkSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="process" aria-labelledby="process-heading" className="relative py-24 md:py-32">
      <div className="container-narrow">
        <div className="max-w-3xl">
          <h2
            id="process-heading"
            className="font-display-refined text-balance text-[2.25rem] leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
          >
            Diagnose. Architect. Build. <span className="text-secondary">Compound.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Never one-size-fits-all. Every engagement starts with the real problem.
          </p>
        </div>

        <StoryImage
          id="process-four-stages"
          alt="Four slabs in a row: examined, drawn as a plan, being built, and finished with new slabs growing from it"
          aspect="aspect-[16/9]"
          className="mt-14"
        />

        <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* The line the stages travel along; it draws itself as it comes into view. */}
          <motion.span
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-primary/50 lg:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          {STAGES.map((stage, i) => (
            <motion.li
              key={stage.name}
              className="relative border-t border-border/40 pt-6 lg:border-t-0"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: EASE }}
            >
              {/* The last stage is where momentum starts, so it alone is orange. */}
              <span
                aria-hidden="true"
                className={`absolute -top-[3px] left-0 hidden h-[7px] w-[7px] lg:block ${i === STAGES.length - 1 ? "bg-secondary" : "bg-primary"}`}
              />
              <p
                className={`font-heading text-xl font-medium tracking-tight ${i === STAGES.length - 1 ? "text-secondary" : "text-foreground"}`}
              >
                {stage.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{stage.line}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowWeWorkSection;
