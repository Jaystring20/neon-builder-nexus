# 🚀 Production Deployment Checklist

**Last Updated:** August 25, 2026  
**Status:** 🟢 ALL GAPS FIXED - Ready for Deployment

---

## ✅ What Was Fixed (All 4 Gaps)

### ✓ Gap 1: Missing Capability Questions
- ✅ Added `q4_management` — "How would you rate your ability to manage a team?"
- ✅ Added `q4_leadership` — "How would you rate your leadership capabilities?"
- ✅ Updated form from 10 → 12 questions total
- ✅ Questions properly integrated into segment logic

### ✓ Gap 2: Supabase Integration
- ✅ Migration file complete: `supabase/migrations/001_discovery_schema.sql`
- ✅ `saveDiscoveryResult()` fully implemented
- ✅ All database functions ready (insert, select, analytics)
- ✅ RLS policies configured for security

### ✓ Gap 3: Resend Email Service
- ✅ `sendEmailViaResend()` improved with better error handling
- ✅ Server-side API key configuration (`RESEND_API_KEY`)
- ✅ Email sender configuration (`RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`)
- ✅ All 3 email templates functional
- ✅ Logging and error tracking added

### ✓ Gap 4: Email Scheduling (Cron Job)
- ✅ Created `/api/cron/send-scheduled-emails.ts`
- ✅ Vercel cron configuration in `vercel.json`
- ✅ Automatic retry logic (up to 3 attempts)
- ✅ Runs every hour to send Email 2 & Email 3

---

## 📋 Pre-Deployment Checklist

### Phase 1: Local Setup (5 minutes)

- [ ] **Clone/pull latest code**
  ```bash
  git pull origin main
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```

- [ ] **Create `.env.local` with values from `.env.example`**
  ```bash
  cp .env.example .env.local
  # Then fill in the actual values
  ```

### Phase 2: Supabase Setup (10 minutes)

- [ ] **Create Supabase project** (if not done)
  - Go to https://supabase.com
  - Create new project
  - Save project URL and API keys

- [ ] **Add Supabase credentials to `.env.local`**
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```

- [ ] **Run database migration**
  ```bash
  # Option A: Via Supabase Dashboard
  # 1. Go to SQL Editor
  # 2. Click "New Query"
  # 3. Copy/paste contents of supabase/migrations/001_discovery_schema.sql
  # 4. Click "Run"

  # Option B: Via Supabase CLI (if installed)
  supabase db push
  ```

- [ ] **Verify tables created**
  - Go to Supabase Dashboard → Table Editor
  - Verify these tables exist:
    - `discovery_results`
    - `scheduled_emails`
    - `email_events`
    - `analytics`

### Phase 3: Resend Setup (10 minutes)

- [ ] **Create Resend account**
  - Go to https://resend.com
  - Sign up and create API key

- [ ] **Verify a sender domain**
  - Follow Resend docs to add and verify your domain
  - Use: `hello@digitalcreativeshub.com` (or your domain)

- [ ] **Add Resend credentials to `.env.local`**
  ```
  RESEND_API_KEY=re_abc123...
  RESEND_FROM_EMAIL=hello@digitalcreativeshub.com
  RESEND_REPLY_TO=hello@digitalcreativeshub.com
  ```

### Phase 4: Local Testing (15 minutes)

- [ ] **Start dev server**
  ```bash
  npm run dev
  ```

- [ ] **Test discovery form**
  - Navigate to http://localhost:5173/discovery
  - Answer all 12 questions (including new capability questions)
  - Submit email
  - Check browser console for errors

- [ ] **Verify Email 1 sent**
  - Check browser Network tab
  - Should see POST to `/api/discovery`
  - Response should show `success: true`

- [ ] **Verify Supabase saved data**
  - Go to Supabase Dashboard
  - Check `discovery_results` table
  - Should see your test submission

- [ ] **Check Resend email delivery**
  - Check your email inbox
  - Should receive Email 1 within 1 minute

### Phase 5: Deploy to Vercel (10 minutes)

- [ ] **Push code to GitHub (if not already)**
  ```bash
  git add .
  git commit -m "fix: Add capability questions, complete email scheduling"
  git push origin main
  ```

- [ ] **Connect to Vercel**
  - Go to https://vercel.com
  - Import your GitHub repository
  - Select project settings

- [ ] **Add environment variables to Vercel**
  - Go to Settings → Environment Variables
  - Add all variables from `.env.local`:
    ```
    VITE_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    RESEND_API_KEY
    RESEND_FROM_EMAIL
    RESEND_REPLY_TO
    ```

- [ ] **Deploy**
  - Vercel automatically deploys when you push
  - Wait for build to complete (should take ~2-3 minutes)
  - Get live URL from Vercel Dashboard

### Phase 6: Production Testing (15 minutes)

- [ ] **Test discovery form on live site**
  - Visit your Vercel URL + `/discovery`
  - Answer all 12 questions
  - Submit with a test email

- [ ] **Verify Email 1 arrives**
  - Check inbox (may take up to 1 minute)
  - Email should show correct segment match

- [ ] **Verify data in Supabase**
  - Go to Supabase Dashboard
  - Check `discovery_results` table
  - Should see the production submission

- [ ] **Verify Email 2 is scheduled**
  - Go to Supabase Dashboard
  - Check `scheduled_emails` table
  - Should see Email 2 (scheduled for tomorrow)
  - Should see Email 3 (scheduled for 3 days from now)

- [ ] **Wait for cron job to run**
  - Vercel crons run on the hour (UTC)
  - After the next hour, check Supabase
  - `scheduled_emails` should show `sent: true` for Email 2

### Phase 7: Production Hardening (Optional but Recommended)

- [ ] **Add rate limiting**
  - Consider using Vercel rate limiting or middleware
  - Limit to 1 submission per email per hour

- [ ] **Set up error monitoring**
  - Add Sentry (https://sentry.io)
  - Configure to catch API errors

- [ ] **Create admin dashboard**
  - Add `/admin/analytics` page
  - Display segment distribution
  - Show recent submissions

- [ ] **Set up email webhook tracking** (Optional)
  - In Resend dashboard, configure webhook
  - Track opens, clicks, bounces

- [ ] **Enable analytics table**
  - Supabase migration includes `analytics` table
  - Set up cron to update daily stats

---

## 🔧 Environment Variables Explained

### Required (for production)

```
# Supabase (Database)
VITE_SUPABASE_URL         - Your Supabase project URL
VITE_SUPABASE_ANON_KEY    - Anonymous key (used by browser)
SUPABASE_SERVICE_ROLE_KEY - Service role key (used by server/cron)

# Resend (Email)
RESEND_API_KEY           - API key from Resend (server-side only!)
RESEND_FROM_EMAIL        - Sender email (must be verified in Resend)
RESEND_REPLY_TO          - Reply-to email
```

### Optional (nice to have)

```
VITE_RESEND_API_KEY      - Browser fallback (not recommended)
VITE_APP_URL             - Used in emails for links
VITE_CALENDLY_CONSULTATION - Calendly link for CTAs
VITE_PROGRAM_APPLICATION_URL - Program application link
```

---

## 📊 Email Flow Timeline

### Day 0 (Submission)
- User submits discovery form
- Email 1 sent **immediately** ✓
- Email 2 queued for tomorrow
- Email 3 queued for 3 days from now

### Day 1 (24 hours later)
- Cron job runs every hour
- Finds Email 2 in scheduled_emails table
- Sends Email 2 via Resend ✓

### Day 3 (72 hours later)
- Cron job finds Email 3
- Sends Email 3 via Resend ✓

---

## 🚨 Troubleshooting

### Email 1 not arriving
1. Check `.env` has `RESEND_API_KEY`
2. Check Resend API key is valid
3. Check sender email is verified in Resend
4. Check browser console for errors
5. Check Supabase logs for failures

### Email 2/3 not arriving
1. Check `scheduled_emails` table in Supabase
2. Verify `scheduled_for` time is past
3. Check cron job is deployed (Vercel Settings → Cron Jobs)
4. Check cron job logs in Vercel

### Form won't save
1. Check Supabase connection (`VITE_SUPABASE_URL` correct)
2. Check RLS policies allow inserts
3. Check `discovery_results` table exists

### Segment not matching correctly
1. Verify all 12 questions are answered
2. Check capability scores (new q4_management, q4_leadership)
3. Review segmentLogic.ts rules

---

## 📞 Support

- **Supabase Issues:** https://github.com/supabase/supabase/issues
- **Resend Issues:** https://resend.com/support
- **Vercel Issues:** https://vercel.com/support

---

## ✅ Sign-Off

- [ ] All 4 gaps fixed and tested locally
- [ ] Deployed to Vercel successfully
- [ ] Email 1 arrives on submission
- [ ] Emails 2 & 3 scheduled and sent
- [ ] Data persists in Supabase
- [ ] Segment logic working correctly
- [ ] Ready for production traffic

🎉 **Deployment Complete!**
