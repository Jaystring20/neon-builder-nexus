

## More Innovative Contact Section — "Project Builder" Interactive Experience

Instead of a traditional contact form, we build a **multi-step interactive project builder** that feels like a guided consultation. It matches DCH's "Growth Architect" brand identity — users don't just "fill a form," they **architect their project brief**.

### Concept: The Project Builder

A sleek, step-by-step wizard inside the CTA section with 3-4 steps:

1. **"What are you building?"** — User clicks one or more of the 4 service pillars (Brand Architecture, Digital Infrastructure, AI & Automation, Growth Operations) as selectable cards with icons
2. **"Where are you now?"** — A single-select with options like "Starting from scratch," "Rebranding," "Scaling what works," "Not sure yet"
3. **"How should we reach you?"** — Name, email, optional phone — minimal fields
4. **Confirmation** — Animated success state with a summary of what they selected

### Why This is Better
- **Lower friction** — each step feels lightweight (1 decision at a time)
- **Brand-aligned** — mirrors the "4 Pillars of Momentum" methodology already on the page
- **More data** — you learn what service the lead wants before they even message you
- **Memorable** — no one else in the agency space does this

### Technical Implementation

**File: `src/components/CTASection.tsx`** — Full rewrite:
- State machine with `step` (0-3) tracking current stage
- Step 0: Clickable service pillar cards (pull titles/icons from `serviceCategories` data)
- Step 1: Stage selector with 4 radio-style glass cards
- Step 2: Name + Email fields with validation (react-hook-form + zod)
- Step 3: Animated checkmark + summary + toast confirmation
- Progress indicator dots at the top
- Back/Next navigation with smooth transitions (opacity + translateX)
- All styled with existing glass-card classes, gradient-text, and hover-glow effects

**No other files need changes** — the service data is already in `src/data/services.ts` and can be imported directly.

