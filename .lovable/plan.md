## Floating Pill Navbar + Persona Chip — adopting two patterns from the GenAI sample

Two distinct, unique elements from the reference to bring into the site:

### 1. Floating "pill" navbar (the unique menu pattern)

Today the navbar is a full-width fixed bar that just changes background on scroll. Replace that chrome with a **centered floating pill** that detaches from the screen edges — logo + nav items + CTA all wrapped in one rounded glass capsule.

**Visual spec (from reference)**
- Anchored top-center, ~24px from the viewport top (not edge-to-edge).
- Single rounded-full container, dark glass (`backdrop-blur-2xl`, `bg-card/70`, hairline border `border-border/60`, soft outer shadow + inner top highlight).
- Inner padding: `pl-2 pr-2 py-1.5`. Logo sits in a smaller pill on the left, nav links in the middle, "Book a Call" pill (cyan) on the right — all on one row.
- Mega-menu / dropdowns open as **detached glass cards centered under the pill** (not full-width bars), matching the floating aesthetic.
- Scroll behavior: pill **shrinks slightly** (less horizontal padding, lower opacity glow) after 50px scroll instead of changing into a different bar.
- Mobile (<lg): pill collapses to `[logo  ·······  ☰]` only; tapping `☰` opens a full-screen glass sheet (existing mobile menu logic reused).

**Why this works for the brand**: it reads premium and "product-launch", matches the dark glassmorphism core rule, and keeps the existing mega-menu architecture intact (we only restyle the shell).

### 2. Second adopted pattern — Floating "persona" chip on the hero visual

The reference also floats a small circular avatar chip overlapping the phone mockup. That gives it a human, lived-in feel. We can adopt the same pattern on our hero 3D sculpture:

- A small circular chip floating top-right of the visual: founder avatar (Jeremiah's existing photo) + a 2-line speech-bubble card pointing to it: *"Architected by builders who've shipped 40+ brands."*
- The card is glass (`glass-card-subtle`), rounded-2xl, gentle `animate-float` with a different delay than the sculpture so they drift independently.
- Reinforces the "Growth Architects" positioning without adding a section.

### File changes

- **`src/components/Navbar.tsx`** — restructure outer `<header>` into a centered floating container:
  - Wrapper: `fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]`
  - Inner pill: `flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] px-2 py-1.5`
  - Logo: shrink to compact lockup inside its own subtle inner pill
  - Nav links: keep current items, smaller text (`text-sm`), rounded-full hover state
  - CTA: keep cyan pill on the right
  - Scrolled state: tighten padding + reduce shadow intensity (no width change to avoid layout shift)
  - Dropdown content: switch to detached `rounded-2xl` glass card, anchored under the trigger, max-w 480px
- **`src/components/Navbar.tsx`** — adjust mobile sheet so it opens as a top-anchored glass sheet aligned to the floating pill
- **`src/components/HeroSection.tsx`** — add the floating persona chip absolutely positioned over the right-column visual (top-right on lg, hidden on <sm to keep mobile clean)
- **`src/index.css`** — small `.nav-pill` utility (just the shadow + inner highlight if not already covered) — only if needed
- **No changes** to: routes, content, services data, or any downstream section

### Acceptance
- Navbar visibly floats with rounded edges on all pages, dark glass shows the page through it.
- Mega-menu dropdowns open as floating cards under the pill (not full-width).
- Hero shows the new persona chip on lg+ viewports, gracefully hidden below sm.
- Mobile menu still works (full-screen sheet) and closes on route change.
- No regressions to existing nav links, dropdown items, or CTAs.

### Out of scope
- Copy rewrites for nav items.
- Restructuring the mega-menu information architecture.
- Changing brand tokens or fonts.
