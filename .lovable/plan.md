

## Fix: Mega Menu Still Clipped on Right Side

### Root Cause
The `NavigationMenuViewport` component (in `navigation-menu.tsx`) has:
- A wrapper `div` with `absolute left-0` — anchoring the viewport to the nav trigger position
- The viewport itself has `overflow-hidden` — clipping anything that extends beyond it

The `!left-1/2 !-translate-x-1/2` applied to `NavigationMenuContent` operates *inside* this clipped viewport, so it has no effect on the overall positioning.

### Fix (2 files)

**1. `src/components/ui/navigation-menu.tsx` (line 80)**
- Change the viewport wrapper from `absolute left-0` to `fixed left-0 right-0 w-screen flex justify-center` so the dropdown viewport spans the full screen width and centers its content.

**2. `src/components/Navbar.tsx` (line 71-72)**
- Remove the `!left-1/2 !-translate-x-1/2` from `NavigationMenuContent` since the viewport itself will now handle centering.
- Keep the responsive width `w-[min(1050px,calc(100vw-2rem))]` on the inner container.

This ensures the mega menu dropdown is centered on the full viewport and all 4 service pillars are visible without clipping, regardless of where the trigger button is positioned in the navbar.

