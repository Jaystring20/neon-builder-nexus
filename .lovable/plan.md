

## Plan: Landscape Mega Menu for Services

### Problem
The current "What We Do" mega menu uses a 2-column layout (`grid-cols-2`, 780px wide), which stacks the 4 service pillars in pairs — requiring scrolling and making it impossible to see all services at a glance.

### Solution
Convert to a 4-column landscape layout that displays all 4 service categories side by side, so users can capture everything in one view.

### Changes — `src/components/Navbar.tsx` (lines 72–107)

1. **Widen the container** from `w-[780px]` to `w-[1100px]` to accommodate 4 columns
2. **Change grid** from `grid-cols-2` to `grid-cols-4`
3. **Compact the sub-service items** slightly — remove the longer descriptions from the dropdown items, keeping just the title and icon to fit the narrower columns cleanly
4. **Reduce padding/spacing** to keep everything tight and scannable

The result: all 4 pillars (Brand Architecture, Digital Infrastructure, Agentic AI & Automation, Growth Operations) visible simultaneously in a single horizontal row, each with their sub-services listed underneath.

The mobile menu remains unchanged (accordion style is already appropriate for small screens).

