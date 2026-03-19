

## Fix Mega Menu Overflow + Full-Width Expansion

### Problem
The `NavigationMenuViewport` wrapper div uses `absolute left-0` relative to the `NavigationMenu` root, which sits inside the navbar. On a 945px viewport, the 1050px mega menu overflows to the right. The user also wants the mega menu to span nearly the full screen width.

### Solution

**1. Update `NavigationMenuViewport` (`src/components/ui/navigation-menu.tsx`)**
- Change the viewport wrapper from `absolute left-0` to `fixed left-0 right-0 w-screen` so it positions relative to the browser viewport, not the nav element.
- Center the content within using `flex justify-center`.

**2. Update mega menu content width (`src/components/Navbar.tsx`)**
- Change the "What We Do" content container from `w-[min(1050px,calc(100vw-2rem))]` to `w-[calc(100vw-2rem)] max-w-[1400px]` so it spans nearly the full screen.
- Adjust padding/layout to breathe at this wider size.

### Files Changed
1. **`src/components/ui/navigation-menu.tsx`** — Fix viewport positioning to be screen-relative
2. **`src/components/Navbar.tsx`** — Widen mega menu to near full-width

