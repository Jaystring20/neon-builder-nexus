
# DCH × Superside UX Pattern Alignment

I scraped superside.com to map their flow. Below is what they do well, what we'll borrow (UX patterns, NOT visual identity — DCH keeps its dark neon-cyan/orange "Builder" brand per memory), and the exact changes to ship.

## What Superside does that we should adopt

1. **Hero = Headline + 1 primary CTA + visual proof wall.** They use a single CTA ("Book a demo") repeated everywhere instead of two competing CTAs. The right side is a dense mosaic of real client work (Microsoft, Reddit, Amazon, Roland, Otto…) — proof IS the hero visual.
2. **Logo bar immediately under the hero** — instant credibility before any copy.
3. **Comparison table** ("Hiring or traditional outsourcing? Neither.") — Superside vs In-house vs Agencies vs Freelancers vs AI-only. Sharp positioning device.
4. **Testimonials carousel with face + name + title + company** — high density, auto-scrolling, multiple rows.
5. **"Built for brands that refuse to compromise"** — 4-pillar differentiator block with verb-led labels (Scalable / Flexible / Responsive / Seamless).
6. **One sticky CTA** repeated at every section break, identical label, identical color.
7. **Footer mega-structure** with services grouped by category, resources, company.
8. **Cookie + sticky bottom-right "Talk to us"** persistent contact affordance.

## What's wrong with DCH today (vs. that pattern)

- Two competing hero CTAs ("Start the Build" + "View the Blueprint") split attention.
- Hero proof is a generic image carousel (stock-feel), not a logo wall of real clients.
- No dedicated logo/trust bar directly under the fold.
- No competitive comparison block — visitors don't know why to pick a "Growth Architect" over an agency or freelancer.
- Testimonials section is light/missing density; no auto-scrolling social proof rail.
- CTA labels are inconsistent across sections.
- No persistent floating CTA on long scroll.

## Changes to ship (all UI/presentation only)

### 1. Hero — single-CTA, proof-led (`HeroSection.tsx`)
- Keep headline "The Future is Built. Not Bought." and Builder positioning.
- Demote "View the Blueprint" to a text link under the primary CTA: `Or download the Blueprint →` (anchors to `#blueprint`).
- Primary CTA "Start the Build" scrolls to `#contact` (Project Builder), per memory.
- Replace stock image carousel columns with a **client logo / case-study mosaic** placeholder grid (2 cols mobile, 3 cols desktop) using existing portfolio images from `src/data/portfolio.ts`; titles overlaid bottom-left like Superside (brand name + service tag).

### 2. New Trust Bar component (`TrustBar.tsx`, inserted between Hero and Friction)
- Auto-scrolling marquee of monochrome client/partner logos.
- Tagline left: "Trusted by builders shaping what's next."
- Reuses existing brand stat tokens (500+, 50+, 15+) inline at the right on desktop.

### 3. New Comparison block (`ComparisonSection.tsx`, replaces or sits before `WhyUsSection`)
- Title: "Hiring an agency, freelancers, or AI tools? **None of the above.**"
- 5-column row (DCH | In-house | Agencies | Freelancers | AI-only) × 4-row matrix (Speed, Strategy, Brand IQ, Scalability) with check/dash icons.
- Mobile: collapses to a tabbed view (DCH always pinned).

### 4. Testimonials rail (`TestimonialsSection.tsx`, new, before Blueprint)
- Two auto-scrolling rows (opposite directions, pause on hover) of cards with avatar + quote + name + role + company.
- Seeded with 6 placeholder testimonials matching DCH founder/clients (real copy to be supplied later).

### 5. CTA consistency pass
- Every primary CTA across the page = label "**Start the Build**", links to `#contact`.
- Every secondary CTA = "**View the Blueprint**", links to `#blueprint`.
- Removes the current label drift in `PillarsSection`, `WhyUsSection`, `AboutSnippetSection`, `BlueprintSection`, `CTASection`.

### 6. Floating sticky CTA (`FloatingCTA.tsx`, new)
- Appears after user scrolls past hero (IntersectionObserver on hero sentinel).
- Bottom-right pill, gradient primary, "Start the Build", scrolls to `#contact`.
- Hidden when `#contact` is in view to avoid overlap.

### 7. Section flow re-order in `pages/Index.tsx`
```
Navbar
HeroSection            (single CTA + proof mosaic)
TrustBar               (NEW – logos)
FrictionSection
ResolutionSection
ComparisonSection      (NEW – vs. table)
PillarsSection
WhyUsSection
TestimonialsSection    (NEW – social proof rail)
AboutSnippetSection
BlueprintSection
CTASection             (Project Builder)
Footer
FloatingCTA            (NEW – sticky)
```

### 8. Mobile hero rendering bug (carryover)
- Resolve the invisible mobile headline by removing the `.hero-animate` opacity-0 starting state on viewports <768px and falling back to instant render — animations are nice-to-have, content visibility is not.

## Files touched

- `src/components/HeroSection.tsx` — single CTA + portfolio mosaic, fix mobile invisibility
- `src/components/TrustBar.tsx` — NEW
- `src/components/ComparisonSection.tsx` — NEW
- `src/components/TestimonialsSection.tsx` — NEW
- `src/components/FloatingCTA.tsx` — NEW
- `src/pages/Index.tsx` — re-order + insert new sections
- `src/components/PillarsSection.tsx`, `WhyUsSection.tsx`, `AboutSnippetSection.tsx`, `BlueprintSection.tsx`, `CTASection.tsx` — CTA label/anchor pass
- `src/index.css` — small additions for marquee + comparison table tokens (no token color changes)

## Out of scope (intentionally)

- No visual rebrand. DCH stays dark + neon cyan/orange + Montserrat/Poppins. We are NOT copying Superside's mint-green-on-dark-green palette.
- No backend wiring (form submissions, email capture) — separate task.
- No new copy beyond CTA label normalization and section titles listed above; founder/client testimonial text comes later.
