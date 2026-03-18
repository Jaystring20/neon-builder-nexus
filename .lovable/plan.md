

## Fix: Mega Menu Overflow / Cutoff on Right Side

### Problem
The mega menu is set to `w-[1100px]` but the viewport is only 952px wide. The dropdown is anchored to the "What We Do" trigger position, causing the right columns to overflow and get clipped.

### Solution
Two changes in `src/components/Navbar.tsx`:

1. **Reduce the mega menu width** from `w-[1100px]` to `w-[min(1100px,95vw)]` so it never exceeds the viewport
2. **Shift the dropdown to the left** by adding a negative left offset or using Radix's `align="start"` positioning — but the simpler fix is to add a CSS class that positions the content relative to the viewport center rather than the trigger

Specifically:
- Change the container from `w-[1100px]` to `w-[min(1050px,calc(100vw-2rem))]` — responsive to any screen
- Add `-translate-x-1/2 left-1/2 relative` or use the `NavigationMenuContent` with a `forceMount` + absolute positioning approach
- The cleanest approach: add `!left-auto !right-0` to the `NavigationMenuContent` to anchor it to the right edge of the nav instead of the trigger, preventing right-side overflow. Or better yet, use a fixed/absolute approach that centers the mega menu under the full navbar.

### Recommended Approach
Add a custom class to the `NavigationMenuContent` that forces the dropdown to align to the right side of the viewport boundary, and reduce the width slightly to `w-[min(1050px,calc(100vw-2rem))]`:

**File: `src/components/Navbar.tsx`** (line 71-72)
- Add positioning classes to `NavigationMenuContent`: `className="!left-auto !right-0"` or use inline style `style={{ left: '50%', transform: 'translateX(-50%)' }}` to center it under the nav
- Change `w-[1100px]` → `w-[min(1050px,calc(100vw-2rem))]`

This ensures the mega menu stays fully visible regardless of screen width while maintaining the 4-column landscape layout.

