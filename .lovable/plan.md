

## Generate Hyper-Realistic Hero Carousel Images

### What Changes

Replace the 10 portfolio screenshot images in the hero carousel with AI-generated hyper-realistic visuals that represent DCH's core service pillars and brand identity.

### Images to Generate (10 total)

Distributed across the four service pillars:

**Brand Architecture (3 images)**
1. A luminous brand identity system — golden geometric letterforms floating in dark space with light refractions
2. A designer's desk with premium stationery mockups, color swatches, and a sleek logo on matte paper
3. Abstract sculptural typography — monumental 3D letters with dramatic studio lighting

**Digital Infrastructure (3 images)**
1. A futuristic holographic UI dashboard floating in a dark environment with glowing data streams
2. A sleek device ecosystem — laptop, tablet, phone displaying cohesive interfaces, connected by light threads
3. An isometric digital city made of code blocks and circuit patterns with neon accents

**Agentic AI & Automation (2 images)**
1. A humanoid silhouette composed of flowing data particles and neural network pathways
2. Robotic hands assembling a glowing brand symbol from light fragments

**Growth Operations (2 images)**
1. An upward-spiraling staircase of light representing growth trajectory, with metrics floating alongside
2. A dynamic network of interconnected nodes pulsing with energy — community and funnel architecture

### Process

1. Generate all 10 images using the AI image model (`google/gemini-3-pro-image-preview` for higher quality)
2. Save them to `public/images/hero/` with descriptive filenames
3. Update `HeroSection.tsx` to import and use the new images instead of portfolio screenshots

### Files Changed

1. **10 new image files** in `public/images/hero/`
2. **`src/components/HeroSection.tsx`** — swap imports from `src/assets/portfolio/` to the new hero images

### Technical Details

- Images generated at high resolution via the AI gateway script
- Saved as PNG to `public/images/hero/` for static serving
- Dark/moody color palette to match the site's dark theme with primary (gold/amber) and secondary accent colors
- Each image prompt crafted for cinematic, hyper-realistic quality with no text in the images

