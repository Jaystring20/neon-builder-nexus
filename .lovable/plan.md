

## Build the "Our Work" Portfolio Page

### Overview
Create a new `/our-work` route featuring 10 live portfolio projects in a filterable, dark glassmorphism grid — consistent with DCH's visual identity.

### The 10 Projects

| # | Project | Category |
|---|---------|----------|
| 1 | DDO - The Learning Liberation Specialist | Education |
| 2 | Innerspace - Nigerian Interior Design Studio | Interior Design |
| 3 | Ecopath - Circular Economy Platform | Sustainability |
| 4 | Everything Household | E-commerce |
| 5 | Bunmi Flex - Yoga for Movement, Healing & Alignment | Health & Wellness |
| 6 | The DigiTech Strategist | Career Strategy |
| 7 | Healing The Broken Hearted Foundation | Non-Profit |
| 8 | Soteria Eye Clinic / M & H Eyewear | Healthcare |
| 9 | The Discovery Church | Web Development |
| 10 | The Fitness Religion Company | Community & Events |

### Files to Create/Modify

**`src/data/portfolio.ts`** (new) — Array of 10 project objects, each with: title, category, description, tags, image (placeholder initially), and external URL.

**`src/pages/OurWork.tsx`** (new) — Portfolio page with:
- Hero section with heading + subtitle
- Horizontal filter bar (All, Education, E-commerce, Health & Wellness, etc.)
- Responsive grid (3-col desktop, 2-col tablet, 1-col mobile) of glass cards
- Each card: image area, category badge, title, description, tag pills, external link
- Navbar + Footer wrapper

**`src/App.tsx`** — Add `/our-work` route.

**`src/components/Navbar.tsx`** — Update "Our Work" link from `#lab` / `/#lab` to `/our-work` (both desktop and mobile).

### Card Design
- `bg-card/30 backdrop-blur-md border border-border/30 rounded-xl`
- Image placeholder at top with aspect ratio
- Category badge (primary/secondary color)
- Title, 2-line description, tag pills
- Hover: subtle scale + border glow
- External link icon in corner

