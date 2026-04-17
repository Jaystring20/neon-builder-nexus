

# UX Audit and Optimization Plan — Landing Page

## Critical Issues Found

### 1. HERO SECTION — Mobile Completely Broken (CRITICAL)
The hero section on mobile (390px) shows a blank screen with only the image carousel visible at the bottom. All text content (headline, sub-copy, CTAs) is invisible. This is the single biggest conversion killer — visitors see nothing above the fold.

**Root cause**: The hero text and carousel share a flex container that pushes content out of viewport on small screens. The `lg:min-h-screen` and `items-start` layout combined with excessive padding creates a void.

**Fix**: Restructure the hero section so mobile text content is always visible first, with proper top padding accounting for the fixed navbar (h-20). Ensure headline, sub-copy, and CTA buttons render fully within the mobile viewport before the marquee carousel.

---

### 2. NAVBAR — Mobile Polish
- The brand name is hidden on small screens (`hidden sm:block`) — visitors only see the tiny logo icon, reducing brand recognition.
- Mobile menu lacks visual hierarchy separation between primary nav items.

**Fix**: Show a shorter brand name on mobile (e.g., just "DCH"). Add subtle dividers between mobile menu sections.

---

### 3. SECTION SPACING — Excessive Empty Space Between Sections
Scrolling through the page reveals large gaps of empty space between sections (particularly between Friction/Resolution and Pillars/WhyUs). This breaks visual flow and makes the page feel incomplete.

**Fix**: Audit `section-padding` values and reduce vertical padding from the current values to tighter, more professional spacing. Desktop: `py-20`, Mobile: `py-12`.

---

### 4. CTA SECTION (Project Builder) — UX Polish
- Step progress dots are small and hard to read on mobile.
- The "Back" button uses `ghost` variant which is nearly invisible against the dark background.
- No visual confirmation that selections have been saved when moving between steps.

**Fix**: Increase tap target sizes. Make the Back button more visible with `subtle` variant. Add a subtle selection count indicator on Step 0.

---

### 5. BLUEPRINT SECTION — Form UX
- The email input and button stack awkwardly on small screens.
- Book cover image could be better proportioned on mobile.

**Fix**: Ensure form input and button stack cleanly on mobile with full-width treatment. Hide or reduce book cover size on mobile to prioritize the email capture.

---

### 6. FOOTER — Mobile Layout
- The 5-column grid collapses to 2 columns on mobile, which works but creates a lot of scrolling.
- Social icons are small and closely spaced for touch targets.

**Fix**: Increase social icon touch targets. Consider an accordion pattern for footer links on mobile.

---

### 7. SCROLL INDICATOR — Positioning
- The bounce-scroll indicator at the bottom of the hero is hidden on mobile (`hidden md:flex`) — but that's where it's most needed since mobile users can't see the content below.

**Fix**: Show the scroll indicator on mobile too, positioned just above the marquee carousel.

---

## Implementation Summary

| Section | Priority | Type |
|---------|----------|------|
| Hero mobile layout fix | P0 | Critical bug |
| Section spacing tightening | P1 | Visual polish |
| Navbar mobile brand name | P1 | Branding |
| CTA wizard UX improvements | P2 | Interaction polish |
| Blueprint form mobile | P2 | Conversion |
| Footer mobile touch targets | P3 | Accessibility |
| Scroll indicator mobile | P3 | Discoverability |

### Files to modify:
- `src/components/HeroSection.tsx` — major mobile layout restructure
- `src/index.css` — section-padding adjustments
- `src/components/Navbar.tsx` — mobile brand name
- `src/components/CTASection.tsx` — wizard UX improvements
- `src/components/BlueprintSection.tsx` — mobile form layout
- `src/components/Footer.tsx` — touch target improvements

