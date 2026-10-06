/**
 * The homepage's visual story, one entry per image.
 *
 * Every image is mood and story, never evidence (PRODUCT.md, principle 2):
 * no client products, logos, people presented as real, or readable UI.
 *
 * STYLE is shared so the set reads as one shoot. Once the hero is approved
 * it also becomes the reference image for the rest.
 */

export const STYLE = [
  "cinematic editorial photograph, shot on large-format camera, 35mm lens",
  "deep blue-black night palette with a single cool teal-cyan light source and small warm amber accents",
  "restrained, quiet, lots of negative space, subject placed off-centre leaving calm space for a headline",
  "natural film grain, soft volumetric haze, physically plausible light",
  "no text, no letters, no logos, no user interface, no holograms, no neon signs, no glowing arrows or charts",
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
    id: "hero-blueprint-city",
    section: "Hero",
    aspect_ratio: "16:9",
    prompt:
      "An architect's drafting table on a rooftop at dusk. A large paper blueprint lies flat on the table, and its fine ink lines rise off the paper as thin threads of teal light that become the real towers and bridges of a city skyline in the distance. The left half of the frame is dark, quiet sky.",
  },
  {
    id: "proof-five-cities",
    section: "Proof: Fitness Religion",
    aspect_ratio: "16:9",
    prompt:
      "Aerial view at first light of a vast landscape with five distant cities, each a small cluster of warm lights, connected by a single continuous thread of teal light running across the land like one heartbeat. Mist in the valleys.",
  },
  {
    id: "proof-clarity-lens",
    section: "Proof: M & H Eyewear",
    aspect_ratio: "4:5",
    prompt:
      "Macro photograph of a single optical lens held in a beam of teal light; behind the lens the world is soft and blurred, through the lens it is perfectly sharp. A thin warm amber rim light on the lens edge. Dark background.",
  },
  {
    id: "proof-five-threads",
    section: "Proof: Viera Amber",
    aspect_ratio: "4:5",
    prompt:
      "Five strands of different materials (silk, copper wire, cotton, linen, paper cord) twisting together into one strong cord, lit from one side with teal light, warm amber highlights where they meet. Dark studio background, extreme detail.",
  },
  {
    id: "capability-brand",
    section: "Capability: Brand",
    aspect_ratio: "3:4",
    prompt:
      "A single bold geometric mark carved into a slab of dark stone, raking teal light catching the edges of the cut, dust in the air. Sense of permanence.",
  },
  {
    id: "capability-infrastructure",
    section: "Capability: Infrastructure",
    aspect_ratio: "3:4",
    prompt:
      "Looking up inside a steel and concrete structure under construction at night, clean repeating beams and cables forming a precise grid, one teal work light, a few warm amber lamps far away.",
  },
  {
    id: "capability-ai",
    section: "Capability: AI",
    aspect_ratio: "3:4",
    prompt:
      "A dark room where thousands of fine teal light filaments hang from the ceiling and bend gently toward a single warm amber point, like a field of attention. Calm, precise, not science fiction.",
  },
  {
    id: "origin-lagos-night",
    section: "Why Lagos",
    aspect_ratio: "21:9",
    prompt:
      "Long-exposure photograph of the Third Mainland Bridge in Lagos at night, light trails of traffic running across the lagoon, the city skyline beyond, water reflecting teal and amber light. Real, documentary feel.",
  },
  {
    id: "process-sketch-to-building",
    section: "How it works",
    aspect_ratio: "21:9",
    prompt:
      "One continuous panoramic scene read left to right: a pencil sketch on paper, which becomes a precise technical drawing, which becomes a steel frame under construction, which becomes a finished glass building lit from inside at night. Seamless transitions, teal light throughout.",
  },
  {
    id: "cta-open-door",
    section: "Closing call to action",
    aspect_ratio: "16:9",
    prompt:
      "A tall open doorway in a dark concrete wall with warm amber light spilling out onto the floor and a faint teal glow inside, a quiet workspace just visible beyond. Inviting, calm, the right side of the frame dark and empty.",
  },
];
