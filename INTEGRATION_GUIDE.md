# Integration Guide: Multi-Segment Rebuild

## Step-by-Step Integration

### Step 1: Update `src/pages/discovery.tsx`

**Current:**
```typescript
import DiscoveryPage from "./pages/discovery";
import { DiscoveryForm } from "../components/DiscoveryForm";

export default function Discovery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DiscoveryForm />
    </div>
  );
}
```

**Updated:**
```typescript
import { DiscoveryFormV3 } from "../components/DiscoveryForm.v3";

export default function Discovery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DiscoveryFormV3 />
    </div>
  );
}
```

### Step 2: Update `src/api/discovery.ts`

**Change imports:**
```typescript
// OLD
import {
  generateEmail1,
  generateEmail2,
  generateEmail3,
  sendEmailViaResend,
} from "../lib/resend";

// NEW
import {
  generateEmail1,
  generateEmail2,
  generateEmail3,
  sendEmailViaResend,
  type EmailContext,
} from "../lib/resend.v3";
```

**Verify EmailContext is being built (should already be in current code):**
```typescript
// This should already exist around line 100
const emailContext: EmailContext = {
  vision: answers.q2_vision,
  values: answers.q3_values,
  challenge: answers.q9_challenge,
  priority: answers.q10_priority,
  revenueModel: answers.q7_revenue,
  scale: answers.q6_scale,
  expertise: answers.q4_expertise,
  management: answers.q4_management,
  leadership: answers.q4_leadership,
  advantage: answers.q8_advantage,
  pressure: answers.q5_pressure,
};

// Pass context to all email generators
const email1Payload = generateEmail1(founderName, email, segment, program, emailContext);
const email2Payload = generateEmail2(founderName, email, segment, program, emailContext);
const email3Payload = generateEmail3(founderName, email, segment, program, emailContext);
```

### Step 3: Create symlink or copy new email file

**Option A: Copy (simpler)**
```bash
cp src/lib/resend.v3.ts src/lib/resend.ts
```

**Option B: Symlink (easier to maintain)**
```bash
rm src/lib/resend.ts
ln -s resend.v3.ts src/lib/resend.ts
```

**Option C: Keep both for now (safest)**
Keep `src/lib/resend.enhanced.ts` as backup, add `src/lib/resend.v3.ts` as new file, update imports to point to v3.

### Step 4: Copy or create new form file

**Option A: Replace directly**
```bash
cp src/components/DiscoveryForm.v3.tsx src/components/DiscoveryForm.tsx
```

**Option B: Keep both and import v3**
```bash
# Keep old DiscoveryForm.tsx as backup
cp src/components/DiscoveryForm.tsx src/components/DiscoveryForm.v2-backup.tsx
# Use v3 as the main implementation
cp src/components/DiscoveryForm.v3.tsx src/components/DiscoveryForm.tsx
```

---

## Verification Checklist

### After File Changes
- [ ] No build errors: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Imports resolve correctly
- [ ] EmailContext interface is recognized

### After Local Testing
- [ ] `npm run dev` starts without errors
- [ ] `/discovery` page loads
- [ ] Form renders (12 questions visible)
- [ ] Each question has an insight or follow-up
- [ ] Clicking answers updates form state
- [ ] Progress bar updates
- [ ] Back button works
- [ ] Mobile layout works
- [ ] Dark mode works
- [ ] Reduced motion works (no animations if enabled)

### After Submitting Test Form
- [ ] Form submission succeeds
- [ ] Redirect to thank you page
- [ ] Email 1 arrives in inbox
- [ ] Email 1 has personalization (quotes from answers)
- [ ] Email 2 arrives 24 hours later
- [ ] Email 3 arrives 72 hours later
- [ ] All email links work
- [ ] No AI slop phrases in emails

### Segment Testing
Test each segment with a distinct persona:

**MSME Value Test:**
```
Q1: Steady (growing steadily)
Q2: Provide service
Q3: Quality, Profitability, Sustainability
Q4: Expertise = 4
Q4b: Management = 3
Q5: Full-time, need balance (40-50 hrs)
Q6: National
Q7: Project-based
Q8: Expertise/Relationships
Q9: Customer acquisition
Q10: Land 5 enterprise clients in 90 days
```
Expected: Segment = MSME Value, Email should mention "premium positioning," "selective customers"

**MSME Volume Test:**
```
Q1: Early revenue
Q2: Sell product
Q3: Growth, Speed, Profitability
Q4: Expertise = 3
Q4b: Management = 2, but wants to scale
Q5: Full-time, all-in
Q6: National
Q7: Recurring subscription
Q8: Price + Speed
Q9: Operations
Q10: Get to $20k MRR in 90 days
```
Expected: Segment = MSME Volume, Email should mention "systems," "team," "scaling"

**Startup Test:**
```
Q1: Scaling fast
Q2: Sell product
Q3: Growth, Impact
Q4: Expertise = 2
Q4b: Management = 1, but wants to build team
Q5: Full-time, all-in
Q6: International
Q7: Recurring subscription
Q8: Proprietary technology
Q9: Funding/Capital
Q10: Prove product-market fit with 50 paying customers in 90 days
```
Expected: Segment = Startup, Email should mention "venture," "team building," "capital"

**Professional Service Test:**
```
Q1: Steady
Q2: Provide service
Q3: Quality, Expertise
Q4: Expertise = 5
Q4b: Management = 2, wants to stay small
Q5: Full-time with balance
Q6: National
Q7: One-time fees
Q8: Expertise
Q9: Customer acquisition
Q10: Land 3 high-value clients at premium rates in 90 days
```
Expected: Segment = Professional Service, Email should mention "expertise," "premium pricing," "leverage"

**Development Org Test:**
```
Q1: Early revenue
Q2: Create impact
Q3: Impact, Mission, Sustainability
Q4: Expertise = 3
Q4b: Management = 1
Q5: Full-time with balance
Q6: Local/National
Q7: Donations/Grants (or subscription from beneficiaries)
Q8: Mission alignment
Q9: Funding/Model clarity
Q10: Prove sustainability model with first $30k annual committed revenue in 90 days
```
Expected: Segment = Development Org, Email should mention "mission," "sustainable revenue," "impact"

---

## Environment Variables Check

Verify these are set:

```bash
# .env.local or .env.production

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Resend (for email)
RESEND_API_KEY=re_xxx...
VITE_RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=noreply@digitalcreativeshub.com
RESEND_REPLY_TO=support@digitalcreativeshub.com

# URLs
VITE_APP_URL=http://localhost:5173 (dev) or https://digitalcreativeshub.com (prod)
VITE_DISCOVERY_URL=/discovery
VITE_CALENDLY_CONSULTATION=https://calendly.com/...
VITE_PROGRAM_APPLICATION_URL=https://...
```

---

## Database Schema Check

Verify tables exist:

```sql
-- Check discovery_results table
SELECT * FROM discovery_results LIMIT 1;

-- Check scheduled_emails table
SELECT * FROM scheduled_emails LIMIT 1;

-- If either is missing, run migrations:
-- See supabase/migrations/001_discovery_schema.sql
```

---

## Deployment Steps

### Development
1. Create local feature branch: `git checkout -b feature/multi-segment-rebuild`
2. Copy files:
   - `src/components/DiscoveryForm.v3.tsx` (new form)
   - `src/lib/resend.v3.ts` (new emails)
   - `MULTI_SEGMENT_REBUILD.md` (documentation)
3. Update imports in:
   - `src/pages/discovery.tsx`
   - `src/api/discovery.ts`
4. Test locally: `npm run dev`
5. Commit: `git add . && git commit -m "feat: Multi-segment discovery rebuild (v3)"`
6. Create PR to main

### Staging (Optional)
1. Deploy to staging environment
2. QA test all 5 segment flows
3. Verify email delivery
4. Get stakeholder sign-off

### Production
1. Merge PR to main
2. Vercel auto-deploys
3. Monitor in real-time:
   - Check `/discovery` page loads
   - Verify form submissions
   - Check email delivery
   - Monitor segment distribution

### Rollback Plan
If issues arise:
```bash
# Revert to previous version
git revert <commit-hash>
# Or restore from backup
cp src/lib/resend.enhanced.ts src/lib/resend.ts
cp src/components/DiscoveryForm.v2.tsx src/components/DiscoveryForm.tsx
```

---

## Monitoring & Metrics

After deployment, track these KPIs:

### Form Metrics
- **Completion Rate:** % of users who finish all questions
  - Target: 80%+
  - Track: completion_rate = (finished / started) * 100
  - Query: `SELECT COUNT(*) as started FROM discovery_results; SELECT COUNT(*) as finished FROM discovery_results WHERE answers->>'q10_priority' IS NOT NULL;`

- **Confusion Points:** Where do users drop off?
  - Track: For each question, what % of starts make it to next?
  - Target: No question should have >20% drop-off

- **Insight Engagement:** Do insights get read?
  - Track: Time on page for questions with vs. without insights
  - Target: Insights should add 5-10 seconds per question

### Email Metrics
- **Open Rate:** % who open email
  - Before: 15-20%
  - Target: 25-30%
  - Track via Resend analytics

- **Click Rate:** % who click links
  - Before: 1-2%
  - Target: 3-5%
  - Track via Resend analytics

- **Application Rate:** % who book consultation or apply
  - Before: 5-10%
  - Target: 15-25%
  - Track: (consultations_booked + applications_submitted) / emails_sent

### Segment Metrics
- **Distribution:** Should be relatively even
  - MSME Value: 15-25%
  - MSME Volume: 15-25%
  - Startup: 15-25%
  - Professional Service: 15-25%
  - Development Org: 10-20%
  - Before: 60% MSME Value (biased)
  - Target: ±5% from 20% for each segment

- **Segment Accuracy:** Do applications match segment?
  - Ask in consultation: "Does this segment feel right?"
  - Track: % who say "yes" vs "I think I'm different"
  - Target: 85%+

### Founder Feedback
- **Personalization:** "Did the email feel personalized to you?"
  - Track: Post-consultation survey
  - Target: 80%+ say "yes"

- **Clarity:** "Did the process help clarify your business model?"
  - Track: Post-form survey
  - Target: 75%+ say "yes"

- **AI Slop:** Any mentions of generic phrases?
  - Track: Manual review of feedback
  - Target: 0 mentions of "based on your responses," etc.

---

## Example Monitoring Query (SQL)

```sql
-- Completion rate by day
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN answers->>'q10_priority' IS NOT NULL THEN 1 END) as completed,
  ROUND(100.0 * COUNT(CASE WHEN answers->>'q10_priority' IS NOT NULL THEN 1 END) / COUNT(*), 1) as completion_rate
FROM discovery_results
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Segment distribution
SELECT 
  segment,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM discovery_results), 1) as percentage
FROM discovery_results
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY segment
ORDER BY count DESC;

-- Capability gaps
SELECT 
  capability_gap,
  COUNT(*) as count
FROM discovery_results
WHERE capability_gap IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY capability_gap
ORDER BY count DESC;
```

---

## Support & Troubleshooting

### Form not rendering
- Check console for TypeScript errors
- Verify DiscoveryForm.v3 exports `DiscoveryFormV3`
- Check `framer-motion` is installed: `npm list framer-motion`

### Emails not sending
- Check `RESEND_API_KEY` is valid
- Check `RESEND_FROM_EMAIL` is verified in Resend dashboard
- Check Vercel cron is running: check `/api/cron/send-scheduled-emails` logs
- Test manually: `curl -X POST http://localhost:3000/api/discovery -H "Content-Type: application/json" -d '{"email":"test@example.com","answers":{...}}'`

### Wrong segment assigned
- Check `calculateSegment()` logic in `src/data/segmentLogic.ts`
- Check answers are being captured correctly (print to console)
- Check IF-THEN rules match intended logic

### Personalization not showing
- Check `EmailContext` is populated in API handler
- Check email template uses `context.vision` etc.
- Check founder answers were saved (query `discovery_results`)

---

## Next Steps After Deployment

1. **Week 1:** Monitor all metrics
2. **Week 2:** Gather founder feedback (survey, interviews)
3. **Week 3:** Identify top 3 improvements (insights, questions, emails)
4. **Week 4:** Deploy improvements (iteration cycle)

Target: 2-3 iteration cycles to reach 25-30% email open rate + 15-25% application rate.
