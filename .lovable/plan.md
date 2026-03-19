

## Fix Carousel Animation + Regenerate Brand-Aligned Images

### Two Problems

**1. Carousel still not moving**
The `scroll-up` / `scroll-down` keyframes are defined in `tailwind.config.ts`, but Tailwind only emits `@keyframes` CSS when the corresponding utility class (`animate-scroll-up`) is used somewhere in the code. Since the component uses an inline `style={{ animation: "scroll-up ..." }}` instead of the Tailwind class, the keyframes are never generated in the CSS output. The animation references keyframes that do not exist in the stylesheet.

**Fix**: Add the `@keyframes scroll-up` and `@keyframes scroll-down` rules directly in `src/index.css` so they are always present regardless of Tailwind class usage.

**2. Images feel generic / sci-fi — not DCH**
The current AI-generated images lean too heavily into abstract sci-fi aesthetics. They need to reflect DCH's actual identity: human-led execution, business growth momentum, and an Afrofuturist edge.

**Fix**: Regenerate all 10 images with refined prompts that center:
- Real people (diverse, confident professionals) collaborating, leading, building
- Business momentum — growth charts, conversion systems, strategic planning
- Afrofuturist aesthetic — bold color palettes, cultural depth, futuristic but grounded
- Dark moody backgrounds with cyan and orange accent lighting to match the site palette

### New Image Concepts (10 total)

**Human-Led Execution (4 images)**
1. A confident Black creative director reviewing brand boards on a glass wall, neon cyan ambient lighting, cinematic dark studio
2. A diverse team around a holographic strategy table, Afrofuturist office, warm orange and cool cyan lighting
3. Hands assembling a glowing brand identity puzzle — close-up, dramatic lighting, dark background
4. A female strategist presenting to a boardroom with data visualizations floating around her, futuristic but grounded

**Business Growth (3 images)**
1. An ascending spiral of glowing metrics and growth charts, dark background, cyan and orange data streams
2. A funnel architecture visualization — leads flowing through stages, converting into golden results, dark cinematic
3. A dynamic network of interconnected communities pulsing with energy, Afrofuturist city skyline backdrop

**Afrofuturist Edge (3 images)**
1. A bold geometric brand mark being forged in light, African-inspired patterns, dark studio with neon accents
2. A futuristic workspace blending traditional craftsmanship with AI interfaces, warm and cool lighting
3. A monumental architectural structure made of light and data, inspired by African geometric art, dramatic scale

### Files Changed

1. **`src/index.css`** — Add `@keyframes scroll-up` and `@keyframes scroll-down` rules in the utilities layer
2. **10 new images** in `public/images/hero/` — replacing existing files with brand-aligned visuals
3. **`src/components/HeroSection.tsx`** — Minor: update alt text to be more descriptive; filenames may change

### Process

1. Add keyframes to CSS (fixes animation immediately)
2. Generate all 10 images via AI image model with carefully crafted prompts
3. Save to `public/images/hero/`, update component references

