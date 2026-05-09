# Hero Headline Redesign — Superside Editorial Style

## What's wrong now
The current headline uses **uppercase Bricolage Grotesque** with a tiny italic "Built." accent. It reads as a brutalist poster, not the refined editorial voice Superside uses. The reference shows:

- **Sentence case**, not uppercase
- A **large, flowing italic serif** word (`creative team's`) carrying equal weight to the sans
- Tight but airy line-height, generous tracking
- Soft mint/primary color on the italic phrase — sans stays foreground white
- A single full-width pill CTA directly underneath

## New headline treatment

Copy stays: **"The Future is Built. Not Bought."** — but restructured visually so the italic serif becomes the hero, not a footnote.

```text
The Future
is  Built.
Not Bought.
```

- Line 1: `The Future` — sans, foreground, regular weight
- Line 2: `is` (sans, foreground) + `Built.` (italic serif, primary color, oversized — the visual anchor)
- Line 3: `Not Bought.` — sans, foreground

## Technical changes

### `src/components/HeroSection.tsx`
- Remove `font-display-bold` + `uppercase` from `<h1>`
- Switch base to a **refined sans** (keep Bricolage but use weight 500–600, normal case, tight tracking `-0.02em`)
- Wrap `Built.` in a span: `font-serif-display italic text-primary` — sized **~1.15× the sans** so it visually dominates (e.g. sans `text-6xl md:text-8xl`, serif `text-7xl md:text-[9rem]`)
- Line-height: `leading-[1.05]` mobile, `leading-[1.0]` desktop
- Keep center alignment on mobile, left on desktop (unchanged)
- Pill CTA: keep current, but on mobile make it `w-full` to match Superside's full-width pill

### `src/index.css`
- Add a `.font-display-refined` utility: `font-family: 'Bricolage Grotesque'; font-weight: 500; letter-spacing: -0.025em; line-height: 1.0;`
- (Keep `font-display-bold` available — other sections still use it)

### No other files touched
HeroProofSection, HeroVisualSection, button variants, section rhythm — all stay as-is.

## Out of scope
- No copy rewrites
- No color/token changes
- No changes to other sections or the marquee
