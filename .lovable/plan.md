

## Mobile Hero: Horizontal Marquee Strip

### What changes

On mobile (below `md` breakpoint), replace the 3-column vertical carousel with a **full-width horizontal auto-scrolling strip** of all 10 images. Desktop stays unchanged.

### Implementation

**1. `src/index.css`** — Add horizontal scroll keyframe:
```css
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

**2. `src/components/HeroSection.tsx`**:
- Combine all 10 images into a single `allImages` array
- Add a `MobileCarousel` component: a horizontal row of all images (doubled for seamless loop), each rendered as a rounded card (~220px wide × 150px tall), animated with `scroll-left 30s linear infinite`
- Left/right horizontal gradient fade masks on the edges
- Container height ~180px, compact so hero text stays the focal point
- Wrap existing 3-column grid in `hidden md:flex`
- Show `MobileCarousel` with `md:hidden`
- Pause animation on touch/hover

### Files changed
1. `src/index.css`
2. `src/components/HeroSection.tsx`

