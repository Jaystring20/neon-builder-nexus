import { motion, useReducedMotion } from "framer-motion";
import StoryImage from "@/components/StoryImage";

// Copy: docs/landing-copy.md, section 2. Four outcomes, one per layer the
// next section introduces (strategy, brand, platforms, people).
const OUTCOMES = [
  "Sharper diagnosis before anything gets built.",
  "A brand that stays consistent everywhere it shows up.",
  "Platforms that take the busywork off your team.",
  "People trained to get the most out of all of it.",
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AIMultiplierSection = () => {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="ai-heading" className="relative py-24 md:py-32">
      <div className="container-narrow grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2
            id="ai-heading"
            className="font-display-refined text-balance text-[2.25rem] leading-[1.05] text-foreground sm:text-5xl"
          >
            AI isn&rsquo;t our pitch.{" "}
            <span className="text-primary">It&rsquo;s our multiplier.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            What changes when AI is built into the work, not bolted on?
          </p>

          <ul className="mt-10 space-y-5">
            {OUTCOMES.map((outcome, i) => (
              <motion.li
                key={outcome}
                className="flex gap-4 text-base text-foreground/90 sm:text-lg"
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                <span aria-hidden="true" className="mt-[0.7em] h-px w-6 shrink-0 bg-primary" />
                {outcome}
              </motion.li>
            ))}
          </ul>
        </div>

        <StoryImage
          id="ai-multiplier"
          alt="Many small glass tiles, each sending a thin thread of cyan light to one point above them"
          aspect="aspect-[4/3]"
        />
      </div>
    </section>
  );
};

export default AIMultiplierSection;
