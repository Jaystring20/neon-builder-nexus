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

Every visitor's front door is the free Growth Diagnostic at `/diagnostic`
(`/discovery` is an alias): it shows a business where it stands and what fits
before anyone books a call, and starts a follow-up sequence.

## Product Purpose

Digital Creatives Hub Ltd (DCH) is a business development creative agency
working where strategy, technology and human potential meet. Its work spans
the full architecture of growth: brand identities, SaaS platforms that scale
operations, and training systems that turn individuals into high performers.
AI is embedded in all of it as a force multiplier, never sold as a buzzword.

The website exists to make a visitor feel that DCH builds momentum, not just
deliverables, and then act.

Success on the marketing site:
1. **Primary:** the visitor takes the free Growth Diagnostic (`/diagnostic`).
2. **Secondary:** a visitor who already knows what they need books a call
   (`/book`: a short intake, then Calendly).

## Positioning

"Projects end. Momentum doesn't." (the positioning line; the home page hero.) Most agencies hand over a deliverable and leave. DCH builds
growth that compounds: brand, platforms and people designed to keep moving
after the engagement ends.

Philosophy: **Build agency. Create value. Drive growth.** A supporting line,
used on About and in team material, never as a headline.

Key lines: one lead line per piece. Lead lines (public, everywhere):
"Projects end. Momentum doesn't." and the sign-off "Strategy. Creativity.
Growth. Without limits." Supporting lines appear only where their topic is the
subject: "Brand. Platforms. People.", "Five practices. One engine.", "AI isn't
our pitch. It's our multiplier.", "We don't chase every brief.", "Capability
that stays after we leave."

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
  "Headquartered in Lagos" as positioning). Where a place is part of the
  proof, state it plainly as fact, never as a boundary. Defaults are
  international: USD shown first, delivery remote or in person.
- Never call something a result unless it is a measured outcome.
- Contact: hello@digitalcreativeshubltd.com (general), jerry@digitalcreativeshubltd.com (founder).
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
- Case stories: Fitness Religion (one platform for registration,
  leaderboards, events and sponsors; it powered the "2004 M00VE Challenge",
  which is the event's name, not a year, held in one location, and is built
  to scale to more cities: never say "five cities" or "across 5+ cities");
  M & H Eyewear (AI try-on, style quiz and eye exams in the purchase flow;
  "145 five-star reviews · 2,800+ frames", repeated exactly, not described as
  sales); Viera Amber (five brands on one platform instead of five).
- Training of individuals: real past work exists; the owner will supply the
  material. Until it arrives, the People capability is described without
  invented outcomes.
- Key partner: Artificial Intelligence & Robotics School (AIRS). Most DCH
  training is co-organised with AIRS. Hidden on the site for now
  (`SHOW_TRAINING_PARTNER` in `src/data/services.ts`); when shown, credit it
  as a partner with no outbound link. STEAM training runs on STEAM Foundry, DCH's own platform
  (https://apen.digitalcreativeshubltd.com/).
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
5. **Diagnostic first, Book a call second.** Every section leaves the visitor
   one step from the free Growth Diagnostic (`StartCTA`), with Book a call
   beside it for people who already know what they need.
