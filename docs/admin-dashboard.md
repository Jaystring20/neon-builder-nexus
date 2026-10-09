# Admin dashboard (Phase 1)

The team's control room at **/admin**: leads, Growth Diagnostic results, call
dates, notes and team access. No code or Claude needed to run it.

## Turning it on (once)

1. **Run the migration.** In Supabase (project `oxewatijudnaxyuddpop`) → SQL
   Editor, paste and run `supabase/migrations/20261010090000_admin.sql`. It
   creates the team, sign-in, notes and activity tables, adds call date and
   follow-up owner to `leads`, and makes `digitalcreativeshubltd@gmail.com`
   the first Owner.
2. **Deploy.** Merging to `main` is enough. Nothing new to set in Vercel: it
   uses the `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY`
   already there. Optional: set `ADMIN_SESSION_SECRET` to any long random
   string; changing it later signs everyone out.
3. **Sign in.** Go to `/admin`, enter `digitalcreativeshubltd@gmail.com`, and
   open the link in the email (it works once, for 15 minutes). You stay signed
   in for 30 days on that browser.
4. **Add the team** from **Team**: email, name, role. They sign in the same way.

## Roles

| Role | Can do |
| --- | --- |
| Owner | Everything, including adding and removing team members |
| Manager | Leads and diagnostics: change status, set call dates, assign, add notes |
| Editor | Overview for now; website content screens arrive in later phases |
| Viewer | Overview only, changes nothing |

Roles are checked on the server for every request, so hiding a button is never
the only protection. Removing someone's access takes effect immediately.

## Day to day

- **New call request** arrives in **Leads** as *New* (and still in Gmail).
- **They book in Calendly** → open the lead, set the call date from the
  booking. The lead moves to *Call booked* and shows on the Overview.
  (Calendly's free plan can't notify the site; a paid plan lets this happen
  automatically in a later phase.)
- **After the call** → *Won* or *Lost*, with a note.
- **Diagnostics**: every result, with all answers and the best-fit offer.
  *Add to leads* puts that person in the pipeline.
- Every change is recorded in the lead's **History** with who made it.

## How it works

- `api/admin.ts`: one serverless function for every dashboard request.
- `src/lib/adminAuth.server.ts`: emailed one-time links and signed session
  cookie (HttpOnly, 30 days). No passwords are stored.
- `src/data/adminRoles.ts`: roles and permissions, shared by page and server.
- `src/pages/admin/*`: the screens, loaded separately from the public site
  and hidden from search engines.

# Phase 2: website content

Under **Website** in the dashboard (Owners and Editors):

- **Programmes**: the five programmes the Growth Diagnostic recommends, and
  the three options on each (name, length, who it's for, what's included,
  price). Changes show on the diagnostic result and in its emails. Only an
  Owner can change prices or switch **Show price ranges** on.
- **Portfolio**: the projects on Our Work and the home page. Edit text and
  links, upload a new screenshot, choose the crop, reorder, hide, or add a new
  project. A project with a story (problem, what we built, what exists now)
  and a screenshot is featured; the rest show in the grid.
- **Leadership**: the people under "At the helm" on About: name, role, bio,
  quote, link and photo. Add, reorder or hide people.

Nothing changes until **Save and publish**; the site then updates within
about a minute. **History** keeps every save, and **Restore** brings any of
them back. **Go back to the original content** returns a page to what ships
with the site.

## Turning it on (once)

Run `supabase/migrations/20261011090000_site_content.sql` in the Supabase SQL
Editor. It adds the content tables and a `site-media` storage bucket for
uploaded images. Nothing to change in Vercel.

## How it works

- `site_content` holds one edited version per area; with no row the site shows
  the content in the code (`programDefinitions.ts`, `portfolio.ts`,
  `leaders.ts`), so a failed request or an empty table never breaks a page.
- `GET /api/content` serves the edits to every page, cached for a minute.
- Saving goes through `api/admin.ts`, which checks the role, validates the
  content (`src/data/siteContentSchemas.ts`) and keeps prices as they were when
  an Editor saves.
- Images are resized to WebP in the browser and uploaded straight to Supabase
  Storage through a one-time link.
- Projects or people added to the code later still appear after older edits,
  at the end of the list.
