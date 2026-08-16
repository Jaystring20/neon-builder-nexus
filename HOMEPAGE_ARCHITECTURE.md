# DCH Homepage — Complete Interactive Architecture

## Overview

**Goal:** Transform the DCH homepage into a sophisticated, interactive, conversational experience that eliminates AI slop and follows the V3Code pattern of asking questions before providing answers.

**Principle:** Progressive disclosure, nested interactions, and narrative-first design. No content dumps. Everything reveals itself as the user engages.

---

## Section-by-Section Breakdown

### 1. **Hero Section** (Existing, Refined)
- **File:** `src/components/HeroSection.tsx`
- **Pattern:** Left-aligned composition with equal-weight headline
- **Headlines:** "The Future is Built. Not Bought."
- **Subheadline:** Narrative of the three-layer build (brand + infrastructure + AI)
- **Proof:** Architect's title block showing real metrics (builds, sectors, real project names)
- **Interactions:**
  - Grain overlay texture
  - Blueprint grid background
  - Magnetic CTA button with smooth tracking
  - Computed proof names from portfolio data
- **Key Design:** No floating cards, minimalist, left-aligned, desaturated cyan/orange palette

---

### 2. **Proof Stories Section** ⭐ NEW
- **File:** `src/components/ProofStorySection.tsx`
- **Pattern:** Interactive nested Q&A cards
- **Stories:** Fitness Religion, M & H Eyewear, Viera Amber
- **Interactions:**
  - Click to expand/collapse each proof
  - Smooth transitions (500ms ease-out)
  - Progressive reveal of details
  - Metric callouts appear with animations
  - Deep-dive links at the bottom
- **Content Structure:**
  - **Question:** Hooks the reader ("Can you move 10,000 people across 5 cities?")
  - **Short Answer:** One-line proof
  - **Details:** Nested paragraphs that animate in staggered
  - **Metric:** Real outcome ("145 five-star reviews · 2,800+ frames")
  - **Deep Dive:** Link to explore architecture
- **Visual Hierarchy:**
  - Cards sit above one another
  - Only one expands at a time
  - Footer pattern section shows how each question was answered
- **Key Design:** Cards don't feel like templates, smooth animations, authentic metrics, no exaggeration

---

### 3. **Capabilities Section** ⭐ NEW
- **File:** `src/components/CapabilitiesSection.tsx`
- **Pattern:** Tab-like selector with progressive content reveal
- **Three Capabilities:**
  1. **Brand** — "Does this brand actually mean something?"
  2. **Infrastructure** — "Will this hold when you scale?"
  3. **AI** — "Can the AI actually represent this brand?"
- **Interactions:**
  - Click tab to switch capabilities (no page load)
  - Content fades out/in with smooth transitions
  - Only one capability visible at a time
  - Details animate in staggered (50ms delays)
- **Content Structure (per capability):**
  - **Question header**
  - **Short answer** (conversational)
  - **What we build** — bulleted architecture description
  - **Why it matters** — business reasoning
  - **Real example** — specific case from our work
  - **User question** — reflects what they might be thinking
  - **CTA link** — "Explore: How we architect..."
- **Visual Hierarchy:**
  - Tab buttons show active/inactive states
  - Min-height container prevents layout shift
  - Text uses color transitions for emphasis
- **Key Design:** Tab selector doesn't look generic, content reveals feel conversational, real examples ground abstract concepts

---

### 4. **Origin Story Section** ⭐ NEW
- **File:** `src/components/OriginStorySection.tsx`
- **Pattern:** Scroll-triggered progressive reveals
- **Narrative:** "Why we built it this way" (Lagos → Global principles)
- **Sections:**
  1. **Constraints Force Architecture** — Why Lagos taught us principles
  2. **The Insight** — What if we optimized for meaning?
  3. **The Proof** — How Lagos built these three systems
  4. **Operating Principle** — Under-assumed is better than over-engineered
- **Interactions:**
  - Intersection Observer tracks scroll
  - Each section reveals when it enters viewport (20% threshold)
  - Smooth fade-up + translate transitions (700ms)
  - Staggered reveal across multiple blocks
- **Content Structure:**
  - Border lines separate sections
  - Callout box highlights core principle
  - Nested lists show concrete examples
  - Left border accent on "What we build"
- **Visual Hierarchy:**
  - Headings change style for emphasis
  - Italic callouts stand out
  - Nested indentation shows hierarchy
- **Key Design:** Story unfolds as you scroll, visual breaks prevent wall-of-text feeling, real constraints from real place

---

### 5. **Process Section** ⭐ NEW
- **File:** `src/components/ProcessSection.tsx`
- **Pattern:** Stepped timeline with progressive disclosure
- **Six Phases:**
  1. **Discovery Call** (1 session)
  2. **Architecture Sprint** (1 week)
  3. **Build Phase** (4–12 weeks)
  4. **Launch Prep** (2 weeks)
  5. **Launch Day** (1 day)
  6. **Post-Launch** (Ongoing)
- **Interactions:**
  - Click to expand/collapse each phase
  - Timeline connector lines between steps
  - 500ms smooth transitions on expand/collapse
  - Details animate in with staggered delays
- **Content Structure (per phase):**
  - **Number indicator** (01, 02, etc.) — faded in background
  - **Title + Duration** — "Discovery Call — 1 session"
  - **What** — One-liner description
  - **What we do** — Bulleted details (with stagger animation)
  - **You receive** — Checklist items with icons
  - **Decide?** — Conversational question about approval (some phases only)
- **Visual Hierarchy:**
  - Left-aligned step numbers
  - Border on left side for expanded content
  - Checkmarks on deliverables
  - Subtle gradient connector between steps
- **Key Design:** Timeline feels architectural (not flowcharty), every phase explains "what happens," no jargon, conversational tone throughout

---

### 6. **FAQ Section** ⭐ NEW
- **File:** `src/components/FAQSection.tsx`
- **Pattern:** Conversational accordion
- **Questions:**
  1. How is this different from hiring an agency?
  2. What if we already have a designer/engineer?
  3. How much does this cost?
  4. How long does it take?
  5. What if we need to change direction mid-build?
  6. Can you guarantee it will work?
- **Interactions:**
  - Click question to expand/collapse
  - Smooth max-height transitions (500ms)
  - Answers animate in staggered (50ms delays)
  - Only one question open at a time (default: none)
  - Hover state signals interactivity
- **Content Structure (per question):**
  - **Question** — Direct, conversational
  - **Answer** — 2–5 paragraphs, each as separate item
  - **Follow-up CTA** — "Have a different question?"
- **Visual Hierarchy:**
  - Chevron rotates on expand
  - Text color transition on hover
  - Border bottom between questions
  - Answers are left-padded for indentation
- **Key Design:** FAQ doesn't sound like FAQ, each answer feels like part of a conversation, not separate from the brand voice

---

### 7. **Contact/CTA Section** ⭐ NEW
- **File:** `src/components/ContactCTASection.tsx`
- **Pattern:** Dual CTA with credibility metrics
- **Sections:**
  1. **Header narrative** — "Ready to build? Start with a conversation."
  2. **Two CTAs:**
     - Book a Call (Cal.com link)
     - Send Your Brief (mailto link)
  3. **Location info** — Lagos, NY, Remote
  4. *(Removed)* A credibility metrics footer used to sit here. It asserted numbers nobody verified, so it was deleted. Do not re-add metrics without real figures from the business owner.
- **Interactions:**
  - CTA cards hover state changes border + background
  - Smooth 300ms transitions
  - Links open in new tab (calendar, email)
- **Visual Hierarchy:**
  - Cards are equal weight (not one bigger/smaller)
  - Icons on cards (Mail, MapPin)
  - Metrics in 2x2 grid below fold
- **Key Design:** Not pushy, conversational, grounded in real metrics, two paths (call or brief), location shows distributed team

---

## Cross-Cutting Patterns

### Animation & Transitions
- **Expand/Collapse:** `500ms ease-out` (max-height, opacity)
- **Stagger animations:** `50ms` delay per item
- **Scroll reveals:** `700ms ease-out` on Intersection Observer
- **Hover states:** `300ms ease-out` for smooth color/border changes
- **Detail animations:** Use `.animate-fade-up-elegant` (custom keyframe) for progressive text reveal
- **No loading spinners** — everything is instant or properly animated

### Color System (Desaturated)
- **Primary (Cyan):** `178 58% 56%` (was `180 100% 50%`)
- **Secondary (Orange):** `22 72% 56%` (was `25 100% 55%`)
- **Foreground:** `180 12% 94%`
- **Muted text:** `220 15% 60%`
- **Cards:** `220 25% 12%` with backdrop blur
- **Borders:** `220 20% 20%` at 40% opacity

### Typography
- **Display font:** Bricolage Grotesque (400–800 weights loaded)
- **Serif accent:** Playfair Display (italic, for specific words)
- **Sans-serif body:** Poppins (for readability)
- **Hierarchy:** Size + weight, never all-caps except for labels
- **Tracking:** Wider on labels (`tracking-wider`, `tracking-[0.16em]`)
- **Line height:** Tight on headings (1.05), relaxed on body (1.6)

### Interaction Principles
1. **Reveal on ask** — Don't show everything. Wait for click/scroll.
2. **No templates** — Each component feels unique, not SAAS-generic.
3. **Direct address** — Use "you" when talking to the reader.
4. **Real proof** — Every claim is backed by real project metrics.
5. **Honest refusal** — We say "no" when we don't know something.
6. **Progressive complexity** — Simple at a glance, deep when clicked.

### Accessibility
- Focus states on all interactive elements (ring-2 ring-primary/50)
- Proper ARIA labels on buttons and sections
- Color not the only signal (borders, icons, text changes too)
- Animations respect `prefers-reduced-motion`
- Semantic HTML (buttons are buttons, not divs)
- Link text is descriptive (no "click here")

---

## File Structure

```
src/
├── components/
│   ├── HeroSection.tsx (existing, refined)
│   ├── ProofStorySection.tsx (NEW)
│   ├── CapabilitiesSection.tsx (NEW)
│   ├── OriginStorySection.tsx (NEW)
│   ├── ProcessSection.tsx (NEW)
│   ├── FAQSection.tsx (NEW)
│   ├── ContactCTASection.tsx (NEW)
│   ├── Navbar.tsx (existing)
│   ├── Footer.tsx (existing)
│   └── FloatingCTA.tsx (existing)
├── pages/
│   ├── Index.tsx (UPDATED — now uses new sections)
│   └── [other pages]
└── index.css (UPDATED — added animate-fade-up-elegant)
```

---

## What's NOT Here

- **Project carousels** — Deferred to /our-work
- **Eyebrow badges** — Removed as visual clutter
- **Gradient text** — Replaced with solid colors
- **Floating proof cards** — Rejected as not communicating brand meaning
- **Generic testimonials** — Proof embedded in narrative instead
- **Auto-playing videos** — Keep it still, let users click
- **Skeleton screens** — Everything is instant or properly transitioned

---

## Compliance Checklist

- ✅ **No AI slop** — Every word is conversational, specific, authored
- ✅ **Interactive** — Every section has click/scroll interaction
- ✅ **Engaging** — Progressive disclosure, narrative unfolds
- ✅ **Not cumbersome** — No section is overwhelming, max height transitions work
- ✅ **Tailored taste** — Sophisticated animations, refined typography, minimal decoration
- ✅ **V3Code compliant** — Questions first, proof embedded, conversational flow
- ✅ **Palette maintained** — Desaturated cyan/orange throughout
- ✅ **Authentic** — Real metrics, real projects, honest refusals
- ✅ **Accessible** — WCAG AA, proper focus states, semantic HTML

---

## Next Steps (Optional Enhancements)

1. **Architecture showcase** — Detailed system diagrams for each proof project
2. **Blog link** — "See our latest thinking"
3. **Team photos** — Optional: faces of real people (if authentic)
4. **Case study links** — From proof stories to deep dives
5. **Dark/light toggle** — If brand want it
6. **Performance optimization** — Lazy load sections as needed

---

## How to Test

1. Open the browser dev tools
2. Test each section:
   - Click proof stories to expand
   - Click capability tabs
   - Scroll through origin story
   - Click process phases
   - Expand FAQ questions
   - Hover over CTA cards
3. Check animations are smooth, text is readable, no layout shifts
4. Test on mobile (viewport < 768px)
5. Verify links work (booking, email, deep dives)

---

**Built with:** React, TypeScript, Tailwind CSS, Lucide Icons  
**Methodology:** V3Code narrative pattern, progressive disclosure, desaturated palette  
**Philosophy:** Ask before answering. Show, don't tell. Real proof, not hype.
