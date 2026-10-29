# AGENTS.md

- The preview (Vite dev server) cannot run the Vercel serverless functions under `api/`; `vite.config.ts` proxies `/api/*` to the live site (www.digitalcreativeshubltd.com) in `vite serve` only, so the preview shows real data. Admin sign-in links point to the live site, so in dev the login screen offers a "paste the link" field to redeem the token on the preview origin. Never fake data with mocks — the user rejected sample figures.
