

## Connect "Book a Call" Buttons to #contact Section

### Changes

**`src/components/Navbar.tsx`** — 2 edits:
1. **Desktop button (line 169)**: Wrap in an `<a href="/#contact">` or use `onClick` to scroll to `#contact` (handling both homepage and other pages).
2. **Mobile button (line 287)**: Same treatment, plus close the mobile menu on click.

Both buttons will smooth-scroll to the Project Builder section. On non-homepage routes, they'll navigate to `/#contact`.

