

## Plan: Add Project Screenshots & Correct URLs

### What's Needed
1. Copy the 9 portfolio screenshot images from the DigiTech Strategist project into this project
2. Update `src/data/portfolio.ts` with correct live URLs (currently most point to the generic portfolio page) and add image references
3. Update `src/pages/OurWork.tsx` to display actual project screenshots instead of icon placeholders

### Source Data (from DigiTech Strategist project)

**Images to copy** (from `src/assets/portfolio/` in project `thedigitechstrategist`):
- `ddo-learning-liberation.png`
- `innerspace-interior-design.png`
- `ecopath-circular-economy.png`
- `everything-household.png`
- `bunmiflex-yoga.png`
- `digitech-strategist.png`
- `healing-broken-hearted.png`
- `soteria-eye-clinic.png`
- `the-discovery-church.png`

For The Fitness Religion Company (project #10), we'll need to capture a screenshot separately since it wasn't in the original portfolio assets.

**Correct URLs** (from the source project):
| Project | Current URL | Correct URL |
|---------|------------|-------------|
| DDO | thedigitechstrategist.com/portfolio | thelearningliberationspecialist.lovable.app |
| Innerspace | thedigitechstrategist.com/portfolio | innerspace-innovations.lovable.app |
| Ecopath | thedigitechstrategist.com/portfolio | ecopath.lovable.app |
| Everything Household | thedigitechstrategist.com/portfolio | everythinghousehold.lovable.app |
| Bunmi Flex | thedigitechstrategist.com/portfolio | bunmiflex.lovable.app |
| DigiTech Strategist | thedigitechstrategist.com | thedigitechstrategist.lovable.app |
| Healing The Broken Hearted | thedigitechstrategist.com/portfolio | healingthebrokenhearted.lovable.app |
| Soteria Eye Clinic | thedigitechstrategist.com/portfolio | soteriaeyeclinic.lovable.app |
| The Discovery Church | thedigitechstrategist.com/portfolio | www.thediscoverylagos.org |
| Fitness Religion | thefitnessreligioncompany.com.ng | (stays the same) |

### File Changes

**`src/assets/portfolio/`** (new directory) — Copy all 9 PNG screenshots from the DigiTech Strategist project. For Fitness Religion, we'll use a screenshot or the icon placeholder temporarily.

**`src/data/portfolio.ts`** — Add an `image` field (imported PNG) to each project and update all URLs to point to the actual live project sites.

**`src/pages/OurWork.tsx`** — Replace the icon-based image placeholder area with actual `<img>` tags showing the project screenshots, with `object-cover` and hover scale effect.

