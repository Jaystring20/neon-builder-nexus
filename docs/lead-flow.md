# How leads come in

Two routes, both ending in a Calendly booking that already carries the
client's answers, so no call starts from zero.

## 1. Book a call (`/book`)

Every Book a call button on the site goes here.

1. **You:** who they are (business owner, startup, organisation, school,
   individual), name, email, company and phone (optional).
2. **The problem:** which areas (brand, growth, platforms, AI, training, not
   sure) and the problem in their words.
3. **Budget and timing:** a range in NGN or USD, and when they want to start.
4. **Pick a time:** the Calendly calendar opens inside the page with name,
   email and a summary of all their answers prefilled.

Behind the scenes (`POST /api/lead`):

- The lead is saved to the `leads` table in Supabase.
- **DCH gets an alert email** with the problem, budget, timeline, suggested
  practice, first-step size and a priority (HIGH / MEDIUM / LOW). Reply to it
  to write to the lead directly.
- **The lead gets a confirmation** with what happens next and their booking link.
- **Two days later, a nudge** goes out ("Still want to talk it through?") with
  the booking link and the matching service page.

Routing and priority live in `src/data/leadIntake.ts`:

| Budget tier | First step suggested |
|---|---|
| t1 | A workshop, an audit or a one-to-one session |
| t2 | A defined project |
| t3 | A multi-part build |
| t4 | An ongoing partnership |

Priority is HIGH for t3/t4 starting within three months, MEDIUM for t3/t4
later or t2 soon, LOW otherwise. Individuals and schools route to Training.

## 2. After the discovery (`/discovery`)

The result screen's **Book my discovery call** opens the discovery-call
calendar inside the page, with the result and their answers prefilled. If they
leave their email for the breakdown, **DCH also gets an alert email** with the
result, and the lead gets the three-email sequence as before (all its booking
buttons now point at the discovery-call link).

## Calendly links

`src/lib/booking.ts`:

- `discovery`: https://calendly.com/digitalcreativeshubltd/one-on-one-discovery-call
- `intro` (Book a call): the same link for now. Create a separate event (for
  example "Intro call") and paste its link here to tell the two apart.

The answers arrive in the event's **first custom question**. In Calendly, make
sure the event has one (Calendly's default "Please share anything that will
help prepare for our meeting" works).

## Settings (Vercel → Project → Settings → Environment Variables)

| Variable | What it does |
|---|---|
| `LEAD_ALERT_EMAIL` | Optional. Overrides the alert inbox, which is digitalcreativeshubltd@gmail.com |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Already used by the discovery emails |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Already used by the discovery |

The `leads` table is created by `supabase/migrations/20261009090000_leads.sql`.
Until it exists, leads still reach DCH by the alert email; nothing is lost.

## How a discovery result becomes an offer

`src/data/offerMatch.ts`, on top of the model from `segmentLogic.ts`:

1. **Programme:** one per model, from `programDefinitions.ts` (for example a
   Craftsperson gets MSME Mastery: Premium Positioning).
2. **Best fit, out of three ways to work:**
   - Starting, building or unsure → **Programme** (structured, least spend)
   - Building fast (60+ hours or wants a team) → **Done with you**
   - Scaling or hiring → **Done with you**, or **Done for you** if they want
     balance (growth without more of their hours)
3. **Practices** that deliver it: two from the model, plus one from their
   biggest constraint, linked to the service pages.

The result screen shows all three tiers with the best fit marked and a one-line
reason. The same line goes into the Calendly notes and DCH's alert email.
Prices exist in `programDefinitions.ts` but are hidden until DCH confirms them
(`SHOW_PRICES` in `offerMatch.ts`).
