

## SEO / Meta Tag Optimization

### Problem
Currently all pages share the same static `<title>` and meta tags from `index.html`. No per-route SEO is in place — every page shows "Digital Creatives Hub | Build Agency in the AI Age" regardless of which page the user is on.

### Approach
Install `react-helmet-async` and add a reusable `<SEO>` component that sets `<title>`, `<meta description>`, `og:title`, `og:description`, and canonical URL per page.

### Changes

1. **Install `react-helmet-async`** — lightweight, React 18-compatible head manager.

2. **Create `src/components/SEO.tsx`** — reusable component accepting `title`, `description`, and optional `path` props. Sets:
   - `<title>` (appends " | Digital Creatives Hub" suffix)
   - `meta description`
   - `og:title`, `og:description`, `og:url`
   - `twitter:title`, `twitter:description`
   - `link rel="canonical"`

3. **Wrap `App.tsx`** with `<HelmetProvider>`.

4. **Add `<SEO>` to every page** with tailored titles/descriptions:

   | Route | Title | Description |
   |-------|-------|-------------|
   | `/` | Build Agency in the AI Age | (existing homepage description) |
   | `/about` | About Us | Meet the team behind Digital Creatives Hub... |
   | `/services` | Our Services | Brand, digital, and growth services... |
   | `/services/:slug` | Dynamic from category data | Category description |
   | `/our-work` | Our Work | Portfolio of projects we've delivered... |
   | `/dcn` | Digital Creatives Network | Community for digital creators... |
   | `/blog` | Blog | Insights and strategies... |
   | `/case-studies` | Case Studies | Deep dives into our projects... |
   | `/faq` | FAQ | Frequently asked questions... |
   | `/careers` | Careers | Join our team... |
   | `/privacy-policy` | Privacy Policy | How we handle your data... |
   | `/terms-of-service` | Terms of Service | Our terms and conditions... |
   | `/cookie-policy` | Cookie Policy | How we use cookies... |

5. **Update `PlaceholderPage`** — accept optional `seoTitle` and `seoDescription` props, embed `<SEO>` internally so placeholder pages get SEO automatically.

6. **Clean up `index.html`** — keep the existing meta tags as fallbacks (good for crawlers that don't execute JS), but remove duplicates.

