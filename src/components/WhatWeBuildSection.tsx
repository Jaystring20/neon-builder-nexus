import { motion, useReducedMotion } from "framer-motion";
import StoryImage from "@/components/StoryImage";

// Copy: docs/landing-copy.md, section 3. The three parts of the engine the
// hero shows turning; each column is led by its image, not boxed in a card.
const PARTS = [
  {
    id: "capability-brand",
    name: "Brand",
    line: "Identity that earns attention and keeps it.",
    covers: "Strategy, identity, messaging, design systems",
    alt: "A geometric mark cut into dark stone, repeated at smaller scale on the slabs beside it",
  },
  {
    id: "capability-platforms",
    name: "Platforms",
    line: "Software that scales the business, not the busywork.",
    covers: "SaaS products, websites, automation, integrations",
    alt: "An exploded stack of glass layers aligned on pins of cyan light",
  },
  {
    id: "capability-people",
    name: "People",
    line: "Training that turns capability into performance.",
    covers: "Programmes, coaching, team enablement",
    alt: "A staircase of glass slabs rising toward a warm light at the top",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WhatWeBuildSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="what-we-build" aria-labelledby="build-heading" className="relative py-24 md:py-32">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <h2
            id="build-heading"
            className="font-display-refined text-[2.5rem] leading-[1.02] text-foreground sm:text-6xl"
          >
            Brand. Platforms. People.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Three parts of one engine. Each makes the others stronger.
          </p>
        </div>

        {/* Stepped columns: each part sits a little lower than the last, so
            the row reads as a sequence building, not three equal cards. */}
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {PARTS.map((part, i) => (
            <motion.article
              key={part.id}
              className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : undefined}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <StoryImage id={part.id} alt={part.alt} aspect="aspect-[3/4]" />
              <h3 className="mt-6 font-heading text-2xl font-medium tracking-tight text-foreground">{part.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/85">{part.line}</p>
              <p className="mt-3 text-sm text-muted-foreground">{part.covers}</p>
            </motion.article>
          ))}
        </div>

        <p className="mt-20 max-w-xl text-xl leading-snug text-foreground md:mt-24 md:text-2xl">
          AI runs through all three. <span className="text-secondary">That&rsquo;s why it compounds.</span>
        </p>
      </div>
    </section>
  );
};

export default WhatWeBuildSection;
