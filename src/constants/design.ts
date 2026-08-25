/**
 * Design System Constants
 *
 * Centralized design tokens for consistency across the application.
 * Follows the taste-skill design system guidelines.
 */

// ============================================================
// Border Radius Scale (Shape Consistency Lock)
// ============================================================
export const RADIUS = {
  // Small elements: inputs, badges, small buttons
  sm: "rounded-[6px]",

  // Medium elements: cards, panels, standard buttons
  md: "rounded-[8px]",

  // Large elements: large panels, modals, hero sections
  lg: "rounded-[12px]",

  // Pill shape: buttons with full border radius
  pill: "rounded-full",

  // Sharp corners: no rounding
  none: "rounded-none",
} as const;

// ============================================================
// Color Tokens (Brand Consistency)
// ============================================================
export const COLORS = {
  // Primary accent: cyan (structural, used for primary actions)
  primary: {
    light: "bg-cyan-50 dark:bg-cyan-950",
    base: "bg-cyan-500 dark:bg-cyan-400",
    strong: "bg-cyan-600 dark:bg-cyan-500",
    dark: "bg-cyan-700 dark:bg-cyan-600",
  },

  // Secondary accent: orange (CTA, call-to-action only)
  cta: {
    base: "bg-orange-600 dark:bg-orange-500",
    strong: "bg-orange-700 dark:bg-orange-600",
  },

  // Status colors
  error: {
    light: "bg-red-50 dark:bg-red-950",
    text: "text-red-700 dark:text-red-400",
  },
  success: {
    light: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-400",
  },
  warning: {
    light: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-900 dark:text-amber-200",
  },
} as const;

// ============================================================
// Typography Scale
// ============================================================
export const TYPOGRAPHY = {
  h1: "text-4xl font-bold",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-semibold",
  h4: "text-lg font-semibold",

  body: "text-base",
  small: "text-sm",
  tiny: "text-xs",

  mono: "font-mono",
} as const;

// ============================================================
// Spacing Scale
// ============================================================
export const SPACING = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
} as const;

// ============================================================
// Animation Easing (Motion Intensity 6)
// ============================================================
export const EASING = {
  // Standard ease-out for enter animations
  entrance: [0.16, 1, 0.3, 1],

  // Spring-like easing for interactive elements
  spring: [0.34, 1.56, 0.64, 1],

  // Smooth ease for transitions
  smooth: [0.4, 0, 0.2, 1],
} as const;

// ============================================================
// Transition Durations
// ============================================================
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// ============================================================
// Z-Index Scale (Layering System)
// ============================================================
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
} as const;

// ============================================================
// Breakpoints (Tailwind standard)
// ============================================================
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================================
// Design Configuration (Dials - Section 1)
// ============================================================
export const DESIGN_DIALS = {
  DESIGN_VARIANCE: 6,     // Structured, clean asymmetry
  MOTION_INTENSITY: 6,    // Smooth transitions, stagger-reveal
  VISUAL_DENSITY: 3,      // Airy, one-question focus, breathing room
} as const;

/**
 * Design Dial Reference
 *
 * DESIGN_VARIANCE: 6
 * - Structured CSS Grid with asymmetry where justified
 * - Varied but intentional spacing (not mathematically perfect)
 * - Clean asymmetry through progress bars, form positioning
 * - Mobile collapse to strict single-column
 *
 * MOTION_INTENSITY: 6
 * - Smooth transitions (300ms default)
 * - Stagger-reveal on stage changes (100ms per child)
 * - Scale interactions for tactile feedback
 * - Spring-like easing for natural motion
 * - Respects prefers-reduced-motion (NO animation when enabled)
 *
 * VISUAL_DENSITY: 3 (Airy)
 * - One question at a time (focus)
 * - Generous vertical padding (py-12)
 * - Whitespace prioritized over clutter
 * - Cards with soft shadows, clear hierarchy
 * - Clean spacing: 8px-24px between elements
 */
