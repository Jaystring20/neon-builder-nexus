# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three kinds of visitor, all deciding whether DCH can move them from where
they are to where their potential points:

1. **Startups finding their footing:** need a brand, a platform and a way of
   working built at once, without hiring five vendors.
2. **Established brands ready to evolve:** have traction and legacy systems,
   need to re-form without losing what already works.
3. **Ambitious individuals:** know they are capable of more and need someone
   to architect the path (training, coaching, personal capability).

The market is international. DCH goes wherever growth needs to happen; no
copy or imagery should place it as a local or regional studio.

Secondary audience: visitors not yet ready to talk, served by the discovery
form at `/discovery`, which segments them and starts a follow-up sequence.

## Product Purpose

Digital Creatives Hub Ltd (DCH) is a business development creative agency
working where strategy, technology and human potential meet. Its work spans
the full architecture of growth: brand identities, SaaS platforms that scale
operations, and training systems that turn individuals into high performers.
AI is embedded in all of it as a force multiplier, never sold as a buzzword.

The website exists to make a visitor feel that DCH builds momentum, not just
deliverables, and then act.

Success on the marketing site:
1. **Primary:** the visitor books a call (`https://calendly.com/dch/consultation`,
   reached through the `#contact` section and the navbar "Book a Call").
2. **Secondary:** a visitor not ready to talk takes the discovery
   (`/discovery`).

## Positioning

"Some agencies build things. We build momentum." (working headline, still
being refined.) Most agencies hand over a deliverable and leave. DCH builds
growth that compounds: brand, platforms and people designed to keep moving
after the engagement ends.

Philosophy: **Build agency. Create value. Drive growth.**

Selective by design: DCH does not chase every brief. It pursues the right
problems and solves them completely.

Retired: "The Future is Built. Not Bought." Do not use it anywhere.

## Operating Context

Led by DigiTech Strategists who work across organisations, brands and
individuals. The approach is never one-size-fits-all: diagnostic, deliberate
and relentlessly outcome-focused. Working stages the site can describe:
diagnose the real problem, architect the path, build (brand, platform,
people) with AI embedded, then compound (measure and iterate after launch).

## Capabilities and Constraints

- React + Vite + Tailwind + shadcn/ui, deployed on Vercel; Supabase backend.
- Image and video generation through the Higgsfield API is integrated
  server-side (`src/lib/higgsfield.server.ts`, `/api/studio`) and through
  `npm run images:generate` (`scripts/site-images/`). Generated media costs
  real credits per request.
- A private `/studio` generation page is planned. It must never appear in
  any navigation menu and should not be indexed.

## Brand Commitments

- Name: Digital Creatives Hub Ltd (DCH). Logo: `src/assets/dch-logo-primary.png`.
- Philosophy line: "Build agency. Create value. Drive growth."
- Sign-off: "Strategy. Creativity. Growth. Without limits."
- Voice: direct, specific, human, anti-hype. Proof through action, not
  adjectives. Short sentences. No "elevate", "seamless", "cutting-edge",
  "unleash". No em-dashes in visible copy.
- Beyond borders: imply international reach through what DCH does and who it
  serves. Do not lead with a city or country (no "Born in Lagos",
  "Headquartered in Lagos" as positioning).
- Visual language: dark graphite field; glossy studio-rendered 3D objects for
  generated imagery; motion that expresses momentum (things starting,
  engaging, compounding).
- Colour roles: cyan is structure (headings' second lines, rules, links,
  imagery's main light). Orange is action and momentum, used sparingly: every
  Book a call button, and the words where the story reaches growth
  ("compounds", "Compound.", "Drive growth.", "Without limits.").

## Evidence on Hand

- Platform and brand work in `src/data/portfolio.ts` with real screenshots in
  `src/assets/portfolio/` (Viera Amber, Innerspace, The Discovery,
  M & H Eyewear, The Fitness Religion Company). More shipped projects exist
  and are still to be added; the site must not imply this list is complete.
- Case stories with real details in `src/components/ProofStorySection.tsx`
  (Fitness Religion: multi-city event platform; M & H Eyewear: AI try-on,
  style quiz and eye exams in the purchase flow; Viera Amber: five businesses
  in one system).
- Training of individuals: real past work exists; the owner will supply the
  material. Until it arrives, the People capability is described without
  invented outcomes.
- **Absent, must not be fabricated:** testimonials not supplied by the owner,
  client logos, revenue or growth figures, team headcount, awards, press,
  training results.

## Product Principles

1. **Show, don't claim.** Every promise is carried by an image, motion, a real
   case or a working detail. Copy only says what visuals cannot: one headline
   and one short line per section, depth behind a click.
2. **Generated imagery is mood and story, never evidence.** AI images and
   motion set scenes and carry the narrative; real work appears only through
   real screenshots and real material.
3. **Momentum is the through-line.** The page should feel like something
   starting, gathering speed and compounding, from hero to call to action.
4. **Proof across all three: brand, platforms, people.** Work is not only
   platforms; each capability gets its own real evidence as it is supplied.
5. **Book a call first, discovery second.** Every section leaves the visitor
   one step from booking; the discovery form is the softer exit.
