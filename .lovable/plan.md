## Hero Redesign — Dark Hybrid with 3D Visual

Goal: lift the hero from "type on a black canvas" to a polished, product-launch-grade dark split layout — anchored by a custom 3D abstract render and surrounded by trust signals.

### Layout (desktop ≥ lg)

```
┌─────────────────────────────────────────────────────────┐
│  [★★★★★ 5.0 — trusted by 40+ founders]                  │
│                                                          │
│   The Future                          ╭──────────────╮  │
│   is  Built.                          │   3D abstract │  │
│   Not Bought.                         │   render with │  │
│                                       │   cyan/orange │  │
│   Sub-headline copy (2 lines)         │   glow + soft │  │
│                                       │   parallax    │  │
│   [ Start the Build → ]  [ See Work ] ╰──────────────╯  │
│                                                          │
│   ── Trusted by ──                                       │
│   logo  logo  logo  logo  logo  logo  (muted, marquee)   │
└─────────────────────────────────────────────────────────┘
```

- Split: left column ~58% (text), right column ~42% (visual). Stacks vertically on mobile (visual below text, max-h capped).
- Min height: `min-h-[100svh]` desktop, `min-h-[88svh]` mobile.

### Content blocks (top → bottom)

1. **Reviews badge** — small pill above headline: star icon + "5.0 · trusted by 40+ founders". Subtle bordered glass pill, primary star.
2. **Headline** — keep current treatment ("The Future / is *Built.* / Not Bought.") but tighten to fit split column. Slightly smaller cap (max ~7rem at lg) so the visual gets room.
3. **Sub-headline** — current copy, no change.
4. **Dual CTA** — primary `Start the Build` (pill, scrolls to `#contact`) + ghost `See the Work` (links to `/our-work`).
5. **Client logo strip** — "Trusted by" eyebrow + 6 muted SVG/text logos in a slow horizontal marquee (already have `scroll-left` keyframe). Use placeholder text-logos for now (Stripe, Notion, Linear, Vercel, Framer, Webflow style — but use generic project-relevant names).

### Right-side visual

- New asset: `src/assets/hero-3d-architecture.png` generated via `imagegen` (premium, transparent bg).
- Prompt direction: abstract architectural 3D structure — interlocking translucent geometric blocks/towers, glowing cyan edges, warm orange accent light, glassy material, dark void background, dramatic side lighting, premium product render, octane-style.
- Placement: floats inside a soft radial glow halo (cyan + orange blooms behind). Subtle `animate-float` (existing utility) for life. No heavy parallax JS.
- Mobile: render below text at ~280px height, centered.

### File changes

- **`src/components/HeroSection.tsx`** — full rewrite of the section JSX:
  - Two-column grid (`grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center`)
  - New `ReviewsBadge` inline subcomponent at top
  - Headline cap reduced one step (`lg:text-[7rem]`, "Built." `lg:text-[8.5rem]`) to balance split
  - Dual CTA row (primary pill + ghost variant)
  - Right column: 3D image inside glow halo
  - Logo strip below the grid (full-width, marquee)
- **`src/assets/hero-3d-architecture.png`** — new generated asset (premium, transparent).
- **`src/index.css`** — add `.hero-glow-halo` helper (cyan + orange radial blooms) and `.logo-strip-fade` edge masks. No token changes.
- **`src/pages/Index.tsx`** — no structural change; the existing `HeroVisualSection` (two-row marquee on cream) stays as the next section ("Builds that ship.") so we keep the dark→light exhale.

### Out of scope
- No copy rewrites beyond adding badge + logo eyebrow.
- No nav, footer, or downstream section changes.
- No 3D library (react-three-fiber not needed) — single rendered image keeps it fast and crisp.
- No business logic.

### Acceptance
- Above-the-fold on 1440px shows: badge, full headline, sub, dual CTA, visual, and the top of the logo strip.
- On 1007px (current preview) the split holds; on <768px text stacks above visual.
- All animations are CSS keyframes with staggered delays (per project rule), no IntersectionObserver above the fold.
