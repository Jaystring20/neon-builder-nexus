/**
 * Enhanced Resend Email Utilities
 *
 * Fully personalized discovery emails based on founder's actual answers.
 *
 * Email 1 (Day 0): "Here's what we're seeing"
 *   - Personalized segment match explanation
 *   - Why this segment fits their business
 *   - Program recommendation tailored to their context
 *
 * Email 2 (Day 1): "Deep dive into your program"
 *   - Program structure explained through their lens
 *   - How it specifically solves their biggest constraint
 *   - Pricing tiers and what's included
 *
 * Email 3 (Day 3): "Ready to get started?"
 *   - Application or consultation booking link
 *   - Clear next steps
 *   - Social proof / success stories
 */

import { SegmentResult, DiscoveryAnswers } from "../data/segmentLogic";
import { Program, getProgramBySegment } from "../data/programDefinitions";

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
  vision?: string;
  values?: string[];
  challenge?: string;
  priority?: string;
  revenueModel?: string;
  scale?: string;
  expertise?: number;
  management?: number;
  leadership?: number;
  advantage?: string;
  pressure?: string;
}

// ============================================================
// HELPERS
// ============================================================

function getSegmentTitle(segment: string): string {
  const titles: Record<string, string> = {
    msme_value: "Premium Positioning Master",
    msme_volume: "Market Penetration Expert",
    startup: "Venture Founder",
    professional_service: "Expert at Scale",
    development_org: "Impact Builder",
  };
  return titles[segment] || "Founder";
}

function getSegmentEmoji(segment: string): string {
  const emojis: Record<string, string> = {
    msme_value: "💎",
    msme_volume: "📈",
    startup: "🚀",
    professional_service: "⭐",
    development_org: "🌍",
  };
  return emojis[segment] || "👤";
}

function getConstraintExplanation(challenge: string): string {
  const explanations: Record<string, string> = {
    customers:
      "Customer acquisition is the lifeblood. Without a predictable way to get customers, nothing else matters.",
    team: "Team is the multiplier. One great person can 10x your output. Hire wrong, and you're blocked.",
    model: "A broken business model can't be fixed with better execution. You need the right playbook first.",
    scaling:
      "Scaling means systems and delegation. Most founders are good at doing, bad at multiplying.",
    corporate_access:
      "Enterprise customers have different buying cycles, RFP processes, relationships. This is a different game.",
    cash: "Cash flow is the oxygen. Profitability is optional; cash is not.",
    motivation:
      "Founder burnout is real. The question is: are you burnt out because the work is hard, or because it's the wrong work?",
  };
  return explanations[challenge] || "You're facing a real constraint that needs attention.";
}

function getValueInsight(values?: string[]): string {
  if (!values || values.length === 0) return "";

  if (values.includes("Impact") || values.includes("Mission")) {
    return "You're mission-driven. That's powerful, but mission-driven founders often undercharge and undercommunicate value. We'll help you build sustainable impact without burning out.";
  }
  if (values.includes("Premium") || values.includes("Excellence")) {
    return "Premium is your positioning. That means being ruthless about saying no to the wrong customers and being obsessive about serving the right ones.";
  }
  if (values.includes("Speed") || values.includes("Growth")) {
    return "You want to move fast and scale. That requires focus and discipline. The playbook matters more than hustle.";
  }
  if (values.includes("Freedom")) {
    return "Freedom is your north star. The right program will help you build a business that gives you that freedom, not takes it away.";
  }

  return "Your values are the compass. Everything flows from this.";
}

function getChallengeCallout(challenge?: string, priority?: string): string {
  if (!challenge) return "";

  const explanation = getConstraintExplanation(challenge);

  if (priority) {
    return `<p><strong>The Constraint:</strong> ${explanation}</p><p><strong>Your 90-Day Win:</strong> ${priority}</p>`;
  }

  return `<p><strong>The Constraint:</strong> ${explanation}</p>`;
}

// ============================================================
// EMAIL 1: DISCOVERY SUMMARY
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
  const valueInsight = getValueInsight(context?.values);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; }
    .wrapper { background: #f8fafc; padding: 40px 20px; }
    .container { background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
    .subtitle { font-size: 16px; color: #64748b; margin-bottom: 30px; }
    .emoji { font-size: 48px; margin-bottom: 16px; }
    .section { margin: 30px 0; }
    .highlight-box { background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .warning-box { background: #fef3c7; border-left: 4px solid #ea580c; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .insight { background: #f1f5f9; padding: 16px; margin: 16px 0; border-radius: 8px; border-left: 4px solid #0891b2; }
    .insight-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .insight-text { font-size: 14px; color: #334155; line-height: 1.6; }
    p { margin-bottom: 16px; }
    strong { font-weight: 600; color: #0f172a; }
    .program-badge { display: inline-block; background: #06b6d4; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
    .program-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .program-desc { color: #475569; font-size: 14px; line-height: 1.6; }
    .cta-button { display: inline-block; background: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .cta-button:hover { background: #c2410c; }
    .timeline { margin: 24px 0; }
    .timeline-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
    .timeline-item:last-child { border-bottom: none; }
    .timeline-date { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    .timeline-text { color: #334155; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 40px; font-size: 12px; color: #64748b; }
    .footer-links { margin-top: 16px; }
    .footer-links a { color: #06b6d4; text-decoration: none; margin-right: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div class="emoji">${emoji}</div>
        <h1>${title}</h1>
        <p class="subtitle">Based on your discovery responses, here's what we're seeing...</p>
      </div>

      <!-- Your Business -->
      ${context?.vision ? `
      <div class="section">
        <h2 style="font-size: 16px; border: none; padding: 0; margin-bottom: 12px;">What You're Building</h2>
        <p><strong>"${context.vision}"</strong></p>
        <p>This vision shapes every decision. It's why you're here, and it's why we can recommend a program that actually fits.</p>
      </div>
      ` : ""}

      <!-- The Match -->
      <div class="section">
        <h2 style="font-size: 16px; border: none; padding: 0; margin-bottom: 12px;">Why This Segment Fits</h2>
        <div class="insight">
          <div class="insight-text">${segment.emailPersonalization.modelDescription}</div>
        </div>
        ${valueInsight ? `<p>${valueInsight}</p>` : ""}
      </div>

      <!-- Your Constraint -->
      ${context?.challenge ? `
      <div class="section">
        <h2 style="font-size: 16px; border: none; padding: 0; margin-bottom: 12px;">We Heard You</h2>
        ${getChallengeCallout(context.challenge, context.priority)}
      </div>
      ` : ""}

      <!-- The Program -->
      <div class="section highlight-box">
        <div class="program-badge">RECOMMENDED PROGRAM</div>
        <div class="program-title">${segment.program}</div>
        <div class="program-desc">${segment.emailPersonalization.programFit}</div>
      </div>

      <!-- Capability Gap (if exists) -->
      ${segment.capabilityGap ? `
      <div class="warning-box">
        <strong>⚠️ Important:</strong> ${segment.capabilityGap}
      </div>
      ` : ""}

      <!-- What's Coming -->
      <div class="section">
        <h2 style="font-size: 16px; border: none; padding: 0; margin-bottom: 12px;">What's Next</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">Tomorrow</div>
            <div class="timeline-text"><strong>Email 2:</strong> Deep dive into the ${segment.program} program — how it works, pricing tiers, and what's included.</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">In 3 Days</div>
            <div class="timeline-text"><strong>Email 3:</strong> Application link or consultation booking. Next steps to get started.</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 40px 0;">
        <p style="margin-bottom: 20px; color: #475569;">Want to learn more now? We're happy to jump on a quick call.</p>
        <a href="${process.env.VITE_CALENDLY_CONSULTATION || 'https://calendly.com'}" class="cta-button">Book a Quick Call →</a>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>You received this email because you completed the Digital Creatives Hub Founder Discovery.</p>
        <p style="margin-top: 12px;">Questions? Just reply to this email — we read and respond to everything.</p>
        <p style="margin-top: 12px; color: #94a3b8;">Digital Creatives Hub | Helping Founders Build Better Businesses</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${emoji} ${title}: Your Program Match`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshub.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// EMAIL 2: PROGRAM DEEP DIVE
// ============================================================

export function generateEmail2(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null,
  context?: EmailContext
): EmailPayload {
  if (!program) {
    return generateEmail1(founderName, email, segment, program, context);
  }

  const emoji = getSegmentEmoji(segment.segment);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; }
    .wrapper { background: #f8fafc; padding: 40px 20px; }
    .container { background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
    h2 { font-size: 18px; font-weight: 700; margin: 24px 0 16px 0; color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 12px; }
    p { margin-bottom: 16px; }
    .section { margin: 30px 0; }
    .tier-box { background: #f1f5f9; border-left: 4px solid #0891b2; padding: 20px; margin: 16px 0; border-radius: 6px; }
    .tier-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .tier-price { font-size: 18px; font-weight: 700; color: #06b6d4; margin-bottom: 12px; }
    .tier-includes { font-size: 14px; color: #475569; }
    .tier-includes li { margin-bottom: 8px; }
    .consultation-box { background: #fef3c7; border-left: 4px solid #ea580c; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .consultation-title { font-weight: 700; color: #92400e; margin-bottom: 8px; }
    .phaseBox { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin: 12px 0; border-radius: 6px; }
    .phaseNum { display: inline-block; background: #06b6d4; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; margin-right: 12px; }
    .phaseText { font-size: 14px; color: #334155; }
    .cta-button { display: inline-block; background: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .cta-button:hover { background: #c2410c; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 40px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div style="margin-bottom: 32px;">
        <p style="margin-bottom: 8px; font-size: 14px; color: #64748b;">DEEP DIVE</p>
        <h1>${emoji} ${program.name}</h1>
        <p style="font-size: 16px; color: #64748b; margin-top: 8px;">${program.tagline}</p>
      </div>

      <!-- Why This Program -->
      <div class="section">
        <h2>Why This Program for You</h2>
        <p>${segment.emailPersonalization.problemStatement}</p>
        ${context?.challenge ? `
        <p style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 6px; border-left: 4px solid #0891b2;">
          <strong>You told us your biggest constraint is ${context.challenge}.</strong> This program teaches you exactly how to address it.
        </p>
        ` : ""}
      </div>

      <!-- Consultation -->
      <div class="consultation-box">
        <div class="consultation-title">1. One-on-One Consultation</div>
        <p>${program.consultation.what_happens}</p>
        <p><strong>Duration:</strong> ${program.consultation.duration}</p>
        <p><strong>Outcome:</strong> ${program.consultation.outcome}</p>
      </div>

      <!-- Paid Program -->
      <div class="section">
        <h2>2. Paid Program (${program.paidProgram.duration})</h2>
        <div class="tier-box">
          <div class="tier-title">${program.paidProgram.name}</div>
          <div class="tier-price">₦${program.paidProgram.price.min.toLocaleString()} — ₦${program.paidProgram.price.max.toLocaleString()}</div>
          <p style="margin: 12px 0; color: #475569;">${program.paidProgram.description}</p>
          <div class="tier-includes"><strong>Includes:</strong>
            <ul style="margin-left: 20px; margin-top: 8px;">
              ${program.paidProgram.includes.map((inc) => `<li>${inc}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Done With You -->
      <div class="section">
        <h2>3. Done With You (${program.doneWithYou.duration})</h2>
        <div class="tier-box">
          <div class="tier-title">${program.doneWithYou.name}</div>
          <div class="tier-price">₦${program.doneWithYou.price.min.toLocaleString()}/mo — ₦${program.doneWithYou.price.max.toLocaleString()}/mo</div>
          <p style="margin: 12px 0; color: #475569;">${program.doneWithYou.description}</p>
          <div class="tier-includes"><strong>Includes:</strong>
            <ul style="margin-left: 20px; margin-top: 8px;">
              ${program.doneWithYou.includes.map((inc) => `<li>${inc}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Done For You -->
      <div class="section">
        <h2>4. Done For You (${program.doneForYou.duration})</h2>
        <div class="tier-box">
          <div class="tier-title">${program.doneForYou.name}</div>
          <div class="tier-price">₦${program.doneForYou.price.min.toLocaleString()} — ₦${program.doneForYou.price.max.toLocaleString()}</div>
          <p style="margin: 12px 0; color: #475569;">${program.doneForYou.description}</p>
          <div class="tier-includes"><strong>Includes:</strong>
            <ul style="margin-left: 20px; margin-top: 8px;">
              ${program.doneForYou.includes.map((inc) => `<li>${inc}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Learning Pathway -->
      <div class="section">
        <h2>4-Phase Learning Pathway</h2>
        ${[
          { phase: 1, desc: program.learningPathway.phase1 },
          { phase: 2, desc: program.learningPathway.phase2 },
          { phase: 3, desc: program.learningPathway.phase3 },
          { phase: 4, desc: program.learningPathway.phase4 },
        ]
          .map(
            (p) => `
          <div class="phaseBox">
            <span class="phaseNum">${p.phase}</span>
            <span class="phaseText">${p.desc}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 40px 0; padding: 24px; background: #f0f9ff; border-radius: 8px;">
        <p style="margin-bottom: 16px; font-size: 16px; font-weight: 600; color: #0f172a;">Ready to get started?</p>
        <a href="${process.env.VITE_PROGRAM_APPLICATION_URL || "https://calendly.com"}" class="cta-button">Apply or Book Consultation →</a>
        <p style="margin-top: 16px; font-size: 13px; color: #64748b;">Or just reply to this email if you have questions.</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Questions about the program? Reply to this email and we'll get back to you within 24 hours.</p>
        <p style="margin-top: 12px; color: #94a3b8;">Digital Creatives Hub | Helping Founders Build Better Businesses</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${emoji} Deep Dive: ${program.name}`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshub.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// EMAIL 3: CALL TO ACTION
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

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; }
    .wrapper { background: #f8fafc; padding: 40px 20px; }
    .container { background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
    h2 { font-size: 18px; font-weight: 700; margin: 24px 0 16px 0; color: #0f172a; }
    p { margin-bottom: 16px; }
    .section { margin: 30px 0; }
    .cta-box { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 32px; border-radius: 8px; text-align: center; margin: 24px 0; }
    .cta-box h2 { color: white; border: none; margin-top: 0; }
    .cta-button { display: inline-block; background: white; color: #ea580c; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 16px 0; }
    .cta-button:hover { background: #f1f5f9; }
    .next-steps { background: #f1f5f9; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .step { margin-bottom: 12px; }
    .step-num { display: inline-block; background: #06b6d4; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: 700; font-size: 12px; margin-right: 8px; }
    .faq-item { margin: 16px 0; }
    .faq-question { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
    .faq-answer { font-size: 14px; color: #475569; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 40px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 48px; margin-bottom: 16px;">${emoji}</div>
        <h1>Let's Get Started</h1>
        <p style="font-size: 16px; color: #64748b; margin-top: 8px;">We know you're ready. Here's what's next.</p>
      </div>

      <!-- The Pitch -->
      <div class="section">
        <p>You're building ${context?.vision ? `<strong>"${context.vision}"</strong>` : "something meaningful"}. You've got the skills and the vision.</p>
        <p>What you need is a <strong>clear playbook</strong> — a step-by-step path to the next level.</p>
        <p>That's exactly what the ${program?.name || segment.program} program provides.</p>
      </div>

      <!-- CTA -->
      <div class="cta-box">
        <h2>Ready to Apply?</h2>
        <p style="margin-bottom: 20px;">Two ways to get started:</p>
        <div>
          <p style="font-size: 14px; margin-bottom: 12px;">Option 1: Start with a consultation</p>
          <a href="${process.env.VITE_CALENDLY_CONSULTATION || "https://calendly.com"}" class="cta-button">Book Your Consultation →</a>
        </div>
        <div style="margin-top: 20px;">
          <p style="font-size: 14px; margin-bottom: 12px;">Option 2: Jump straight to application</p>
          <a href="${process.env.VITE_PROGRAM_APPLICATION_URL || "https://calendly.com"}" class="cta-button">Apply Now →</a>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="section next-steps">
        <h2 style="margin-top: 0;">What Happens Next</h2>
        <div class="step">
          <span class="step-num">1</span>
          <strong>You reach out</strong> — via application or consultation booking
        </div>
        <div class="step">
          <span class="step-num">2</span>
          <strong>We'll confirm fit</strong> — make sure this program is right for you
        </div>
        <div class="step">
          <span class="step-num">3</span>
          <strong>You choose your tier</strong> — consultation, paid program, or ongoing support
        </div>
        <div class="step">
          <span class="step-num">4</span>
          <strong>We build the playbook</strong> — tailored to your business and constraints
        </div>
      </div>

      <!-- FAQ -->
      <div class="section">
        <h2>Common Questions</h2>

        <div class="faq-item">
          <div class="faq-question">💬 Will this program work for my specific business?</div>
          <div class="faq-answer">That's exactly what the consultation is for. We'll confirm the fit and customize the approach to your actual business model, constraints, and goals.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">💬 What if I'm not ready to commit to the full program?</div>
          <div class="faq-answer">Start with the consultation. No pressure. We'll be honest about whether this program makes sense for you, and we'll never sell you something that isn't the right fit.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">💬 How is this different from other programs?</div>
          <div class="faq-answer">Most programs are generic. We match you to a specific business model playbook, then customize it to your unique constraints (time, money, skills, values). The playbook matters.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">💬 Can I still ask questions?</div>
          <div class="faq-answer">Always. Just reply to this email. We read everything and respond within 24 hours.</div>
        </div>
      </div>

      <!-- Final CTA -->
      <div style="text-align: center; margin: 40px 0; padding: 24px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #ea580c;">
        <p style="font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px;">Let's build this together</p>
        <a href="${process.env.VITE_CALENDLY_CONSULTATION || "https://calendly.com"}" class="cta-button">Book a Call or Apply →</a>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>About us:</strong> Digital Creatives Hub helps founders build better businesses. We don't do generic advice. We work with your specific business model and help you navigate the constraints that are actually blocking your growth.</p>
        <p style="margin-top: 12px; color: #94a3b8;">Questions? Reply to this email anytime.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${title}: Let's Get You Started →`,
    html,
    from: process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshub.com",
    replyTo: process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com",
  };
}

// ============================================================
// SEND EMAIL VIA RESEND
// ============================================================

export async function sendEmailViaResend(payload: EmailPayload): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY || import.meta.env.VITE_RESEND_API_KEY;

    if (!apiKey) {
      console.error("Resend API key not configured. Set RESEND_API_KEY in .env");
      return false;
    }

    const senderEmail = process.env.RESEND_FROM_EMAIL || "hello@digitalcreativeshub.com";
    const replyToEmail = process.env.RESEND_REPLY_TO || "hello@digitalcreativeshub.com";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: payload.from || senderEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo || replyToEmail,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", {
        status: response.status,
        error: errorText,
        to: payload.to,
        subject: payload.subject,
      });
      return false;
    }

    const data = await response.json();
    console.log("Email sent successfully:", {
      messageId: (data as any).id,
      to: payload.to,
      subject: payload.subject,
    });

    return true;
  } catch (err) {
    console.error("Failed to send email:", {
      error: err instanceof Error ? err.message : String(err),
      to: payload.to,
      subject: payload.subject,
    });
    return false;
  }
}
