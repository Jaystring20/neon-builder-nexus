/**
 * The homepage's visual story, one entry per image.
 *
 * Art direction: studio-rendered 3D objects, not photography. Thick slabs of
 * smoked glass and matte graphite float over a near-black field, seen from a
 * three-quarter isometric angle and lit like hardware product shots. The
 * reference is the "floating interface hardware" look of AI-infrastructure
 * sites; the brand's own cyan carries the light and amber is the one warm
 * accent, so the images belong to this site rather than to the reference.
 *
 * Every image is mood and story, never evidence (PRODUCT.md, principle 2):
 * interface shapes stay abstract (blank pills, bars, dots) because readable
 * UI would read as a fake screenshot of client work. No people, no client
 * products, no logos.
 *
 * STYLE is shared so the set reads as one shoot. Once the hero is approved
 * it becomes the reference for the rest.
 */

export const STYLE = [
  "premium 3D product render, studio quality, three-quarter isometric view from slightly above, long lens with almost no perspective distortion",
  "objects are thick floating slabs of dark smoked glass and matte graphite with softly rounded bevelled edges, gently tilted, casting soft shadows onto a dark floor plane far below",
  "near-black graphite-blue background with a soft vignette, deep and calm",
  "key light is a cool cyan-teal glow along edges, seams and thin light lines; one small warm amber accent light only; glossy reflections, faint frosted texture, subtle depth of field",
  "interface details are abstract only: blank rounded pills, soft bars, small dots and hairlines, never letters, numbers, words, logos or icons",
  "minimal composition with generous empty space, refined and quiet, no people, no hands, no neon signs, no holograms, no sci-fi city, no purple, no rainbow colours",
].join("; ");

export interface Shot {
  /** File name under public/images/story/ (without extension). */
  id: string;
  section: string;
  aspect_ratio: string;
  prompt: string;
}

export const SHOTS: Shot[] = [
  {
    id: "hero-built-stack",
    section: "Hero",
    aspect_ratio: "16:9",
    prompt:
      "Three large glass-and-graphite slabs float stacked one above another with clear air between them, like an exploded view of one machine. The top slab has a single bold abstract geometric mark inlaid in its surface (the brand layer). The middle slab carries a neat grid of small rounded modules (the infrastructure layer). The bottom slab holds one soft glowing cyan core (the AI layer). Thin vertical threads of cyan light run through all three, binding them into one system. The stack sits in the right half of the frame; the left half is empty dark space for a headline.",
  },
  {
    id: "proof-five-cities",
    section: "Proof: Fitness Religion",
    aspect_ratio: "4:3",
    prompt:
      "One large central glass slab with five smaller identical slabs floating around it in a wide shallow arc. A single continuous line of cyan light leaves the central slab and runs through each of the five in turn, each small slab glowing with the same soft pulse at the same moment. One platform running five events at once. Calm, precise, symmetrical rhythm.",
  },
  {
    id: "proof-clarity-lens",
    section: "Proof: M & H Eyewear",
    aspect_ratio: "4:3",
    prompt:
      "A thick dark glass slab with one perfectly round optical lens set into its surface. Seen through the lens, the blank interface pills and bars on the slab are pin sharp; everywhere outside the lens they melt into soft blur. A fine cyan ring of light traces the lens edge, with a thin warm amber highlight catching one side. Seeing clearly before you buy.",
  },
  {
    id: "proof-five-modules",
    section: "Proof: Viera Amber",
    aspect_ratio: "4:3",
    prompt:
      "Five distinct modules, each a different shape and material (a smoked-glass cube, a matte graphite cylinder, a brushed-metal pill, a frosted rounded tile, a dark polished sphere), docking into five matching sockets along one long base slab. Where each module meets the base, its seam lights up cyan. Five businesses becoming one system.",
  },
  {
    id: "capability-brand",
    section: "Capability: Brand",
    aspect_ratio: "3:4",
    prompt:
      "A tall upright slab of matte graphite with one bold abstract geometric mark cut deep into it, cyan light glowing from inside the cut. Smaller slabs float beside and behind it, each carrying the same mark at a smaller scale, so the mark reads as a system rather than a logo. Sense of permanence and meaning.",
  },
  {
    id: "capability-infrastructure",
    section: "Capability: Infrastructure",
    aspect_ratio: "3:4",
    prompt:
      "An exploded vertical stack of seven thin glass layers, evenly spaced and perfectly aligned on four slender pins of cyan light, resting on a heavy matte graphite base. Each layer carries a different arrangement of blank rounded modules. Engineered to hold under load.",
  },
  {
    id: "capability-ai",
    section: "Capability: AI",
    aspect_ratio: "3:4",
    prompt:
      "A field of many small blank glass tiles floats in loose rows. From each tile a hair-thin cyan filament rises and bends toward one soft sphere of light hovering above a single dark slab, so the whole field visibly attends to one point. One small warm amber spark sits at the sphere's centre. Calm and precise, not science fiction.",
  },
  {
    id: "origin-lagos-model",
    section: "Why Lagos",
    aspect_ratio: "16:9",
    prompt:
      "An architect's scale model of a coastal city at night, built from matte graphite blocks on a dark glass base: dense districts on two shores, a lagoon of polished black glass between them, and one long low bridge crossing the water drawn as a line of cyan light. Tiny warm amber lights in some windows. Seen from high above at an isometric angle, the model floating in darkness. Real, grounded, built under constraint.",
  },
  {
    id: "process-four-stages",
    section: "How it works",
    aspect_ratio: "16:9",
    prompt:
      "Four slabs float in a straight row from left to right, each one a later stage of the same object. First, only an outline drawn in fine cyan light. Second, a translucent glass slab marked with a faint grid, the blueprint. Third, the slab now filled with blank modules being set into place. Fourth, the finished object, solid, glossy and softly lit from within. Even spacing, one continuous story read left to right.",
  },
  {
    id: "cta-first-connection",
    section: "Closing call to action",
    aspect_ratio: "16:9",
    prompt:
      "Two slabs float facing each other across a gap, one larger and one smaller. A single thread of cyan light has just formed between them, warmest amber at the point where it touches the smaller slab. The beginning of a conversation. Both slabs sit in the right half of the frame; the left half is calm empty darkness.",
  },
];
