

## Website Copy Overhaul Plan

I've parsed your full copy document ("DCH Website Copy: The Builder's Blueprint"). Here's how the new copy maps to the site structure and what changes are needed.

### New Copy → Section Mapping (Landing Page)

| New Copy Section | Current Component | Action |
|---|---|---|
| **Section 1: Hero** — "The Future is Built. Not Bought." | `HeroSection.tsx` | Rewrite headline, sub-headline, CTAs ("Start the Build" / "View the Blueprint"), remove fear-based messaging |
| **Section 2: The Friction** — "Strategy is a Map. Most Brands are Just Lost." | `ProblemSection.tsx` | Replace 4 problem cards with bold "We Architect / We Propel" copy, more confident tone |
| **Section 3: The Resolution** — "We Build the Systems That Grow the Brand." | `SolutionSection.tsx` | Rewrite as execution powerhouse messaging, remove "Lab for Digital Builders" framing |
| **Section 4: The Method** — 4 Pillars of Momentum | New component `PillarsSection.tsx` | Create 4-pillar layout: Extraction, Architecture, Engine, Velocity |
| **Section 5: Why Us** — 3 differentiators | New component `WhyUsSection.tsx` | "Strategy is a Map. We Build the Road." / "Quiet Systems. Loud Results." / "Business Development, Reimagined." |
| **Section 6: About Us snippet** — "Where Strategy Meets the Street" | `StrategistSection.tsx` → rename to `AboutSnippet.tsx` or repurpose | Landing page teaser with "Learn More" linking to `/about` |
| **CTA Section** | `CTASection.tsx` | Update copy to match new brand voice |
| **Blueprint Section** | `BlueprintSection.tsx` | Keep but update copy to align with new "Builder's Blueprint" positioning |

### About Page Overhaul (`About.tsx`)

The document provides a full About page rewrite:
1. **Manifesto**: "The World Doesn't Need More Consumers. It Needs Builders."
2. **North Star**: New mission/vision copy
3. **Innovation Lab**: "Business Development Creative Agency" positioning
4. **Meet Jeremiah**: Updated bio — "he builds the road, the car, and the fuel"
5. **Promise**: "Quiet Systems. Loud Results."

### Key Brand Voice Shifts

- **From**: "Feeling Left Behind by the Digital Tsunami?" (fear/educational)
- **To**: "The Future is Built. Not Bought." (confident/authoritative)
- **From**: "Innovation Lab" / "Digital Builders"
- **To**: "Business Development Creative Agency" / "Growth Architects"
- **From**: Consumer → Creator language
- **To**: Architect → Engine → Velocity language

### Implementation Order

1. **HeroSection** — new headline, sub-headline, CTAs, trust indicators update
2. **ProblemSection** → rebrand as "FrictionSection" with new copy
3. **SolutionSection** → rewrite as "ResolutionSection" / growth engine messaging
4. **Create PillarsSection** — 4 Pillars of Momentum (Extraction, Architecture, Engine, Velocity)
5. **Create WhyUsSection** — 3 differentiator cards
6. **Repurpose StrategistSection** → About Us landing page snippet with "Learn More" CTA
7. **Update CTASection and BlueprintSection** copy
8. **Overhaul About.tsx** with manifesto, north star, innovation lab, updated Jeremiah bio, promise
9. **Update Index.tsx** — reorder/replace section imports

### What Stays the Same

- All glassmorphism styling, glass-card classes, gradients
- FloatingParticles, ScrollReveal animations
- Dark theme, color system (primary/secondary)
- Navigation structure (recently overhauled)
- Overall responsive layout patterns

