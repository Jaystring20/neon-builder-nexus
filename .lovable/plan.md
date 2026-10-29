# Mobile Hero: tighter, more premium arrangement

Design read: dark, executive agency landing for founders on phones. Calm-confident, one clear action, visual as proof. Mobile only; desktop stays as-is.

## What feels off today (393px)
- Headline at 2.6rem with only 3 words leaves a lot of dead air; it reads small next to the heavy padding.
- Two full-width stacked buttons of equal weight compete; the "Book a call" duplicates the floating button already on the page.
- The micro-line under the buttons uses three middle dots and wraps to two lines.
- The 3D visual / video sits below all the copy, so on first screen the user sees only text and buttons, then scrolls into a large visual with no reason to.

## New mobile arrangement (top to bottom)

```text
[ floating pill nav ]
 small line: "For founders & growing brands"
 GROWTH MADE
 possible.            <- larger, ~3.4rem, tight leading
 short sub-line (~18 words, 3 lines max)
 [ Take the free diagnostic  -> ]   full-width, primary
  Book a call ->                   quiet text link, centred
 "Free, 4 minutes, no sales call"  single line
 [ visual: 3D engine / video, cropped 4:3, peeks above the fold ]
```

1. Headline: bump to ~3.4rem on mobile, leading 1.0, keep "possible." in primary colour. Same font family (no new typeface).
2. Sub-copy: trim to one sentence on mobile ("We build the brand, platforms and people behind your growth, with AI in every layer."); the audience line moves to the small label above the headline. Full copy stays on tablet/desktop.
3. CTAs: one dominant full-width button; "Book a call" becomes a text link under it on mobile only (still routes to the same place). Desktop keeps both buttons.
4. Reassurance line: shortened so it fits on one line, no dot separators.
5. Spacing: top padding just clears the nav, smaller gaps between headline, copy and buttons so the CTA and the top of the visual both show on the first screen (~647px tall).
6. Visual: pulled up with a slight negative overlap and a soft fade at its top edge so it reads as part of the hero, height capped so it does not dominate the scroll.
7. Motion: keep the existing staggered entrance; respect reduced motion (already in place).

## Verification
Screenshot at 393x647 and 360x640 before and after, plus a desktop 1280 check to confirm nothing changed there.

## Technical details
- Edit only `src/components/HeroSection.tsx` (responsive classes, `sm:hidden` / `hidden sm:inline` copy splits, link variant for mobile secondary CTA) and the mobile wrapper in `HeroInline` inside `src/components/HeroMedia.tsx` (aspect, max-height, negative top margin, top fade mask).
- No new dependencies, no colour changes, tokens only.
