# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Founders and brand owners anywhere in the world who need their brand, the
digital infrastructure behind it, and the AI systems that run it built as one
working whole. Lagos is where the studio comes from; it is the origin story,
not the market. The visitor is usually deciding whether DCH can be trusted to
build something real for them, after experiences with vendors that sold
pieces that never connected.

Secondary audience: founders not yet ready to talk, who want to understand
what kind of business they are building before committing (served by the
discovery form at `/discovery`).

## Product Purpose

Digital Creatives Hub Ltd (DCH) designs the brand, builds the infrastructure,
and wires in the AI systems that run it, delivered as one connected build
rather than a stack of separate vendors. The website exists to make a visitor
believe that, and then act.

Success on the marketing site:
1. **Primary:** the visitor books a call (`https://calendly.com/dch/consultation`,
   reached through the `#contact` section and the navbar "Book a Call").
2. **Secondary:** a visitor not ready to talk takes the discovery
   (`/discovery`), which segments them and starts a three-email follow-up.

## Positioning

"The Future is Built. Not Bought." DCH's claim is integration: brand,
infrastructure, and AI designed and built together by one team, so the
system holds when the business scales. A design agency that only does
brand, or a dev shop that only ships code, cannot truthfully make that claim.

## Operating Context

The working process the site describes, in four stages: listen for the real
question inside the client's stated problem; blueprint (brand system,
infrastructure diagram, AI spec, success metrics) for sign-off; build design,
infrastructure, and AI in parallel with weekly checkpoints and real users;
then stress-test, monitor, and iterate weekly after launch.

## Capabilities and Constraints

- React + Vite + Tailwind + shadcn/ui, deployed on Vercel; Supabase backend.
- Image and video generation through the Higgsfield API is integrated
  server-side (`src/lib/higgsfield.server.ts`, `/api/studio`). Generated media
  costs real credits per request.
- A private `/studio` generation page is planned. It must never appear in
  any navigation menu and should not be indexed.

## Brand Commitments

- Name: Digital Creatives Hub Ltd (DCH). Logo: `src/assets/dch-logo-primary.png`.
- Tagline: "The Future is Built. Not Bought."
- Voice: direct, specific, anti-hype. Proof through action, not adjectives.
  The project's own docs reject generic "AI slop" copy.
- The current landing page (dark, grid-backed, cyan accent with warm
  secondary) is the visual reference the owner pointed to for new work.

## Evidence on Hand

- Real case studies with real details, written in
  `src/components/ProofStorySection.tsx`:
  - Fitness Religion: multi-city event platform (5+ Nigerian cities;
    registration, leaderboards, event management, sponsor integration).
  - M & H Eyewear: AI visual try-on, style-matching quiz, and eye exams
    built into the purchase flow for luxury frames.
  - Viera Amber: five businesses (design, impact, fashion, learning, creator
    commerce) connected into one system.
- Real project screenshots in `src/assets/portfolio/` (11 projects) and
  data in `src/data/portfolio.ts`.
- Existing generated hero imagery in `public/images/hero/`.
- **Absent, must not be fabricated:** testimonials not already on the site,
  client logos, revenue or growth figures, team headcount, awards, press.

## Product Principles

1. **Show, don't claim.** Every promise on the page should be carried by an
   image, a real case, or a working detail; copy only says what pictures
   cannot.
2. **Generated imagery is mood and story, never evidence.** AI images set
   scenes and carry the narrative. Real client work appears only through
   real screenshots. No fake client photos, products, or people presented as
   real.
3. **One connected story.** The page should read as a single narrative
   (problem, how DCH thinks, proof, how to start), mirroring the
   one-connected-build positioning.
4. **Book a call first, discovery second.** Every section should leave the
   visitor one step from booking; the discovery form is the softer exit.
