
# Hero & Section Rhythm Overhaul — Superside-Inspired Polish

Goal: take the landing page from "busy neon dark" to the calm, premium, editorial feel of superside.com — while keeping DCH's brand identity (dark dominant, neon cyan/orange accents, Montserrat/Poppins). The current hero feels cluttered: scrolling proof columns on desktop, a marquee on mobile, two CTAs visually competing, badge + headline + 2 paragraphs + button + text link + carousel all crammed above the fold.

## What Superside does (ref: uploaded screenshots)

1. **Hero is breathable.** Just a logo, a single oversized editorial headline (mixed sans + serif italic), one short supporting paragraph, ONE pill CTA. No proof, no carousel, no badge.
2. **Proof comes AFTER the hero**, in its own block: a clean light section "Trusted by 500+ of the world's top brands" with monochrome logos.
3. **Then a tall, single hero image** in another light section.
4. **Alternating dark → light → dark → light rhythm**, with dark dominating. White sections act as "exhale" moments to highlight proof and editorial copy.
5. **Typography drives the polish**: huge headlines, generous line-height, italic serif accents on key words.

## What's wrong with our hero today

- Two-column layout with three scrolling proof columns on the right = noisy.
- Badge "Business Development Creative Agency" + headline + TWO paragraphs + CTA + secondary text link + mobile marquee = 6 competing elements above the fold.
- Mobile shows headline + sub-copy + CTA + a horizontal scrolling rail right under the button — the user can't focus.
- Page is 100% dark from top to bottom — no contrast rhythm, everything starts to feel the same after 2 scrolls.
- Headline uses gradient on "Built." which fights the rest of the type. Superside uses a single color + italic serif for emphasis, much calmer.

## Changes to ship

### 1. `HeroSection.tsx` — strip it down to a Superside-grade hero
- Remove the badge pill ("Business Development Creative Agency").
- Remove the desktop 3-column scrolling proof mosaic.
- Remove the mobile horizontal proof rail (`MobileProofRail`).
- Remove the second supporting paragraph. Keep ONE tight sub-copy (≤2 lines).
- Remove the secondary "Or download the Builder's Blueprint" text link from the hero. (It will live further down the page; one CTA in the hero only.)
- Keep one centered/left-aligned editorial layout (single column, max-w ~5xl, generous vertical padding).
- Headline restyle: sans-serif for "The Future is" + "Not Bought." and **italic serif (Playfair Display or similar already in tailwind config)** for "Built." — replaces the gradient treatment. One brand color, no glow.
- Single primary CTA pill: "Start the Build" → `#contact`. Use a wider, taller pill (rounded-full, h-14, px-10) to match Superside's button presence.
- Remove the scroll indicator bounce (low signal, adds noise).
- Background: keep the subtle radial blur but lower opacity (currently 0.15 → 0.08) and remove the `heroBg` image overlay so the section reads as pure brand-dark.

### 2. New `HeroProofSection.tsx` (light section, full-bleed white/cream)
- Inserted directly after the hero, replacing the current `TrustBar` position (TrustBar is removed or absorbed here).
- Background: `bg-background` swapped to a new token `--surface-inverse` (off-white #F5F4EE-ish, matching Superside's cream).
- Centered eyebrow: "Trusted by builders shaping what's next." (dark text on cream).
- Row of 4–6 monochrome client/partner logos (use placeholder marks from `/portfolio` data or simple SVG lockups).
- Generous vertical padding (`py-20 md:py-28`).

### 3. New `HeroVisualSection.tsx` (light section, single editorial image)
- Tall single hero image, full-bleed within container, rounded-2xl.
- Pulls the top portfolio piece (`portfolioProjects[0]`) as the image; caption underneath: brand + service tag.
- Same cream background as #2 to read as one continuous "exhale" block.

### 4. Section rhythm in `pages/Index.tsx`
Re-order to alternate dark/light, dark dominating:
```
Navbar                     (dark)
HeroSection                (dark)  ← stripped
HeroProofSection           (LIGHT) ← new, replaces TrustBar
HeroVisualSection          (LIGHT) ← new
FrictionSection            (dark)
ResolutionSection          (dark)
ComparisonSection          (LIGHT) ← reskin to cream surface
PillarsSection             (dark)
WhyUsSection               (dark)
TestimonialsSection        (LIGHT) ← reskin
AboutSnippetSection        (dark)
BlueprintSection           (dark)
CTASection                 (dark)
Footer                     (dark)
FloatingCTA                (overlay)
```
Net ratio ≈ 60% dark / 40% light, dark dominant.

### 5. `index.css` / `tailwind.config.ts` — add inverse surface tokens
Add semantic tokens (HSL) so light sections stay on-brand:
```
--surface-inverse:        45 20% 96%   /* warm off-white */
--surface-inverse-foreground: 220 15% 12%
--surface-inverse-muted:  45 15% 88%
--border-inverse:         45 10% 80%
```
Add a `.section-inverse` utility class that flips `bg`, `text`, `border` so reskinning Comparison/Testimonials is a one-liner without touching their internals.

### 6. Tiny CTA polish
- Replace the current `variant="hero"` (gradient + glow) with a calmer pill: solid primary (cyan), `rounded-full`, no glow shadow, subtle hover lift. Keeps the Superside "single confident pill" feeling. Apply this new variant (`variant="pill"`) only in the hero; rest of page keeps existing hero variant for now to avoid scope creep.

## Files touched

- `src/components/HeroSection.tsx` — major strip-down + restyle
- `src/components/HeroProofSection.tsx` — NEW (replaces visual role of `TrustBar` in the hero area)
- `src/components/HeroVisualSection.tsx` — NEW
- `src/components/ComparisonSection.tsx` — wrap in `.section-inverse`
- `src/components/TestimonialsSection.tsx` — wrap in `.section-inverse`
- `src/pages/Index.tsx` — re-order, swap TrustBar for HeroProofSection + HeroVisualSection
- `src/components/ui/button.tsx` — add `pill` variant
- `src/index.css` + `tailwind.config.ts` — add `--surface-inverse` token + `.section-inverse` utility

## Out of scope

- No copy rewrites beyond the hero trims listed above.
- No real client logos (placeholders/monochrome marks only — real logos to be supplied later).
- TrustBar component is removed from the homepage but file kept (in case used elsewhere); not deleted.
- `FloatingCTA`, navbar, footer untouched.
- No new images generated; reuse `portfolioProjects[0].image` for the editorial visual.

## Why this works

- One CTA, one headline, one breath of copy → matches the Superside hero discipline.
- Cream sections immediately under the dark hero create the contrast rhythm the user asked for.
- Brand identity preserved: dark stays dominant, neon cyan stays the accent, Montserrat/Poppins unchanged. We're borrowing Superside's *composition discipline*, not its color palette.
