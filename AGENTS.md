# AGENTS.md

- The preview (Vite dev server) cannot run the Vercel serverless functions under `api/`; `vite/api-mock.ts` intercepts `/api/*` in `vite serve` only and returns sample data matching `src/lib/adminApi.ts` and `src/data/events.ts` types, so all public pages and `/admin` render in preview. Production (deployed) uses the real serverless functions — never ship the mock; writes there are accepted but not persisted.
