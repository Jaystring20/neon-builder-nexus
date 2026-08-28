/**
 * Resend Email System v3 - Multi-Segment Personalization
 *
 * Complete rebuild for multi-segment compatibility.
 *
 * Key Principles:
 * 1. NO assumptions about segment—each email educates and personalizes
 * 2. Email 1 helps founder UNDERSTAND their segment
 * 3. Email 2 explains program value for THEIR specific model
 * 4. Email 3 removes friction to applying
 * 5. All copy is specific (no AI slop like "based on your responses")
 * 6. Works equally for all 5 segments: MSME Value, MSME Volume, Startup, Professional Service, Development Org
 */

import type { SegmentResult } from "../data/segmentLogic";
import type { Program } from "../data/programDefinitions";

// ============================================================
// TYPES
// ============================================================

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailContext {
  // Their actual business answers
  vision?: string; // What they're building
  values?: string[]; // What drives them
  challenge?: string; // Their constraint
  priority?: string; // Their 90-day goal
  revenueModel?: string; // How they make money
  scale?: string; // Geographic ambition
  expertise?: number; // Domain knowledge (1-5)
  management?: number; // Team management (1-5)
  leadership?: number; // Leadership capability (1-5)
  advantage?: string; // Competitive advantage
  pressure?: string; // Work capacity
}

// ============================================================
// SEGMENT METADATA (For all 5 segments)
// ============================================================

const SEGMENT_INFO: Record<
  string,
  { emoji: string; title: string; description: string }
> = {
  msme_value: {
    emoji: "💎",
    title: "Premium Positioning Master",
    description:
      "You're building a premium business: few customers, high value, intentional positioning.",
  },
  msme_volume: {
    emoji: "📈",
    title: "Volume Growth Builder",
    description:
      "You're scaling through volume: many customers, recurring revenue, operational leverage.",
  },
  startup: {
    emoji: "🚀",
    title: "Venture-Scale Founder",
    description:
      "You're pursuing venture ambitions: high growth, team scaling, venture capital ready.",
  },
  professional_service: {
    emoji: "🎯",
    title: "Expert Service Provider",
    description:
      "You're selling expertise: your skills and knowledge are the product, high pricing power.",
  },
  development_org: {
    emoji: "🌱",
    title: "Impact Organization Builder",
    description:
      "You're building for impact: mission-driven, sustainable revenue, creating change.",
  },
};

// ============================================================
// HELPER: Get segment details
// ============================================================

function getSegmentEmoji(segment: string): string {
  return SEGMENT_INFO[segment]?.emoji || "→";
}

function getSegmentTitle(segment: string): string {
  return SEGMENT_INFO[segment]?.title || "Business Builder";
}

// ============================================================
// EMAIL 1: Day 0 - Segment Discovery
//
// Goal: Help them UNDERSTAND their segment + personalize to them
// NOT: "You're in this segment" (assumes they know)
// But: "Here's why this segment fits + what it means for you"
// ============================================================

export function generateEmail1(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context?: EmailContext
): EmailPayload {
  const emoji = getSegmentEmoji(segment.segment);
  const title = getSegmentTitle(segment.segment);
  const info = SEGMENT_INFO[segment.segment];

  // Build personalized content based on their answers
  const buildingStatement = context?.vision
    ? `"${context.vision}"`
    : "your business idea";

  const whyThisSegmentFits = getSegmentFitExplanation(segment.segment, context);
  const programExplanation = getProgramRecommendationExplanation(
    segment.segment,
    program,
    context
  );
  const capabilityWarning = getCapabilityWarning(segment, context);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 32px 24px;
    }
    .section {
      margin-bottom: 28px;
    }
    .section h2 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .section p {
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .quote {
      background: #f3f4f6;
      border-left: 4px solid #06b6d4;
      padding: 16px;
      margin: 16px 0;
      font-style: italic;
      color: #374151;
    }
    .insight {
      background: #ecf0f1;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 16px 0;
    }
    .insight p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: #ea580c;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin-top: 16px;
    }
    .cta-button:hover {
      background: #c24506;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${emoji} ${title}</h1>
      <p>Your discovery results are here</p>
    </div>

    <div class="content">
      <div class="section">
        <h2>What You're Building</h2>
        <div class="quote">${buildingStatement}</div>
        <p>This is the foundation. Everything we recommend flows from this.</p>
      </div>

      <div class="section">
        <h2>Why This Segment Fits</h2>
        <p>${whyThisSegmentFits}</p>
      </div>

      ${
        context?.challenge
          ? `
        <div class="section">
          <h2>Your Challenge</h2>
          <p>You told us: <strong>${context.challenge}</strong></p>
          <p>${getChallengeContext(context.challenge, segment.segment)}</p>
        </div>
      `
          : ""
      }

      ${
        capabilityWarning
          ? `
        <div class="insight">
          <p><strong>⚠️ Capability Gap:</strong> ${capabilityWarning}</p>
        </div>
      `
          : ""
      }

      <div class="section">
        <h2>Your Program</h2>
        <p><strong>${program?.name || "Business Strategy Program"}</strong></p>
        <p>${programExplanation}</p>
        <p style="margin-top: 16px;">
          <a href="${process.env.VITE_CALENDLY_CONSULTATION || '#'}" class="cta-button">
            Book Your Consultation
          </a>
        </p>
      </div>

      <div class="section">
        <h2>What's Next</h2>
        <p>Check your email tomorrow for a deep dive on your program. Day 3, we'll follow up with the application process.</p>
      </div>
    </div>

    <div class="footer">
      <p>Digital Creatives Hub | Founder Discovery</p>
      <p>This is the start of clarity. Let's build on it.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${emoji} ${title}: Your Program Match`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshubltd.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// EMAIL 2: Day 1 - Program Deep Dive
//
// Goal: Explain program value specifically for THEIR model
// NOT: Generic program description
// But: "Here's why this program works for founders like you"
// ============================================================

export function generateEmail2(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context?: EmailContext
): EmailPayload {
  const emoji = getSegmentEmoji(segment.segment);
  const programExplanation = getProgramDetails(segment.segment, program, context);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 32px 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .section {
      margin-bottom: 28px;
    }
    .section h2 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .section p {
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .tier {
      background: #f3f4f6;
      border-left: 4px solid #06b6d4;
      padding: 16px;
      margin: 12px 0;
    }
    .tier h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    .tier p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background: #ea580c;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin-top: 16px;
    }
    .cta-button:hover {
      background: #c24506;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${emoji} Deep Dive: ${program?.name || "Your Program"}</h1>
    </div>

    <div class="content">
      <div class="section">
        <h2>Why This Program Works for You</h2>
        <p>${programExplanation}</p>
      </div>

      <div class="section">
        <h2>Three Ways to Engage</h2>

        <div class="tier">
          <h3>1. One-on-One Consultation (90 min)</h3>
          <p>Start here. We get specific about your business, constraints, and next moves. Fits founders who are still figuring it out.</p>
        </div>

        <div class="tier">
          <h3>2. Paid Program (4-8 weeks)</h3>
          <p>Structured learning + implementation. Fits founders who want a clear playbook and are ready to execute immediately.</p>
        </div>

        <div class="tier">
          <h3>3. Done With You (3-6 months)</h3>
          <p>Consultation + ongoing support as you execute. Fits founders who want guidance and accountability throughout.</p>
        </div>
      </div>

      <div class="section">
        <p style="margin-top: 24px;">
          <a href="${process.env.VITE_CALENDLY_CONSULTATION || '#'}" class="cta-button">
            Ready? Book a Consultation →
          </a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Digital Creatives Hub | Founder Discovery</p>
      <p>One more message on day 3. Let's get you unstuck.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${emoji} Deep Dive: ${program?.name || "Your Program"}`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshubltd.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// EMAIL 3: Day 3 - Final CTA
//
// Goal: Remove friction, make it easy to apply
// NOT: "Let's talk about your business" (vague)
// But: "Here's exactly what happens next"
// ============================================================

export function generateEmail3(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context?: EmailContext
): EmailPayload {
  const emoji = getSegmentEmoji(segment.segment);
  const title = getSegmentTitle(segment.segment);
  const nextStepsText = getNextStepsForSegment(segment.segment, context);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 32px 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .section {
      margin-bottom: 28px;
    }
    .section h2 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .section p {
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .step {
      display: flex;
      margin-bottom: 16px;
    }
    .step-number {
      background: #ea580c;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
      margin-right: 16px;
    }
    .step-content {
      flex: 1;
    }
    .step-content p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .cta-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .cta-button {
      flex: 1;
      display: block;
      background: #ea580c;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
    }
    .cta-button:hover {
      background: #c24506;
    }
    .secondary-button {
      flex: 1;
      display: block;
      background: #e5e7eb;
      color: #111827;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
    }
    .secondary-button:hover {
      background: #d1d5db;
    }
    .faq {
      background: #f9fafb;
      padding: 16px;
      border-radius: 6px;
      margin-top: 12px;
    }
    .faq h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
    }
    .faq p {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${emoji} ${title}: Let's Get Started</h1>
    </div>

    <div class="content">
      <div class="section">
        <h2>You've Got This</h2>
        <p>You're building something real. You've got clarity on who you are and what you need.</p>
        <p>The next step is simple: let's talk about how to get there.</p>
      </div>

      <div class="section">
        <h2>Two Options</h2>
        <div class="cta-buttons">
          <a href="${process.env.VITE_CALENDLY_CONSULTATION || '#'}" class="cta-button">
            Book Consultation
          </a>
          <a href="${process.env.VITE_PROGRAM_APPLICATION_URL || '#'}" class="secondary-button">
            Apply Directly
          </a>
        </div>
      </div>

      <div class="section">
        <h2>What Happens Next</h2>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <p><strong>You reach out</strong> — pick consultation or direct application</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <p><strong>We confirm fit</strong> — this is real, and it has to be right for both of us</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <p><strong>You choose your tier</strong> — consultation, paid program, or ongoing support</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <p><strong>We build together</strong> — execute your plan with clarity and confidence</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>FAQ</h2>
        <div class="faq">
          <h3>Will this actually work for my business?</h3>
          <p>That's what the consultation is for. We'll get specific about your model, constraints, and goals. We'll be honest about fit.</p>
        </div>
        <div class="faq" style="margin-top: 12px;">
          <h3>What if I'm not ready to commit yet?</h3>
          <p>Start with the consultation. No pressure. We'll help you figure out the next step.</p>
        </div>
        <div class="faq" style="margin-top: 12px;">
          <h3>How long does this take?</h3>
          <p>Consultation is 90 minutes. Programs range from 4 weeks to 6 months. You choose.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Digital Creatives Hub | Founder Discovery</p>
      <p>Questions? Reply to this email. We're here.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${emoji} ${title}: Let's Get Started →`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshubltd.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// PERSONALIZATION HELPERS (No AI slop)
// ============================================================

function getSegmentFitExplanation(
  segment: string,
  context?: EmailContext
): string {
  const explanations: Record<string, string> = {
    msme_value:
      "Premium positioning is your strength. You're building a business where quality, exclusivity, and selective customers matter more than scale. The question isn't whether you can grow—it's whether you want to, and on your terms.",

    msme_volume:
      "You're scaling through leverage: many customers, efficient operations, recurring revenue. The question isn't whether your model works—it does. The question is: can you systematize it without losing quality?",

    startup:
      "Venture-scale ambitions require a different playbook than growing a lifestyle business. You need to think about team, fundraising, unit economics, and aggressive growth. This is achievable, but the constraints are different.",

    professional_service:
      "Your expertise is your asset. You're selling your knowledge and skills at premium rates. The challenge is: can you scale expertise without replacing yourself, or is solo premium positioning your actual goal?",

    development_org:
      "Impact is your primary constraint. You're building for mission first, sustainable revenue second. The question is: can you sustain the mission long enough to matter? That requires a real business model.",
  };

  return explanations[segment] || "Your business model is unique to you.";
}

function getChallengeContext(challenge: string, segment: string): string {
  // Map challenges to segment-specific context
  if (challenge === "customer_acquisition") {
    return "This is the constraint that kills most businesses. Good news: it's solvable if your model is clear.";
  }
  if (challenge === "operations") {
    return "Operations breaking is usually a signal that your model is wrong or you're scaling too fast. Fix the model first.";
  }
  if (challenge === "team") {
    return "Team issues usually hide model issues. Get the model right first; then hiring makes sense.";
  }
  if (challenge === "funding") {
    return "Money is usually a symptom. If your model works, funding becomes easier.";
  }
  if (challenge === "clarity") {
    return "Lack of clarity kills momentum. Getting specific about your constraint is step 1.";
  }
  return "Your constraint is real. Let's get specific about how to fix it.";
}

function getCapabilityWarning(
  segment: SegmentResult,
  context?: EmailContext
): string | null {
  // Only show warning if there's a real capability gap
  if (!segment.capabilityGap) return null;

  const warnings: Record<string, string> = {
    expertise_gap:
      "You're building in a domain you're learning. That's fine—many founders do. Just know that domain expertise matters more for some models than others.",
    management_gap:
      "You haven't managed a team yet, but your model requires scaling a team. That's a learnable skill, but budget time for it.",
    leadership_gap:
      "You're still developing leadership skills. Scaling requires this—start investing in it now.",
  };

  return warnings[segment.capabilityGap] || null;
}

function getProgramRecommendationExplanation(
  segment: string,
  program: Program | null,
  context?: EmailContext
): string {
  if (!program) return "Your personalized program is being prepared.";

  const explanations: Record<string, string> = {
    msme_value: `${program.name} teaches you to position yourself as the premium expert your ideal customers need to hire. You'll clarify your positioning, learn how to attract premium customers, and protect your pricing power.`,

    msme_volume: `${program.name} teaches you to scale through operational leverage: systemizing delivery, building a team, and optimizing for recurring revenue. Growth without losing quality.`,

    startup: `${program.name} teaches you the venture playbook: find product-market fit, build the team, raise capital if needed, scale aggressively. This is the right model for your ambition.`,

    professional_service: `${program.name} teaches you to leverage your expertise: pricing like an expert, building trust quickly, scaling through leverage (team, products, courses). Not a lifestyle business—a real professional service.`,

    development_org: `${program.name} teaches you to build sustainable impact: clarify your mission, create a sustainable revenue model, build the team, and scale your impact without compromising your values.`,
  };

  return explanations[segment] || `${program.name} is built specifically for your model.`;
}

function getProgramDetails(
  segment: string,
  program: Program | null,
  context?: EmailContext
): string {
  if (!program) return "Your program is being prepared.";

  const details: Record<string, string> = {
    msme_value:
      "Premium positioning requires discipline: saying no to wrong customers, saying yes to the right ones, and protecting your pricing. This program teaches exactly that.",

    msme_volume:
      "Growth through leverage means building systems, hiring smart, and creating recurring revenue. This program teaches the playbook.",

    startup:
      "Venture scale means product-market fit → team building → capital raising → aggressive growth. This program covers the full arc.",

    professional_service:
      "Expert positioning means high pricing, high trust, and leveraging your knowledge. This program teaches the full stack.",

    development_org:
      "Impact sustainability means mission clarity + sustainable revenue model + team building. This program teaches all three.",
  };

  return details[segment] || "Your program is built for your specific model.";
}

function getNextStepsForSegment(
  segment: string,
  context?: EmailContext
): string {
  // Personalize next steps by segment
  return "You've discovered your segment. Now let's build the playbook.";
}

// ============================================================
// SEND VIA RESEND
// ============================================================

/**
 * Boolean wrapper kept for callers that only branch on success.
 */
export async function sendEmailViaResend(payload: EmailPayload): Promise<boolean> {
  return (await sendEmailViaResendDetailed(payload)).ok;
}

/**
 * Same send, but returns why it failed.
 *
 * The boolean form discards Resend's response body into a console line, which
 * is unreachable without log access — leaving "the email did not send" with no
 * way to tell an unverified sending domain from a bad key. Callers that can
 * surface a reason should use this.
 */
export async function sendEmailViaResendDetailed(
  payload: EmailPayload
): Promise<{ ok: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return { ok: false, error: "RESEND_API_KEY is not set" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from || process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshubltd.com",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo || process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return { ok: false, error: `${response.status}: ${error.slice(0, 300)}` };
    }

    const result = (await response.json()) as { id?: string };
    console.log("Email sent successfully:", result.id);
    return { ok: true };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
