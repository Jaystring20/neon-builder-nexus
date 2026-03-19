

## Hero Section Redesign — Split Layout with Alternating Carousel Grid

### Layout

Split-screen: **left side** has badge, headline, subtext, CTAs, trust indicators (left-aligned). **Right side** has a 3-column vertical carousel grid with portfolio images.

### Carousel Behavior

- **Column 1**: scrolls **upward** (~25s loop)
- **Column 2**: scrolls **downward** (~30s loop)
- **Column 3**: scrolls **upward** (~20s loop)

Columns are vertically offset from each other for the interlocked/masonry feel. Gradient fades at top and bottom edges. Pauses on hover.

### Files Changed

1. **`src/components/HeroSection.tsx`** — Full rewrite with split layout. Right side renders 3 columns of duplicated portfolio images, each with `overflow-hidden` and CSS-animated inner containers. Odd columns use `scroll-up`, even column uses `scroll-down`.

2. **`tailwind.config.ts`** — Add two keyframes:
   - `scroll-up`: `translateY(0)` → `translateY(-50%)`
   - `scroll-down`: `translateY(-50%)` → `translateY(0)`

3. **No new dependencies** — pure CSS animations, existing portfolio images from `src/assets/portfolio/`.

### Responsive

- Desktop (≥md): side-by-side flex layout
- Mobile (<md): stacked — text on top, carousel below at reduced height (~300px)

