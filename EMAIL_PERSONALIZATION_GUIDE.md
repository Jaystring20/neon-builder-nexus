# Email Personalization Guide

## The Transformation

**Before (v1):** Generic template emails with basic name personalization  
**After (Enhanced):** Fully personalized emails that reference their specific business context

---

## How It Works

### Context Extraction
When someone submits the discovery form, we capture:

```typescript
{
  vision: "Premium interior design studio for high-net-worth clients",
  values: ["Premium", "Excellence"],
  challenge: "Getting corporate/high-value customers",
  priority: "Landing 5 enterprise clients in 90 days",
  revenueModel: "project-based",
  scale: "national",
  expertise: 4,
  management: 3,
  leadership: 4,
  advantage: "Deep relationships with luxury brands",
  pressure: "balance"
}
```

This context is passed to all three email generators and used throughout.

---

## Email 1: Discovery Summary

### What Changed

**Before:**
```
Subject: Your Segment Match: MSME Value

Hi Sarah,

Based on your responses, we found that you match the MSME Value segment.
This means you're building a premium business with few customers at high margin.

Your recommended program is: MSME Mastery: Premium Positioning

[Generic description of program]

Check back tomorrow for more details.

Best regards,
Digital Creatives Hub
```

**After:**
```
Subject: 💎 Premium Positioning Master: Your Program Match

Hi Sarah,

What You're Building
"Premium interior design studio for high-net-worth clients"

This vision shapes every decision. It's why you're here, and it's why we can 
recommend a program that actually fits.

Why This Segment Fits
You're mission-driven to serve premium clients with obsessive quality. 
Premium is your positioning. That means being ruthless about saying no 
to the wrong customers and obsessive about serving the right ones.

We Heard You
The Constraint: Getting high-value customers is hard. Enterprise customers 
have different buying cycles, RFP processes, relationships. This is a 
different game.

Your 90-Day Win: Landing 5 enterprise clients in 90 days

What We're Seeing
Premium positioning requires discipline. You'll need to turn away 9/10 
customers to serve the 1 you love. This program teaches you how.

[Personalized explanation of why THIS program solves THEIR problem]
```

### Key Personalization Elements

1. **Their vision is referenced** — Not generic, but their specific vision
2. **Their values inform the insight** — "Mission-driven" insight appears because they selected values related to impact
3. **Their constraint is explained** — Not generic "customer acquisition," but specifically "enterprise customers have different buying cycles..."
4. **Their 90-day goal is called out** — Shows we read and understood their priority
5. **The program recommendation is contextualized** — Not just "this program is great," but "here's why THIS program solves YOUR specific problem"

---

## Email 2: Program Deep Dive

### What Changed

**Before:**
```
Subject: MSME Mastery: Premium Positioning Program Details

Email 2 Overview
[Generic program description]

Tiers and Pricing
[Standard tier descriptions]

Next Steps
Apply or book a consultation.
```

**After:**
```
Subject: 💎 Deep Dive: MSME Mastery: Premium Positioning

Why This Program for You
Most premium-positioned founders compete on price because they haven't 
articulated their true advantage. You have one — we help you weaponize it.

You told us your biggest constraint is getting corporate/high-value customers. 
This program teaches you exactly how to attract them and position yourself 
as the expert they need to hire.

1. One-on-One Consultation (90 minutes)
Discussion of their specific positioning challenges and opportunities.

2. Paid Program (4 weeks)
[Program details with context about how it applies to them]

3. Done With You (3-6 months)
Ongoing support to execute what you learn, specifically designed for 
founders who have corporate customer goals.

4. Done For You (6-12 months)
We implement positioning and help you close your first enterprise customers.
```

### Key Personalization Elements

1. **Problem statement is their problem** — Not "founders often have X issue," but "You have this issue"
2. **Constraint callback** — Mentions their specific constraint from the form
3. **Program tiers are relevant** — Explains which tier makes sense given their goals
4. **Timeline matches ambition** — "90 days to 5 enterprise clients" guides tier selection
5. **Success metrics reference their priority** — "Close your first enterprise customers" directly echoes their 90-day goal

---

## Email 3: Call to Action

### What Changed

**Before:**
```
Subject: Ready to Get Started?

It's time to take the next step in your business.

Apply for the program or book a consultation.

Next Steps
[Generic steps]

FAQ
[Standard questions]
```

**After:**
```
Subject: 💎 Premium Positioning Master: Let's Get You Started →

Let's Get Started

You're building "premium interior design studio for high-net-worth clients". 
You've got the skills and the vision.

What you need is a clear playbook — a step-by-step path to landing 
enterprise clients at premium prices.

That's exactly what the MSME Mastery: Premium Positioning program provides.

Ready to Apply?

Option 1: Start with a consultation
[Book consultation link]

Option 2: Jump straight to application
[Apply directly link]

What Happens Next
1. You reach out
2. We confirm fit with your specific goal (landing enterprise clients)
3. You choose your tier (consultation, paid program, or ongoing support)
4. We build a positioning strategy tailored to your business and constraints

FAQ

Q: Will this program work for my specific business?
A: That's what the consultation is for. We'll confirm the fit and customize 
the approach to your actual business model, your goal of landing enterprise 
clients, and your 90-day timeline.

Q: What if I'm not ready to commit to the full program?
A: Start with the consultation. We'll be honest about whether this program 
makes sense for you and your enterprise growth goals.

[etc.]
```

### Key Personalization Elements

1. **Direct reference to vision** — "You're building X. You've got Y and Z."
2. **Echoes their constraint** — "What you need is a clear playbook to landing enterprise clients"
3. **Mirrors their goal** — CTA and next steps acknowledge their 90-day ambition
4. **FAQ addresses THEIR concerns** — "Will this work for enterprise clients?" not generic questions
5. **Personal tone** — Feels like conversation, not form letter

---

## Implementation Details

### Where Personalization Happens

#### Stage 1: Form Submission
```typescript
// In src/api/discovery.ts
const emailContext = {
  vision: answers.q2_vision,
  values: answers.q3_values,
  challenge: answers.q9_challenge,
  priority: answers.q10_priority,
  revenueModel: answers.q7_revenue,
  scale: answers.q6_scale,
  // ... etc
};
```

#### Stage 2: Email Generation
```typescript
// In src/lib/resend.ts
export function generateEmail1(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context?: EmailContext  // <- Personalization data
): EmailPayload {
  // Use context to personalize all copy
  return {
    subject: `${emoji} ${title}: Your Program Match`,
    html: `
      <p>What You're Building</p>
      <p><strong>"${context.vision}"</strong></p>
      ...
    `,
  };
}
```

#### Stage 3: Scheduled Emails
```typescript
// When Email 2 and 3 are scheduled for later
const email2Payload = generateEmail2(
  founderName, 
  email, 
  segment, 
  program, 
  emailContext  // <- Same context passed
);
```

---

## Personalization Points by Email

### Email 1: 7 Personalization Points
1. Subject includes their segment emoji + title
2. "What You're Building" section quotes their vision
3. Values insight reflects their specific values
4. "We Heard You" section restates their constraint + goal
5. Program recommendation explains WHY for them
6. Capability warning (if relevant to their scores)
7. Timeline callout with their email schedule

### Email 2: 5 Personalization Points
1. Subject includes segment emoji
2. Why this program explains their specific problem
3. "You told us..." callback to their constraint
4. Program structure explained through their lens
5. Tiers positioned relative to their goals (e.g., "Done For You for founders who want enterprise customers")

### Email 3: 6 Personalization Points
1. Subject references their segment title
2. "You're building X" echoes their vision
3. "What you need is..." reflects their constraint
4. Next steps acknowledge their 90-day ambition
5. FAQ answers address THEIR specific goals
6. Tone feels like a person who knows their business

---

## Design Principles

### 1. Echo, Don't Repeat
```
❌ DON'T: "We understand you're looking to grow your business."
✓ DO: "You want to land 5 enterprise clients in 90 days. That's specific."
```

### 2. Show Understanding
```
❌ DON'T: "Enterprise customers can be challenging."
✓ DO: "Enterprise customers have different buying cycles, RFP processes, 
       and relationships. This is a different game than selling to SMBs."
```

### 3. Make It Actionable
```
❌ DON'T: "Here's the program details..."
✓ DO: "Here's how this program specifically helps you land enterprise 
       clients through better positioning..."
```

### 4. Maintain Coherence
Email 1 → Email 2 → Email 3 build on each other coherently, with consistent language and references to their specific context.

---

## Examples: Before vs After

### Example 1: Interior Designer

**Before Email 1:**
```
Hi Sarah,

You've been matched to the MSME Value segment. This means you're 
building a premium business with few customers at high margins.

Your recommended program is MSME Mastery: Premium Positioning.

More details tomorrow.
```

**After Email 1:**
```
Hi Sarah,

What You're Building
"Premium interior design studio for high-net-worth clients"

Why This Segment Fits
Premium positioning is your strength. You're building a business where 
quality and exclusivity matter more than scale. The question is whether 
you're protecting it with selective customers and premium pricing, or 
giving it away by competing on price.

We Heard You
The Constraint: Getting high-value customers requires a different 
playbook. Enterprise buyers have RFPs, long sales cycles, and rely on 
reputation and relationships.

Your 90-Day Win: Landing 5 enterprise clients at your premium price point.

Program Recommendation
MSME Mastery: Premium Positioning teaches you to position yourself as 
the expert enterprise clients NEED to hire (not just want). This program 
is built exactly for your goal of landing high-value customers while 
protecting your premium positioning.
```

### Example 2: SaaS Founder

**Before Email 1:**
```
Hi James,

You've been matched to the Startup segment. This means you're building 
for venture scale with high growth ambitions.

Your recommended program is Startup Strategy Intensive.

Learn more in tomorrow's email.
```

**After Email 1:**
```
Hi James,

What You're Building
"Subscription-based SaaS for international markets"

Why This Segment Fits
Subscription + international scale = venture opportunity. You're pursuing 
a high-complexity, high-reward model. This requires different thinking than 
local project-based services.

We Heard You
The Constraint: Scaling without losing control. You need systems, team, 
and clarity on unit economics before you burn through runway.

Your 90-Day Win: Proving product-market fit with 20+ paying customers 
in at least 2 countries.

Program Recommendation
Startup Strategy Intensive teaches you the playbook for venture-scale 
growth: find PMF first, build the team, then scale spend. This program 
is built for founders pursuing your exact trajectory.
```

---

## How to Extend

### Adding New Personalization Points

1. **Add to EmailContext interface**
   ```typescript
   export interface EmailContext {
     // ... existing fields
     newField: string;
   }
   ```

2. **Extract from form**
   ```typescript
   const emailContext = {
     // ... existing
     newField: answers.q_new_answer,
   };
   ```

3. **Use in email template**
   ```typescript
   export function generateEmail1(
     founderName: string,
     email: string,
     segment: SegmentResult,
     program: Program | null,
     context?: EmailContext
   ): EmailPayload {
     // Use context.newField in the HTML
   }
   ```

### Custom Insight Generators

For each field, there are insight generator functions:

```typescript
// In src/lib/resend.ts
function getConstraintExplanation(challenge: string): string {
  // Maps constraint to personalized insight
}

function getValueInsight(values?: string[]): string {
  // Maps values to personalized insight
}
```

Add more as you discover patterns that resonate.

---

## Testing Personalization

### Test Email 1
- Submit form with specific vision: "Premium interior design..."
- Check: Email 1 quotes exact vision
- Check: Constraint explanation is specific (not generic)
- Check: Value insight reflects selected values

### Test Email 2
- Check: Program description explains WHY for their model
- Check: Pricing tiers positioned relative to their goals
- Check: "You told us..." callback appears

### Test Email 3
- Check: Next steps acknowledge their 90-day goal
- Check: FAQ addresses their specific situation
- Check: Tone feels personal, not templated

---

## Results to Expect

### Metrics to Track

1. **Open Rate** — Should be higher than generic emails (20-25% for personalized)
2. **Click Rate** — Should be higher than generic emails (3-5% for personalized)
3. **Reply Rate** — Personalized emails get more replies asking for clarification
4. **Application Rate** — More people apply because emails feel tailored to them
5. **Program Selection** — Tier choices match their specific goals better

### Qualitative Feedback

Founders should say things like:
- "This feels like they actually read my answers"
- "They understand my specific problem"
- "The program recommendation makes sense for my business"
- "This isn't a generic email, it's for me"

---

## Philosophy

**The goal is to feel like a conversation, not a broadcast.**

Each email should make the founder feel:
1. ✓ "They understand my business"
2. ✓ "They read my specific answers"
3. ✓ "This program is tailored to my situation"
4. ✓ "I want to learn more"

When you achieve that, conversions follow naturally. 🎯
