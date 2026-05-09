## Replace logo with new DCH brand mark

Swap the existing small circular logo for the new uploaded "DCH" logo (blue + orange arrows wordmark) and give it bold, confident presence in the navbar and footer.

### Steps

1. **Add the new asset**
   - Copy `user-uploads://IMG_5568_1.PNG` → `src/assets/dch-logo-primary.png` (PNG to preserve the transparent/clean edges of the mark).

2. **Navbar (`src/components/Navbar.tsx`)**
   - Replace `dchLogo` import with the new `dch-logo-primary.png`.
   - Remove the cropped circular ring container. Render the new logo as a full mark:
     - Desktop: `h-9 w-auto` (h-10 when not scrolled), `object-contain`, no ring, no rounded crop.
     - Mobile: `h-8 w-auto`.
   - Remove the duplicate "Digital Creatives Hub" text wordmark next to it (the new logo already contains "DCH" — keeping the text would be redundant and cramped). Keep an `aria-label`/`alt="Digital Creatives Hub"` for accessibility and SEO.
   - Slightly widen the logo's hover pill padding so the mark breathes inside the floating nav pill.

3. **Footer (`src/components/Footer.tsx`)**
   - Swap to the same new asset, sized larger (`h-12 w-auto`) so it reads as the primary brand anchor at the bottom of the page.
   - Remove the small circular crop there as well.

4. **Favicon (optional, recommended)**
   - Also copy the logo to `public/favicon.png` and update `index.html` `<link rel="icon">` so the browser tab matches the new mark.

### Out of scope
- No color-token changes, no layout/IA changes, no other component edits.
- No changes to copy, services data, or routes.

### Acceptance
- New DCH logo appears bold and uncropped in the floating navbar (desktop + mobile) and in the footer.
- No leftover circular ring or duplicate "Digital Creatives Hub" text next to the mark in the navbar.
- Browser tab favicon reflects the new logo.
