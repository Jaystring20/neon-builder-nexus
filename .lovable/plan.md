

## Fix: Hero Section Text Invisible on Mobile

### Root Cause
The `ScrollReveal` components wrap all hero text in `opacity-0` initially, waiting for the IntersectionObserver to trigger. On mobile, the content is likely not intersecting the viewport properly (possibly due to the section's layout or the observer's threshold), so the text **never becomes visible** — leaving a blank dark screen with only the carousel (which doesn't use ScrollReveal) showing at the bottom.

### Fix

**`src/components/HeroSection.tsx`**:

1. **Remove `ScrollReveal` wrappers on mobile-critical content** — Instead of relying on intersection observers for above-the-fold hero content (which should be immediately visible), either:
   - Remove `ScrollReveal` from the hero section entirely and use simple CSS animations with `animate-fade-up-elegant` (already defined in tailwind config), OR
   - Keep `ScrollReveal` but ensure it starts visible for the first few elements by adding a fallback

   The cleaner approach: **Replace all `ScrollReveal` wrappers in the hero with direct CSS animation classes** using staggered `animation-delay`. This guarantees content is always visible and animates on load without depending on scroll observers.

2. **Apply staggered entrance animations directly**:
   - Badge: `animate-fade-up-elegant` with no delay
   - Headline: `animate-fade-up-elegant` with `animation-delay: 100ms`
   - Description: `animation-delay: 200ms`
   - Mobile carousel: no animation (immediate)
   - CTA buttons: `animation-delay: 300ms`
   - Stats: `animation-delay: 400ms`

   Each element starts with `opacity-0` in the animation keyframe itself (already defined: `fade-up-elegant` goes from `opacity:0, translateY(40px)` to `opacity:1, translateY(0)`) and `animation-fill-mode: forwards` (already set via `forwards` in the tailwind config).

### Files Changed
1. `src/components/HeroSection.tsx` — Replace `ScrollReveal` wrappers with direct CSS animation classes

