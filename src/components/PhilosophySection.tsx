import { motion, useReducedMotion } from "framer-motion";

// Copy: docs/landing-copy.md, section 5. Type only: by this point the visitor
// knows what DCH does, so the double meaning of "agency" can land, and the
// three beats arrive one at a time as they scroll.
const BEATS = [
  { title: "Build agency.", line: "The power to act on your own terms." },
  { title: "Create value.", line: "Work worth more than it cost." },
  { title: "Drive growth.", line: "Momentum that outlasts the engagement." },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PhilosophySection = () => {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-narrow">
        <h2
          id="philosophy-heading"
          className="font-display-refined max-w-4xl text-balance text-[2.5rem] leading-[1.05] text-foreground sm:text-6xl lg:text-7xl"
        >
          Some agencies build things.{" "}
          <span className="text-primary">We build agency.</span>
        </h2>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          {BEATS.map((beat, i) => (
            <motion.div
              key={beat.title}
              initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.9, delay: i * 0.18, ease: EASE }}
              className="border-t border-primary/40 pt-6"
            >
              <p className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {beat.title}
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{beat.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
