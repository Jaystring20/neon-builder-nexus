# Discovery Form v2 - Personalized & Insightful

## The Philosophy

The original form was a **questionnaire**. v2 is a **discovery experience**.

**Key Difference:**
- **v1:** "Answer these questions" → Calculate segment → Send generic emails
- **v2:** "Tell us about your business" → Provide real-time insights → Personalized, tailored recommendations

---

## What Changed

### 1. **Contextual Insights Between Questions**
Instead of asking 12 questions then analyzing, v2 provides insights **as they answer**.

**Example:** After answering "Where are you in your journey?"
- If "starting": "You're building from first principles. This means you have the freedom to shape your business model deliberately."
- If "scaling": "You're hitting the ceiling of the model you built. Scaling isn't just hiring more; it's redesigning the playbook."
- If "confused": "This is actually the right place to be. Clarity comes from getting specific about your constraints."

Each insight is **tailored to their specific answer**, not generic.

### 2. **Tighter Copy Throughout**
Every line serves a purpose. No filler.

**v1:** "Let's find the right program for your business"  
**v2:** "Let's get clear on where you are, what you're building, and what comes next."

**v1 Question:** "How would you rate your ability to manage a team?"  
**v2 Question:** "How would you rate your ability to manage a team?" + Subtitle: "Be honest. Can you lead, delegate, and build culture?"

The subtitle makes it clear **why** we're asking and what "good" looks like.

### 3. **Better Form Labels & Descriptions**
v1 had minimal context. v2 provides guidance.

**v1:**
```
Question: "What's your relationship with work pressure?"
Options:
  - "I want balance and sustainability"
  - "I can push hard, but with limits (40-50 hrs/week)"
```

**v2:** Same question, but the option text is clearer:
```
Options:
  - "I want balance and sustainability"
  - "I can push hard (40-50 hrs/week)"  ← Removed the qualifiers
  - "I'm ready to go all-in (60-80+ hrs)"  ← Reframed more positively
```

### 4. **Personalized Segment Reveal**
v1 showed: "Your Segment: MSME Value" + generic description.  
v2 shows:
- Your actual segment with emoji + title
- **"Based on your vision, values, and constraints, here's what we're seeing:"**
- Personalized insight (not generic template text)
- Why this program matches **your specific business**
- Capability warning if relevant

**Example personalized reveal:**
```
You said you're building a "premium interior design studio" with "Premium" 
and "Excellence" as core values, with "International" ambitions.

Here's what we see:
"Premium positioning is your strength. The question is whether you're 
protecting it with selective customers and premium pricing, or giving 
it away by competing on price."
```

### 5. **Personalized Email Sequence**
v1: Template emails with basic personalization ("[Name], here's your segment...")  
v2: Emails that reference their specific context:
- Their actual vision statement
- Their specific constraint/challenge
- Their segment with explanation
- Why this program solves **their** problem

### 6. **Better Navigation & Feedback**
- Progress bar shows percentage completed
- Back button on every question
- Error messages are helpful, not vague
- Loading states are clear
- Thank you page shows next steps clearly

---

## Implementation Guide

### Step 1: Replace the Old Component

```bash
# Backup old version
cp src/components/DiscoveryForm.tsx src/components/DiscoveryForm.v1.tsx

# Use new version
mv src/components/DiscoveryForm.v2.tsx src/components/DiscoveryForm.tsx
```

### Step 2: Update Imports (if needed)
The v2 component uses the same interfaces, so no API changes needed:
- ✓ Same `DiscoveryAnswers` interface
- ✓ Same `SegmentResult` interface
- ✓ Same `calculateSegment()` function
- ✓ Same `getProgramBySegment()` function

### Step 3: Enhance Email Templates
Update `src/lib/resend.ts` to use personalized copy:

```typescript
// Instead of this:
export function generateEmail1(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null
): EmailPayload {
  // Generic template
  return {
    subject: `Your Segment Match: ${segment.segment}`,
    html: `<p>Hi ${founderName},</p><p>Based on your responses...`,
  };
}

// Do this:
export function generateEmail1(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context: {
    vision: string;
    challenge: string;
    values: string[];
  }
): EmailPayload {
  // Personalized to their context
  return {
    subject: `${segment.segment}: Here's your match →`,
    html: `
      <p>Hi ${founderName},</p>
      <p>You told us you're building: <strong>${context.vision}</strong></p>
      <p>And your biggest constraint is: <strong>${context.challenge}</strong></p>
      <p>Here's why ${segment.program} is the right fit...
    `,
  };
}
```

### Step 4: Update API Handler
The `src/api/discovery.ts` already passes answers to email functions, but enhance it:

```typescript
// Add context extraction before sending emails
const emailContext = {
  vision: answers.q2_vision,
  challenge: answers.q9_challenge,
  values: answers.q3_values,
  advantage: answers.q8_advantage,
  revenueModel: answers.q7_revenue,
};

// Pass to email generators
const email1 = generateEmail1(founderName, email, segment, program, emailContext);
const email2 = generateEmail2(founderName, email, segment, program, emailContext);
const email3 = generateEmail3(founderName, email, segment, program, emailContext);
```

### Step 5: Test Locally
```bash
npm run dev
# Visit http://localhost:5173/discovery
# Go through flow
# Verify insights appear after each answer
# Check that email capture stage feels natural
# Verify thank you page is clear
```

---

## Key Improvements in Detail

### A. Real-Time Insights System

**How it works:**
1. User answers a question
2. Form checks if there's an insight for that answer
3. If yes, shows insight card with context
4. User clicks "Continue" to move to next question
5. If no insight, moves to next question immediately

**Benefits:**
- Feels like a conversation, not a questionnaire
- User feels understood ("They get it!")
- Builds confidence in the recommendation
- Slows down the flow (good: people who rush make bad decisions)

**Insights included for:**
- Q1 (Journey stage)
- Q2 (Vision) 
- Q3 (Values)
- Q7 (Revenue model)
- Q9 (Challenge)
- + Combined business model insights

### B. Personalized Copy Examples

**Instead of generic "What's your biggest challenge?", we now show:**

"What's your biggest constraint right now? (What's the bottleneck?)"

Then after they answer "Customer acquisition", the insight says:

"Customer acquisition is the leakiest bucket. You can have the best product in the world, but if no one knows about it, it doesn't matter."

This is **specifically relevant** to their answer, not a one-size-fits-all response.

### C. Better Scale Question Design

**v1 Scale Questions:**
- Just numbers 1-5
- No context for what "5" means

**v2 Scale Questions:**
```
1-5 scale with labels on each end:
"Never managed" ← → "Built a culture"
```

Users understand what each number represents before choosing.

### D. Improved Segment Reveal

**v1 Reveal:** 
```
Segment: MSME Value
Program: MSME Mastery: Premium Positioning
Description: [Generic text from program definitions]
```

**v2 Reveal:**
```
💎 Premium Positioning Master

Based on your vision, values, and constraints, here's what we're seeing:

[Personalized insight based on their specific answers]

Your Recommended Program: MSME Mastery: Premium Positioning

[Custom explanation of why THIS program solves THEIR problem]
```

### E. Better Error States

**v1:** "Please answer this question before continuing"  
**v2:** Same, but:
- Shows which question is incomplete
- Option focuses when clicked (clear visual feedback)
- Progress is preserved if they go back

---

## Design Patterns Used

### 1. Progressive Disclosure
- Show one question at a time
- Provide insight after answer
- Move to next question
- Builds clarity progressively

### 2. Contextual Help
- Every question has subtitle explaining why we ask
- Options have descriptive labels, not just values
- Insights connect question to business outcome

### 3. Real-Time Personalization
- Copy references their actual answers
- Emails use their vision, challenge, values
- Segment reveal explains why match is good

### 4. Clear Micro-Interactions
- Progress bar shows completion
- Buttons disable until answered
- Insights animate in
- Back button works from any stage
- Loading states are clear

---

## Metrics to Track

Once you deploy v2, track these to see if it's working:

### 1. **Completion Rate**
- v1 completion rate (baseline)
- v2 completion rate (should be higher)

### 2. **Time to Complete**
- v1 time (probably fast, skimming)
- v2 time (probably slower, reading insights)
- **Goal:** Slower is better (more thoughtful)

### 3. **Email Engagement**
- v1 open/click rates
- v2 open/click rates (should be higher due to personalization)

### 4. **Application Rate**
- % who click "Book Consultation" or apply
- v1 rate vs v2 rate
- **Goal:** Higher engagement → better conversions

### 5. **Segment Distribution**
- Track which segments are being matched
- Look for bias (too many of one segment = logic issue)

---

## Copy Guidelines (Maintain This Tone)

When writing insights or copy for the form:

✓ **Do:**
- Be specific (use their actual answers)
- Be direct ("Here's the problem...")
- Be confident ("This is what we're seeing")
- Acknowledge their constraint ("You told us X...")
- Connect to solution ("Here's why this program fixes it")

✗ **Don't:**
- Use generic phrases ("Based on industry best practices...")
- Over-explain ("Let us break down why...")
- Use marketing speak ("Unlock your potential...")
- Be condescending ("As an entrepreneur, you know...")
- Make promises ("You'll 10x your revenue...")

---

## Next Steps

1. **Test v2 locally** (30 min)
   - Go through flow as a user
   - Read every insight
   - Verify it feels like a conversation

2. **Gather feedback** (2 days)
   - Have 5-10 founders go through it
   - Note: "This felt [generic/personal/insightful/confusing]"
   - Refine copy based on feedback

3. **Deploy v2** (1 hour)
   - Replace component file
   - Update email functions
   - Deploy to Vercel

4. **Monitor metrics** (ongoing)
   - Track completion, engagement, conversions
   - Iterate on insights based on real data

---

## Philosophy Summary

**The goal isn't to be clever. It's to be useful.**

v2 succeeds if founders feel:
1. "They understand my business" (personalization)
2. "They've thought about my constraint" (insights)
3. "This recommendation makes sense for me" (tailored recommendation)
4. "I want to learn more" (engaged enough to read emails)

If you achieve that, conversions will follow. 🎯
