# Discovery Form Setup Guide

Complete guide to set up and deploy the founder discovery questionnaire.

## Overview

The discovery form is a 10-question interactive questionnaire that:
1. Asks founders about their business, capabilities, and challenges
2. Calculates their business model segment
3. Recommends the right program
4. Sends personalized email sequence (3 emails over 3 days)
5. Stores results in Supabase for analytics

## Architecture

```
Frontend (React)
  ↓
  ├─ /discovery page (DiscoveryForm component)
  ├─ Form state + validation
  └─ Submit to API

Backend (API)
  ↓
  ├─ /api/discovery (POST handler)
  ├─ Segment calculation (segmentLogic.ts)
  ├─ Save to Supabase (discovery_results table)
  └─ Send Email 1 via Resend

Email Scheduling
  ↓
  ├─ Queue Email 2 (1 day) in scheduled_emails table
  ├─ Queue Email 3 (3 days) in scheduled_emails table
  └─ Cron job sends queued emails every hour
```

## Setup Steps

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (sign up at resend.com)
VITE_RESEND_API_KEY=re_your_api_key

# Application
VITE_APP_URL=http://localhost:5173
VITE_CALENDLY_CONSULTATION=https://calendly.com/your-team/consultation
VITE_PROGRAM_APPLICATION_URL=https://your-app.com/apply
```

### 2. Supabase Database Setup

#### Option A: Using Supabase CLI

```bash
# Initialize Supabase (if not already done)
npx supabase init

# Link to your Supabase project
npx supabase link

# Push migration
npx supabase db push
```

This will run `supabase/migrations/001_discovery_schema.sql` and create all tables.

#### Option B: Manual SQL

1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Copy the contents of `supabase/migrations/001_discovery_schema.sql`
4. Paste into SQL Editor and execute

This creates four tables:
- `discovery_results` — Founder responses + segment assignment
- `scheduled_emails` — Queue for Email 2 and Email 3
- `email_events` — Email delivery tracking (optional)
- `analytics` — Daily metrics

### 3. Resend Email Configuration

#### Get API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Copy your API key to `.env.local` as `VITE_RESEND_API_KEY`

#### Verify Domain (Optional but Recommended)

For production, add your domain to Resend:
1. Go to Domains in Resend dashboard
2. Add your domain (e.g., `hello@yourdomain.com`)
3. Follow DNS verification steps
4. Update `VITE_SENDER_EMAIL` in `.env.local`

### 4. Routing & Page Setup

#### For Vite + React Router

In your router configuration:

```tsx
import DiscoveryPage from "./pages/discovery";

const routes = [
  // ...existing routes
  {
    path: "/discovery",
    element: <DiscoveryPage />,
  },
];
```

#### For Next.js

Already set up to work as `/pages/discovery.tsx` (or `/app/discovery/page.tsx` for App Router).

### 5. Deploy API Handler

#### Option A: Vercel

1. Move `src/api/discovery.ts` to `pages/api/discovery.ts` (if using Next.js)
2. For Vite, use Vercel's edge functions or serverless functions
3. Deploy: `vercel deploy`

#### Option B: Netlify

1. Create `netlify/functions/discovery.ts` from `src/api/discovery.ts`
2. Update function name and export format for Netlify
3. Deploy: `netlify deploy`

#### Option C: Self-hosted

For development or self-hosted:

```bash
# Install express and dependencies
npm install express cors dotenv

# Create server.js
```

```javascript
import express from "express";
import cors from "cors";
import discoveryHandler from "./src/api/discovery.ts";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/discovery", discoveryHandler);

app.listen(3001, () => console.log("Server running on :3001"));
```

### 6. Email Scheduling Setup

#### Option A: Vercel Cron (Recommended)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-scheduled-emails",
      "schedule": "0 * * * *"
    }
  ]
}
```

Create `pages/api/cron/send-scheduled-emails.ts`:

```typescript
import { sendScheduledEmails } from "../../../src/api/discovery";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send("Unauthorized");
  }

  const result = await sendScheduledEmails();
  return res.status(200).json(result);
}
```

#### Option B: Netlify Scheduled Functions

Create `netlify/functions/send-scheduled-emails.ts`:

```typescript
import { schedule } from "@netlify/functions";
import { sendScheduledEmails } from "../../src/api/discovery";

const handler = async () => {
  const result = await sendScheduledEmails();
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

export const main = schedule("0 * * * *", handler);
```

#### Option C: External Service (Inngest/Trigger.dev)

For more reliable scheduling, use [Inngest](https://inngest.com) or [Trigger.dev](https://trigger.dev):

```typescript
// src/api/discovery.ts
import { inngest } from "../inngest/client";

// In scheduleFollowupEmails():
await inngest.send({
  name: "email.send.followup",
  data: { email, segment, program, founderName, emailType: "email_2" },
  delay: "1d",
});
```

### 7. Local Development

```bash
# Install dependencies
npm install

# Create .env.local with test credentials
cp .env.example .env.local

# Run development server
npm run dev

# Navigate to http://localhost:5173/discovery
```

### 8. Testing the Flow

#### Manual Test

1. Open http://localhost:5173/discovery
2. Fill in all 10 questions
3. Submit email (use test email)
4. Check your inbox for Email 1

#### Automated Test (Optional)

```typescript
// tests/discovery.test.ts
import { calculateSegment } from "../src/data/segmentLogic";
import { getProgramBySegment } from "../src/data/programDefinitions";

test("maps MSME Value founder correctly", () => {
  const answers = {
    q1_brings_you: "building",
    q2_vision: "Premium interior design studio",
    q3_values: ["Excellence", "Quality"],
    q4_expertise: 4,
    q4_management: 2,
    q4_leadership: 2,
    q5_pressure: "balance",
    q6_scale: "local",
    q7_revenue: "project",
    q8_advantage: "Luxury network",
    q9_challenge: "customers",
    q10_priority: "Landing 3 high-value clients",
  };

  const result = calculateSegment(answers);
  expect(result.segment).toBe("msme_value");
  expect(result.program).toBe("MSME Mastery: Premium Positioning");
});
```

## Database Schema

### discovery_results

Stores founder responses:

```
id (UUID) — Unique identifier
email (TEXT) — Founder email
segment (TEXT) — Business model segment (msme_value, etc.)
program (TEXT) — Recommended program
answers (JSONB) — All 10 Q&A responses
capability_gap (TEXT) — Optional warning
created_at — Submission timestamp
updated_at — Last update timestamp
```

### scheduled_emails

Queue for delayed emails:

```
id (UUID) — Unique identifier
email (TEXT) — Recipient
email_type (TEXT) — email_1, email_2, or email_3
subject (TEXT) — Email subject
html (TEXT) — HTML body
scheduled_for (TIMESTAMP) — When to send
sent (BOOLEAN) — Sent status
sent_at (TIMESTAMP) — Actual send time
error_message (TEXT) — Error details if failed
retry_count (INTEGER) — Number of retries
created_at — Created timestamp
```

## Email Sequence

### Email 1 (Immediate)

Sent upon form submission.

**Subject:** "Your Personalized Program Match: [Program Name]"

**Content:**
- Segment match (e.g., "MSME Value")
- Program recommendation
- Why it fits them
- Timeline of upcoming emails
- Capability gap warning (if applicable)

### Email 2 (1 day later)

Scheduled from `scheduled_emails` table, sent by cron.

**Subject:** "[Program Name] – How It Works"

**Content:**
- Program overview
- Four learning phases
- Consultation details
- What's included
- Pricing

### Email 3 (3 days later)

Scheduled from `scheduled_emails` table, sent by cron.

**Subject:** "[Program Name] – Let's Get Started"

**Content:**
- Benefits recap
- Option 1: Book free consultation (Calendly link)
- Option 2: Apply to program
- Early-bird pricing incentive
- Call to action

## Monitoring & Analytics

### Dashboard Queries

```sql
-- Total submissions
SELECT COUNT(*) FROM discovery_results;

-- By segment
SELECT segment, COUNT(*) FROM discovery_results GROUP BY segment;

-- Segment with capability gaps
SELECT segment, COUNT(*) FROM discovery_results WHERE capability_gap IS NOT NULL GROUP BY segment;

-- Email sending status
SELECT email_type, COUNT(*) as total, COUNT(CASE WHEN sent THEN 1 END) as sent FROM scheduled_emails GROUP BY email_type;

-- Failed emails
SELECT email, email_type, error_message FROM scheduled_emails WHERE sent = false AND retry_count > 3;
```

### Email Tracking (with Webhooks)

Enable Resend webhooks to track email events:

1. Go to Resend dashboard → Webhooks
2. Add webhook: `https://yourapp.com/api/webhooks/resend`
3. Events: `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`

Implement webhook handler:

```typescript
// pages/api/webhooks/resend.ts
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Not allowed");

  const { type, data } = req.body;

  await supabase
    .from("email_events")
    .insert({
      email: data.to,
      resend_id: data.id,
      event_type: type,
      event_data: data,
    });

  return res.status(200).json({ success: true });
}
```

## Troubleshooting

### Email not sending

1. Check Resend API key in `.env.local`
2. Verify sender email domain is verified in Resend
3. Check API response: `npm run dev` and submit form, check browser console
4. Look at Supabase `scheduled_emails` table for error message

### Segment not calculating correctly

1. Check `segmentLogic.ts` — verify your answers match the IF-THEN rules
2. Run test suite: `npm run test`
3. Check `DiscoveryAnswers` interface — ensure all fields are filled

### Scheduled emails not sending

1. Verify cron job is deployed (Vercel/Netlify)
2. Check `scheduled_emails` table — look for `sent = false`
3. Check `error_message` column for details
4. Test manually: call `/api/cron/send-scheduled-emails` directly
5. Verify Resend API key has permission to send emails

### Supabase connection errors

1. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify table permissions — check RLS policies
3. Test connection: `npx supabase db lint`
4. Check Supabase logs for auth errors

## Next Steps

### Customization

1. **Add more questions** — Edit `src/components/DiscoveryForm.tsx` → `questions` array
2. **Change segment logic** — Edit `src/data/segmentLogic.ts` → `calculateSegment()` function
3. **Customize emails** — Edit templates in `src/lib/resend.ts`
4. **Add tracking** — Implement Resend webhooks (see Monitoring section)

### Integration

1. **CRM sync** — Export discovery results to HubSpot, Pipedrive, or your CRM
2. **Slack notifications** — Alert team when new submissions arrive
3. **Analytics dashboard** — Build Metabase/Looker dashboard on discovery data
4. **Retargeting** — Use email + segment for retargeting ads

### Advanced

1. **A/B testing** — Test different question phrasings or program recommendations
2. **Branching questions** — Show different questions based on previous answers
3. **Video integration** — Embed founder education videos between questions
4. **Live chat** — Add intercom/drift for real-time support during discovery

## Support

For issues or questions:

1. Check this guide's Troubleshooting section
2. Review Supabase docs: https://supabase.com/docs
3. Review Resend docs: https://resend.com/docs
4. Check GitHub issues in your project repo
