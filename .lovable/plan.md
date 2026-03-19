

## Fix Mobile Hero Content Being Pushed Off-Screen

### Root Cause
On mobile, `min-h-screen flex items-center` vertically centers all content (text + carousel + stats). The total content height exceeds 575px viewport, so centering pushes the top of the content above the fold. The 80px `pt-20` navbar offset makes it worse.

### Fix

**`src/components/HeroSection.tsx`**:
- Change the section from `items-center` to `items-start` on mobile: `items-start md:items-center`
- Reduce mobile top padding: `pt-24 md:pt-20` (just enough to clear navbar)
- Remove `min-h-screen` on mobile in favor of auto height: use `min-h-[auto] md:min-h-screen` or simply let content flow naturally
- Reduce `mb-8` on the badge, `mb-10` on text, and `mt-12` on stats section for mobile to tighten spacing
- Consider moving MobileCarousel **above** the CTA buttons but **below** the headline+description to keep the most important content visible first

### Files Changed
1. `src/components/HeroSection.tsx` — Adjust mobile vertical alignment and spacing

