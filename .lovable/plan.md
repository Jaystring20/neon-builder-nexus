

## Fix Carousel Animation + Mobile Layout

### Problem
The carousel isn't moving because the Tailwind `animate-scroll-up` class sets the full `animation` shorthand (including duration), and the inline `style={{ animationDuration }}` can't reliably override a shorthand property. The two conflict and the animation fails silently.

### Fix

**`src/components/HeroSection.tsx`** — Change the `CarouselColumn` to use inline `style.animation` directly instead of combining a Tailwind animation class with an inline duration override:

```tsx
style={{
  animation: `${direction === "up" ? "scroll-up" : "scroll-down"} ${duration} linear infinite`
}}
```

Remove the `animate-scroll-up` / `animate-scroll-down` className — use only the inline style for the full animation property so there's no conflict.

### Mobile Layout

On mobile (< md), the layout is already stacked (text on top, carousel below at 340px). No structural changes needed — once the animation fix is applied, mobile will show:
- Full-width text content (centered) at the top
- 3-column carousel grid below at 340px height with gradient masks
- Same alternating scroll directions, same pause-on-hover

### Files Changed
1. **`src/components/HeroSection.tsx`** — Replace className-based animation with inline `animation` style property in `CarouselColumn`

