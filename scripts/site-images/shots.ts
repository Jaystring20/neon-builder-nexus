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
 * STYLE is shared so the set reads as one shoot. The hero is not here: it is
 * a live flywheel animation built in code (src/components/MomentumFlywheel.tsx),
 * so its labels stay legible and it can respond to the visitor. Section
 * names below follow docs/landing-copy.md.
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
    id: "ai-multiplier",
    section: "AI isn't our pitch. It's our multiplier.",
    aspect_ratio: "4:3",
    prompt:
      "A field of many small blank glass tiles floats in loose rows. From each tile a hair-thin cyan filament rises and bends toward one soft sphere of light hovering above a single dark slab, so the whole field visibly works through one point. One small warm amber spark sits at the sphere's centre. The force that multiplies everything around it. Calm and precise, not science fiction.",
  },
  {
    id: "capability-brand",
    section: "What we build: Brand",
    aspect_ratio: "3:4",
    prompt:
      "A tall upright slab of matte graphite with one bold abstract geometric mark cut deep into it, cyan light glowing from inside the cut. Smaller slabs float beside and behind it, each carrying the same mark at a smaller scale, so the mark reads as a system that holds everywhere it appears. Identity that earns attention and keeps it.",
  },
  {
    id: "capability-platforms",
    section: "What we build: Platforms",
    aspect_ratio: "3:4",
    prompt:
      "An exploded vertical stack of seven thin glass layers, evenly spaced and perfectly aligned on four slender pins of cyan light, resting on a heavy matte graphite base. Each layer carries a different arrangement of blank rounded modules, and small cyan pulses travel up the pins from layer to layer on their own. Software that scales the business and carries the busywork.",
  },
  {
    id: "capability-people",
    section: "What we build: People",
    aspect_ratio: "3:4",
    prompt:
      "A rising staircase of glass slabs, each step a little taller and a little brighter than the one before, climbing from bottom left to top right. A single small slab stands on the lowest step, and its long soft reflection already reaches the top step, where a warm amber light waits. Capability becoming performance, one deliberate step at a time.",
  },
  {
    id: "proof-five-cities",
    section: "Real work: Fitness Religion",
    aspect_ratio: "4:3",
    prompt:
      "One large central glass slab with five smaller identical slabs floating around it in a wide shallow arc. A single continuous line of cyan light leaves the central slab and runs through each of the five in turn, each small slab glowing with the same soft pulse at the same moment. One platform running the same event in five places at once. Calm, precise, symmetrical rhythm.",
  },
  {
    id: "proof-clarity-lens",
    section: "Real work: M & H Eyewear",
    aspect_ratio: "4:3",
    prompt:
      "A thick dark glass slab with one perfectly round optical lens set into its surface. Seen through the lens, the blank interface pills and bars on the slab are pin sharp; everywhere outside the lens they melt into soft blur. A fine cyan ring of light traces the lens edge, with a thin warm amber highlight catching one side. Seeing clearly before you buy.",
  },
  {
    id: "proof-five-modules",
    section: "Real work: Viera Amber",
    aspect_ratio: "4:3",
    prompt:
      "Five distinct modules, each a different shape and material (a smoked-glass cube, a matte graphite cylinder, a brushed-metal pill, a frosted rounded tile, a dark polished sphere), docking into five matching sockets along one long base slab. Where each module meets the base, its seam lights up cyan. Five businesses running as one.",
  },
  {
    id: "audience-startup",
    section: "Who it's for: Startups finding their footing",
    aspect_ratio: "4:3",
    prompt:
      "A single small glass slab has just landed on a wide empty graphite plane, and three thin cyan lines are drawing themselves outward from it across the floor, marking out the foundations of something much larger still to come. Early, light, full of open space. A footing being found.",
  },
  {
    id: "audience-established",
    section: "Who it's for: Established brands ready to evolve",
    aspect_ratio: "4:3",
    prompt:
      "A large, heavy, finished structure of stacked graphite slabs, solid and proven. Its upper layers are lifting gently apart and re-forming into a new, cleaner arrangement, while the base stays perfectly still. Cyan light runs along the seams being rebuilt. Re-forming what's next without losing what got it here.",
  },
  {
    id: "audience-individual",
    section: "Who it's for: People outgrowing where they are",
    aspect_ratio: "4:3",
    prompt:
      "One slender glass slab stands at the start of a long path of floating stepping stones that rises gently into the distance. The stones nearest to it are lit cyan, and the far end of the path glows warm amber. One object, one deliberate path, plenty of open space ahead.",
  },
  {
    id: "process-four-stages",
    section: "How we work: Diagnose. Architect. Build. Compound.",
    aspect_ratio: "16:9",
    prompt:
      "Four slabs float in a straight row from left to right, each one a later stage of the same object. First, a slab under a fine scanning plane of cyan light, being examined. Second, the same slab drawn only as a precise outline with a faint grid, the plan. Third, the slab solid and filling with blank modules being set into place. Fourth, the finished slab with two smaller copies of itself already growing out of it, softly lit from within. Even spacing, one continuous story read left to right.",
  },
  {
    id: "cta-first-connection",
    section: "We don't take every brief.",
    aspect_ratio: "16:9",
    prompt:
      "Two slabs float facing each other across a gap, one larger and one smaller. A single thread of cyan light has just formed between them, warmest amber at the point where it touches the smaller slab. The beginning of the right conversation. Both slabs sit in the right half of the frame; the left half is calm empty darkness.",
  },
];
