

## Revert and Re-apply: Mobile Horizontal Carousel Only

### Problem
Multiple rounds of fixes have drifted the hero section away from its original working state. The user wants the original hero back, with only the carousel changed to horizontal on mobile.

### Approach

**Step 1: Revert `src/components/HeroSection.tsx` to its original state**

Restore the original hero section exactly as it was — with `ScrollReveal` wrappers, `min-h-screen`, `items-center`, and the full desktop layout. This is the version that was working before we started modifying it.

**Step 2: Apply one targeted change — mobile carousel only**

In the restored file, make these minimal changes:

1. Add `allImages` array (combine col1 + col2 + col3)
2. Add the `MobileCarousel` component (horizontal auto-scrolling strip, `md:hidden`)
3. Place `<MobileCarousel />` between the description text and the CTA buttons, inside the existing `ScrollReveal` wrapper structure
4. Add `hidden md:block` to the desktop vertical carousel grid container so it hides on mobile
5. Keep ALL existing `ScrollReveal` wrappers, spacing, and layout classes exactly as they were

**Step 3: Ensure `scroll-left` keyframe exists in `src/index.css`**

This was already added and should remain.

### Files Changed
1. `src/components/HeroSection.tsx` — Revert to original, then add mobile horizontal carousel
2. `src/index.css` — Keep existing `scroll-left` keyframe (no changes needed)

