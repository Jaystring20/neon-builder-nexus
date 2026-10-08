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
      "A tall upright slab of matte graphite with one simple abstract mark cut deep into it: an open ring broken by a single short diagonal notch, never a letter or a character, cyan light glowing from inside the cut. Smaller slabs float beside and behind it, each carrying the same ring at a smaller scale, so the mark reads as a system that holds everywhere it appears. Identity that earns attention and keeps it.",
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
      "A thick dark glass slab with one perfectly round optical lens set into its surface. The slab carries only blank rounded pills and plain bars, no writing of any kind. Seen through the lens, those pills and bars are pin sharp; everywhere outside the lens they melt into soft blur. A fine cyan ring of light traces the lens edge, with a thin warm amber highlight catching one side. Clean colour only, no prism or rainbow dispersion. Seeing clearly before you buy.",
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
      "Exactly four slabs, no more and no fewer, float in a straight row from left to right, each one a later stage of the same object. First, a slab under a fine scanning plane of cyan light, being examined. Second, the same slab drawn only as a precise outline with a faint grid, the plan. Third, the slab solid and filling with blank modules being set into place. Fourth, the finished slab with two smaller copies of itself already growing out of it, softly lit from within. Even spacing, one continuous story read left to right.",
  },
  {
    id: "cta-first-connection",
    section: "We don't take every brief.",
    aspect_ratio: "16:9",
    prompt:
      "Two slabs float facing each other across a gap, one larger and one smaller. A single thread of cyan light has just formed between them, warmest amber at the point where it touches the smaller slab. The beginning of the right conversation. Both slabs sit in the right half of the frame; the left half is calm empty darkness.",
  },

  // Services (docs/services-copy.md). One image per practice, used on the
  // overview's practice blocks and as the hero of each practice's own page,
  // plus the overview hero and one image per training track.
  {
    id: "services-engine",
    section: "Services hero: Five practices. One engine.",
    aspect_ratio: "16:9",
    prompt:
      "Five distinct slabs of smoked glass and matte graphite are arranged in a wide, slow ring like the parts of one machine, each slab a different proportion. Fine cyan light lines join each slab to the next so energy visibly passes around the ring, and at the ring's centre a small warm amber core glows where all five lines meet. Five parts, one engine, already turning. Wide composition, the ring sitting slightly right of centre.",
  },
  {
    id: "practice-brand-architecture",
    section: "Practice: Brand Architecture",
    aspect_ratio: "4:3",
    prompt:
      "A heavy matte graphite foundation block, perfectly level, with a precise grid of fine cyan lines engraved across its top face. Three slimmer glass slabs stand upright on it in a deliberate arrangement, their edges aligned exactly to the engraved grid, so everything above clearly rests on the one foundation. The foundation everything else stands on.",
  },
  {
    id: "practice-growth-operations",
    section: "Practice: Growth Operations",
    aspect_ratio: "4:3",
    prompt:
      "A row of glass discs of steadily increasing size, each one turning a little faster than the last, linked edge to edge like gears without teeth. A pulse of cyan light passes from the smallest disc to the largest and grows brighter as it goes, ending as a warm amber glow on the largest disc. Campaigns, content and community running as one system that compounds.",
  },
  {
    id: "practice-digital-infrastructure",
    section: "Practice: Digital Infrastructure",
    aspect_ratio: "4:3",
    prompt:
      "A wide, low platform of interlocking matte graphite modules, like a precise floor plan raised in 3D. Thin cyan channels run between the modules, carrying small pulses of light from one module to the next. A few modules are lifted slightly, showing clean connectors underneath. Solid, engineered, built to carry weight now and extend later.",
  },
  {
    id: "practice-ai-automation",
    section: "Practice: Agentic AI & Automation",
    aspect_ratio: "4:3",
    prompt:
      "A sequence of small glass blocks travels along a curved track of light through three dark glass gates. At each gate a fine cyan scan passes over the block and it comes out a little more complete, with no hand or tool in sight. A single warm amber light marks the one gate where the track pauses for a decision. Work that moves itself along, step after step.",
  },
  {
    id: "practice-training",
    section: "Practice: Training & Workforce Development",
    aspect_ratio: "4:3",
    prompt:
      "A large lit glass slab passes a small bright cube of cyan light across a short gap to a group of smaller slabs standing together. The smaller slabs already glow faintly from within where earlier light has been passed to them, and one of them is beginning to pass its own light onward to the next. Capability that stays after we leave.",
  },
  {
    id: "track-ai-training",
    section: "Training track: AI Training",
    aspect_ratio: "16:9",
    prompt:
      "Three floating platforms of glass rise in three clear stages from left to right. The first holds one simple slab, the second holds slabs linked by fine cyan lines into a working chain, the third holds a small finished structure assembled from many pieces with a warm amber light at its top. From first steps, to automating, to building.",
  },
  {
    id: "track-workforce",
    section: "Training track: Workforce Development",
    aspect_ratio: "16:9",
    prompt:
      "A wide row of identical upright glass slabs stands like a team in a quiet line. A soft band of cyan light sweeps along the row and each slab it passes stays lit from within, so the left half of the row already glows while the right half is about to. The whole team rising together, not one at a time.",
  },
  {
    id: "track-steam",
    section: "Training track: STEAM Training",
    aspect_ratio: "16:9",
    prompt:
      "A small, friendly robotic arm built from rounded glass and matte graphite segments, with soft cyan light glowing at each joint, lifts a single bright cube onto a short stack of cubes on a clean workbench slab. Beside it lie a few simple building pieces: a wheel, a small gear, a circuit-like tile with plain cyan traces. Hands-on making for young innovators, playful and precise.",
  },

  // About (docs/about-copy.md).
  {
    id: "about-beyond-borders",
    section: "About hero: We go where growth needs to happen.",
    aspect_ratio: "16:9",
    prompt:
      "A thick glass slab glides straight through a thin vertical plane of cyan light that stands across the floor like a border, without slowing. The part of the slab that has already passed through glows a little brighter, and a soft cyan trail stretches behind it back through the plane. Ahead of it, open dark space with one small warm amber light far in the distance. No walls, no borders, only forward motion.",
  },
  {
    id: "about-partnership",
    section: "About: Built with partners.",
    aspect_ratio: "16:9",
    prompt:
      "Two different structures, one of matte graphite blocks and one of smoked glass blocks, each build a span toward the other from opposite sides of the frame. They meet exactly in the middle, where a single seam of cyan light joins them into one continuous bridge, with a small warm amber glow at the joint. Two makers, one structure.",
  },
];
