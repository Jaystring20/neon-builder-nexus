import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import StoryImage from "@/components/StoryImage";
import { portfolioProjects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Copy: docs/landing-copy.md, section 4. Each story is the question the
 * client had; opening it shows the answer, the concept image for the idea,
 * and the real site as evidence. Generated images set the scene, real
 * screenshots prove the work (PRODUCT.md, principle 2).
 *
 * The training case joins this list when DCH supplies the material; nothing
 * is shown for it until then.
 */
const STORIES = [
  {
    projectId: "fitness-religion",
    client: "Fitness Religion",
    question: "Can one platform run the same event in five cities at once?",
    answer: "Registration, leaderboards, event management and sponsors, all in sync.",
    imageId: "proof-five-cities",
    imageAlt: "One central glass slab sending a single line of light through five smaller slabs",
  },
  {
    projectId: "mh-eyewear",
    client: "M & H Eyewear",
    question: "How do you sell luxury frames to someone who can't try them on?",
    answer: "AI try-on, a style quiz and eye exams, built into the purchase.",
    imageId: "proof-clarity-lens",
    imageAlt: "A lens set into a dark slab, sharp inside the lens and blurred outside it",
  },
  {
    projectId: "viera-amber",
    client: "Viera Amber",
    question: "What happens when five businesses run as one?",
    answer: "One system connecting design, impact, fashion, learning and creator commerce.",
    imageId: "proof-five-modules",
    imageAlt: "Five modules of different materials docking into one long base",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const RealWorkSection = () => {
  const [open, setOpen] = useState<string | null>(STORIES[0].projectId);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <section id="work" aria-labelledby="work-heading" className="relative py-24 md:py-32">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <h2
            id="work-heading"
            className="font-display-refined text-[2.5rem] leading-[1.02] text-foreground sm:text-6xl"
          >
            Shipped. <span className="text-primary">And still moving.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Brand, platform and people work, live and in use.
          </p>
        </div>

        <div className="mt-14 border-t border-border/40">
          {STORIES.map((story) => {
            const project = portfolioProjects.find((p) => p.id === story.projectId);
            const isOpen = open === story.projectId;
            const panelId = `${baseId}-${story.projectId}`;

            return (
              <div key={story.projectId} className="border-b border-border/40">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : story.projectId)}
                    className="group flex w-full items-start justify-between gap-6 py-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <span>
                      <span className="block text-sm font-medium text-primary">{story.client}</span>
                      <span
                        className={cn(
                          "mt-2 block font-heading text-xl leading-snug tracking-tight transition-colors sm:text-2xl md:text-[1.75rem]",
                          isOpen ? "text-foreground" : "text-foreground/75 group-hover:text-foreground"
                        )}
                      >
                        {story.question}
                      </span>
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={cn(
                        "mt-8 h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-500",
                        isOpen && "rotate-45 text-secondary"
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10">
                        <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">{story.answer}</p>

                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                          <StoryImage id={story.imageId} alt={story.imageAlt} aspect="aspect-[4/3]" />

                          {project?.image ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group/shot relative block aspect-[4/3] overflow-hidden border border-foreground/[0.08] bg-card/40"
                            >
                              <img
                                src={project.image}
                                alt={`${story.client} website`}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover/shot:scale-[1.03]"
                              />
                              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 to-transparent px-5 pb-4 pt-12 text-sm font-medium text-foreground">
                                {project.displayDomain}
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/shot:-translate-y-0.5 group-hover/shot:translate-x-0.5" />
                              </span>
                            </a>
                          ) : project?.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group/shot flex aspect-[4/3] items-end border border-foreground/[0.08] bg-card/40 p-6 text-base font-medium text-foreground hover:border-primary/40"
                            >
                              <span className="flex items-center gap-2">
                                Visit {project.displayDomain}
                                <ArrowUpRight className="h-4 w-4" />
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Link
          to="/our-work"
          className="group mt-10 inline-flex items-center gap-2 text-base font-semibold text-foreground/80 transition-colors hover:text-foreground"
        >
          See all work
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default RealWorkSection;
