import StoryImage from "@/components/StoryImage";

// Copy: docs/landing-copy.md, section 6. One large tile for the most common
// starting point, two stacked beside it: a bento with three cells for three
// audiences, never an empty one.
const AUDIENCES = [
  {
    id: "audience-startup",
    who: "Startups finding their footing",
    line: "Brand, platform and team built at once, without five vendors.",
    alt: "A single small slab on a wide plane, lines of light drawing out the foundations around it",
  },
  {
    id: "audience-established",
    who: "Established brands ready to evolve",
    line: "Re-form what's next without losing what got you here.",
    alt: "A heavy stacked structure whose upper layers lift apart and re-form while the base stays still",
  },
  {
    id: "audience-individual",
    who: "People outgrowing where they are",
    line: "A deliberate path to where your potential has been pointing.",
    alt: "One slender slab at the start of a rising path of stepping stones lit cyan, warm light at the far end",
  },
];

const AudienceSection = () => (
  <section aria-labelledby="audience-heading" className="relative py-24 md:py-32">
    <div className="container-narrow">
      <div className="max-w-2xl">
        <h2
          id="audience-heading"
          className="font-display-refined text-[2.5rem] leading-[1.02] text-foreground sm:text-6xl"
        >
          Wherever you&rsquo;re starting from.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">We go where growth needs to happen.</p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {AUDIENCES.map((a, i) => (
          <article
            key={a.id}
            className={i === 0 ? "group relative lg:row-span-2" : "group relative"}
          >
            <StoryImage
              id={a.id}
              alt={a.alt}
              aspect={i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3] lg:aspect-[16/9]"}
              className="transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Copy sits on the image's dark lower edge, behind a scrim, so it
                stays readable whatever the image does. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
              <h3 className="font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl">{a.who}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/80 sm:text-base">{a.line}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSection;
