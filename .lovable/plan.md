

## Services Mega Menu & Category Pages Plan

### What We're Building

1. **Mega dropdown menu** in the navbar replacing the current "What We Do" dropdown — a full-width, multi-column layout (like Superside's reference) with 4 service categories, each listing their sub-services with icons and descriptions
2. **Revamped Services hub page** (`/services`) — overview of all 4 categories with links to individual pages
3. **4 individual category pages** — each with detailed breakdowns of every sub-service

### Service Architecture (from your copy)

| Category | Route | Sub-services |
|---|---|---|
| Brand Architecture | `/services/brand-architecture` | Brand Strategy & Identity, Concept Extraction, Packaging & Merchandise Design, Presentation Design |
| Digital Infrastructure | `/services/digital-infrastructure` | Web & App Architecture, Design Systems, Platform Development, Motion & Video Production |
| Agentic AI & Automation | `/services/ai-automation` | Agentic Workflows, AI-Powered Creative, Automation Consulting |
| Growth Operations | `/services/growth-operations` | Campaign Strategy, Content Engines, Performance Copywriting |

### Changes

**`src/components/Navbar.tsx`** — Replace the current `serviceItems` array and narrow dropdown with a mega menu. The `NavigationMenuContent` will render a wide grid (3-4 columns) with category headers as styled pill/badge links (like the reference image) and sub-services listed below each with icons and short descriptions. Mobile menu gets matching accordion structure.

**`src/pages/Services.tsx`** — Full rewrite as a hub page. Hero with "The Future is Built. Not Bought." voice. Four category cards, each with sub-service list and a CTA linking to the category page.

**`src/pages/services/BrandArchitecture.tsx`** — Detailed page for Brand Architecture with expanded descriptions for each sub-service (Brand Strategy & Identity, Concept Extraction, Packaging & Merchandise, Presentation Design). Each sub-service gets a dedicated section with detailed copy, icon, and a CTA.

**`src/pages/services/DigitalInfrastructure.tsx`** — Same pattern for Digital Infrastructure.

**`src/pages/services/AIAutomation.tsx`** — Same pattern for Agentic AI & Automation.

**`src/pages/services/GrowthOperations.tsx`** — Same pattern for Growth Operations.

**`src/App.tsx`** — Add routes: `/services/brand-architecture`, `/services/digital-infrastructure`, `/services/ai-automation`, `/services/growth-operations`.

### Mega Menu Design (Desktop)

Inspired by the Superside reference but adapted to DCH's dark glassmorphism:
- Full-width dropdown (~800px) with a 4-column grid
- Each column has a category title as a styled badge/pill link (primary/secondary colored)
- Sub-services listed below with lucide icons and one-line descriptions
- Arrow icons on category titles linking to their detail pages

### Visual Style

All new pages and components will use existing glass-card, gradient-text, ScrollReveal, and glassmorphism patterns. The brand voice will match the new "Growth Architects" positioning throughout.

