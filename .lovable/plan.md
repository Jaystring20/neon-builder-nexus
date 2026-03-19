

## Fix Unreliable Navigation Dropdowns

### Problem
The Radix `NavigationMenu` viewport is wrapped in a `fixed` positioned div. This creates a gap between the trigger and the dropdown content, causing the mouse to leave the trigger's hover zone before reaching the content — making dropdowns close unexpectedly or fail to open.

### Root Cause
Line 80 in `navigation-menu.tsx`: the viewport wrapper uses `fixed left-0 right-0 top-full`, which positions it relative to the browser window, not the navbar. The `top-full` on a `fixed` element doesn't track the parent — it resolves to 100% of the viewport height, creating misalignment and hover dead zones.

### Fix

**`src/components/ui/navigation-menu.tsx`** — 2 changes:

1. **Change the viewport wrapper** from `fixed` to `absolute` positioning. The parent `NavigationMenu` already has `relative` on it, so absolute will anchor correctly beneath the nav triggers:
   - Replace: `"fixed left-0 right-0 top-full w-screen flex justify-center"`
   - With: `"absolute left-0 top-full flex justify-center"` and ensure it spans the needed width.

2. **Add `forceMount` consideration** — keep the viewport mounted but hidden via CSS to avoid flicker on first open. Radix re-measures the viewport height on mount; if it unmounts between opens, the height animation can break.

**`src/components/Navbar.tsx`** — 1 change:

3. **Add `delayDuration={0}`** to the `<NavigationMenu>` root. By default Radix has a 200ms delay before opening on hover. Setting it to 0 makes dropdowns feel instant and eliminates the "not working" perception when quickly moving between triggers.

### Technical Details

- The `NavigationMenu` component wraps Radix's `NavigationMenuPrimitive.Root` which manages open/close state via hover intent
- The viewport is a shared container that slides/resizes to fit whichever menu content is active
- `fixed` positioning breaks the hover bridge between trigger and content because the content isn't spatially adjacent to the trigger in the layout
- `absolute` positioning keeps the content directly below the trigger area, maintaining the hover zone

