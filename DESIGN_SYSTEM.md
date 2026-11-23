# Design System Documentation

**Status:** Production Ready (Phase 1 Complete)  
**Framework:** Tailwind CSS v4 + Motion  
**Typography:** Geist Sans-serif  
**Dark Mode:** Fully Supported  
**Accessibility:** WCAG AA Compliant

---

## Quick Setup

### Font Installation (Geist)

Add to your **layout.tsx** or **_app.tsx**:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-geist">{children}</body>
    </html>
  );
}
```

### Tailwind Config (Font Variables)

Add to **tailwind.config.ts**:

```ts
export default {
  theme: {
    fontFamily: {
      geist: ["var(--font-geist)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "monospace"],
      sans: ["var(--font-geist)", "system-ui", "sans-serif"],
    },
  },
};
```

### Dark Mode Setup

Ensure **tailwind.config.ts** has:

```ts
export default {
  darkMode: "class", // or "media" for system preference only
  // ... rest of config
};
```

For automatic system preference detection:

```html
<!-- In your <html> tag -->
<html className="dark">
  <!-- Will use dark mode -->
</html>
```

Or use the `next-themes` library for manual toggle:

```tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <html>{children}</html>
    </ThemeProvider>
  );
}
```

---

## Design Dials (Section 1 of taste-skill)

The Discovery Form is configured with these design parameters:

| Dial | Value | Meaning |
|---|---|---|
| **DESIGN_VARIANCE** | 6 | Structured layout with intentional asymmetry. Clean progress bar, varied padding. |
| **MOTION_INTENSITY** | 6 | Smooth transitions (300ms), stagger-reveal (100ms). Honors `prefers-reduced-motion`. |
| **VISUAL_DENSITY** | 3 | Airy. One question at a time. Generous whitespace. Low visual clutter. |

See `src/constants/design.ts` for reference values and easing curves.

---

## Color System

### Accent Colors

- **Primary (Cyan):** Structural, form controls, progress indicators
  - Light: `bg-cyan-50 dark:bg-cyan-950`
  - Base: `bg-cyan-500 dark:bg-cyan-400`
  - Strong: `bg-cyan-600 dark:bg-cyan-500`

- **CTA (Orange):** Call-to-action buttons only
  - Base: `bg-orange-600 dark:bg-orange-500` ✓ WCAG AA (4.5:1 minimum)
  - Strong: `bg-orange-700 dark:bg-orange-600`

### Neutral Scale

- **Light Mode:** `slate-50, slate-100, slate-200, slate-600, slate-700, slate-900`
- **Dark Mode:** `slate-950, slate-900, slate-800, slate-400, slate-300, slate-50`

All text meets WCAG AA contrast (4.5:1 minimum for body text).

---

## Border Radius (Shape Consistency Lock)

One radius system across the entire application:

```tsx
import { RADIUS } from "@/constants/design";

// Small elements (inputs, badges)
className={RADIUS.sm}     // rounded-[6px]

// Medium elements (cards, buttons)
className={RADIUS.md}     // rounded-[8px]

// Large elements (panels, modals)
className={RADIUS.lg}     // rounded-[12px]

// Pill shape (full rounded)
className={RADIUS.pill}   // rounded-full
```

**Never use arbitrary radius values.** Apply one of the four above.

---

## Reduced Motion (Accessibility)

All animations respect `prefers-reduced-motion: reduce`.

**Example:**
```tsx
import { useReducedMotion } from "motion/react";

export function MyComponent() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? {} : { duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

**Never** use animations without checking `prefers-reduced-motion`.

---

## Dark Mode Pattern (Tailwind `dark:` Variant)

```tsx
// Light mode styles are base, dark mode uses dark: prefix
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
  Reads in both modes
</div>
```

**Contrast Check:** Every text color must pass WCAG AA in both modes.

Light mode: `text-slate-700` on `bg-white`  
Dark mode: `text-slate-300` on `bg-slate-900`

---

## Spacing Scale

From `src/constants/design.ts`:

```ts
xs: "2px"
sm: "4px"
md: "8px"      // Default padding between elements
lg: "16px"     // Standard section padding
xl: "24px"     // Large spacing (py-24)
2xl: "32px"
3xl: "48px"
4xl: "64px"    // Hero section padding
```

---

## Typography

### Headings
- **H1:** `text-4xl font-bold` (hero, main title)
- **H2:** `text-2xl font-semibold` (section headers)
- **H3:** `text-lg font-semibold` (sub-headings)

### Body
- **Default:** `text-base text-slate-700 dark:text-slate-300`
- **Small:** `text-sm text-slate-600 dark:text-slate-400`
- **Tiny:** `text-xs text-slate-500 dark:text-slate-500`

### Mono
- **Code/Technical:** `font-mono text-sm`

---

## Motion & Easing

From `src/constants/design.ts`:

```ts
// Entrance animations (standard ease-out)
easing.entrance = [0.16, 1, 0.3, 1]

// Interactive elements (spring-like)
easing.spring = [0.34, 1.56, 0.64, 1]

// Smooth transitions
easing.smooth = [0.4, 0, 0.2, 1]
```

**Default Duration:** `0.3s` (fast transitions)

---

## Button Patterns

### Primary (Cyan)
```tsx
className="bg-cyan-600 dark:bg-cyan-500 text-white hover:bg-cyan-700 dark:hover:bg-cyan-600"
```

### CTA (Orange) — WCAG AA Verified
```tsx
className="bg-orange-600 dark:bg-orange-500 text-white hover:bg-orange-700 dark:hover:bg-orange-600"
```

### Secondary (Slate)
```tsx
className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
```

### Tactile Feedback
All buttons: `active:scale-[0.98]` for physical button press feel.

---

## Form Inputs

```tsx
// Standard input styling
<input
  className={`
    w-full px-4 py-3 rounded-md
    border-2 border-slate-300 dark:border-slate-600
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-slate-50
    placeholder-slate-400 dark:placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400
    focus:border-transparent
    transition-colors
  `}
/>
```

**Key Points:**
- Label above input (never use placeholder as label)
- 2px border (not 1px)
- Full contrast in dark mode
- Ring (not shadow) for focus state

---

## Pre-Flight Checks Before Shipping

- [ ] No em-dashes (`—`) anywhere on page
- [ ] Button contrast verified (WCAG AA: 4.5:1 minimum)
- [ ] CTA buttons use `orange-600` (not `orange-500`)
- [ ] Dark mode tested and looks good
- [ ] Animations respect `prefers-reduced-motion`
- [ ] All radius values use `RADIUS.{sm|md|lg|pill}`
- [ ] One accent color per section
- [ ] Font family is Geist (not Inter)
- [ ] Mobile layout is single-column (`w-full px-4`)
- [ ] No arbitrary values in classes

---

## References

- **Tailwind CSS:** https://tailwindcss.com/
- **Geist Font:** https://vercel.com/font
- **Motion (Framer):** https://motion.dev/
- **Taste Skill:** Design taste + accessibility guidelines
- **Web Vitals:** https://web.dev/vitals/
- **WCAG AA:** https://www.w3.org/WAI/WCAG2AA-Conformance

---

**Last Updated:** August 24, 2026  
**Status:** All 6 design fixes applied ✅
