/**
 * Resend Email Utilities
 *
 * Send personalized discovery emails:
 * - Email 1 (Day 0): Summary of discovery results + segment match
 * - Email 2 (Day 1): Deep dive into program fit + playbook section
 * - Email 3 (Day 3): Program details + CTA to apply or book consultation
 */

import { SegmentResult } from "../data/segmentLogic";
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

// ============================================================
// EMAIL TEMPLATES
// ============================================================

/**
 * Email 1: Discovery Summary (sent immediately)
 * - Your segment match
 * - Program recommendation
 * - Next email timeline
 */
export function generateEmail1(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null
): EmailPayload {
  const segmentLabel = segment.segment
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 24px; margin: 0 0 10px 0; color: #0f172a; }
    h2 { font-size: 18px; margin: 30px 0 15px 0; color: #1e293b; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
    .highlight { background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0; }
    .program-box { background: #fef3c7; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; }
    .cta { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
    .timeline { background: #f1f5f9; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .timeline-item { margin: 15px 0; }
    .timeline-label { font-weight: bold; color: #0f172a; }
    .timeline-desc { color: #475569; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hey ${founderName.split(" ")[0]}! 🎯</h1>
    <p>We've reviewed your discovery answers, and here's what we found:</p>

    <div class="highlight">
      <strong>Your match:</strong> ${segmentLabel}
      <p>${segment.emailPersonalization.modelDescription}</p>
    </div>

    <div class="program-box">
      <strong>Your program:</strong> ${segment.program}
      <p>${segment.emailPersonalization.programFit}</p>
    </div>

    <h2>What comes next</h2>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-label">📧 Email 1 (Today)</div>
        <div class="timeline-desc">Your personalized discovery summary (you're reading it now!)</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-label">📧 Email 2 (Tomorrow)</div>
        <div class="timeline-desc">Deep dive into the ${segment.program} and how it works</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-label">📧 Email 3 (Day 3)</div>
        <div class="timeline-desc">Apply to the program or book a free consultation</div>
      </div>
    </div>

    ${
      segment.capabilityGap
        ? `
    <h2>⚠️ One thing to know</h2>
    <div class="highlight">
      <p>${segment.capabilityGap}</p>
      <p>We'll address this head-on in the program. Many founders have overcome this—you can too.</p>
    </div>
    `
        : ""
    }

    <p>Questions? Just reply to this email. We're here to help.</p>

    <div class="footer">
      <p>Digital Creatives Hub</p>
      <p>© 2026. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `Your Personalized Program Match: ${segment.program}`,
    html,
    from: "hello@digitalcreativeshub.com",
    replyTo: "hello@digitalcreativeshub.com",
  };
}

/**
 * Email 2: Program Deep Dive (sent day 1)
 * - Why this program fits
 * - Program structure and phases
 * - What to expect
 */
export function generateEmail2(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null
): EmailPayload {
  if (!program) {
    return {
      to: email,
      subject: "Your Program Details",
      html: "<p>Error generating email</p>",
    };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 24px; margin: 0 0 10px 0; color: #0f172a; }
    h2 { font-size: 18px; margin: 30px 0 15px 0; color: #1e293b; }
    .section { margin: 25px 0; }
    .phase { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #06b6d4; }
    .phase-title { font-weight: bold; color: #0c4a6e; }
    .cta { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .pricing { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Deep Dive: ${program.name}</h1>
    <p>Here's why this program is perfect for you:</p>

    <div class="section">
      <h2>Why This Fits You</h2>
      <p>${segment.emailPersonalization.programFit}</p>
    </div>

    <div class="section">
      <h2>How It Works</h2>
      <p><strong>Step 1: Consultation</strong></p>
      <p>${program.consultation.what_happens}</p>
      <p><strong>Outcome:</strong> ${program.consultation.outcome}</p>
    </div>

    <div class="section">
      <h2>The Program Structure</h2>

      <div class="phase">
        <div class="phase-title">🎯 Phase 1: ${program.learningPathway.phase1}</div>
        <p style="margin: 5px 0; font-size: 14px; color: #475569;">Focus on clarity and validation</p>
      </div>

      <div class="phase">
        <div class="phase-title">🚀 Phase 2: ${program.learningPathway.phase2}</div>
        <p style="margin: 5px 0; font-size: 14px; color: #475569;">Iterate based on results</p>
      </div>

      <div class="phase">
        <div class="phase-title">⚡ Phase 3: ${program.learningPathway.phase3}</div>
        <p style="margin: 5px 0; font-size: 14px; color: #475569;">Execute and go-to-market</p>
      </div>

      <div class="phase">
        <div class="phase-title">📈 Phase 4: ${program.learningPathway.phase4}</div>
        <p style="margin: 5px 0; font-size: 14px; color: #475569;">Scale and optimize</p>
      </div>
    </div>

    <div class="section">
      <h2>What's Included</h2>
      <ul style="font-size: 14px; color: #475569;">
        ${program.paidProgram.includes
          .slice(0, 5)
          .map((item) => `<li>${item}</li>`)
          .join("")}
      </ul>
    </div>

    <div class="pricing">
      <h3 style="margin-top: 0;">Pricing</h3>
      <p><strong>${program.paidProgram.name}</strong></p>
      <p style="font-size: 18px; color: #ea580c; font-weight: bold;">₦${program.paidProgram.price.min.toLocaleString()} - ₦${program.paidProgram.price.max.toLocaleString()}</p>
      <p style="font-size: 14px; color: #64748b; margin: 10px 0 0 0;">${program.paidProgram.duration}</p>
    </div>

    <div class="section">
      <h2>Next Step</h2>
      <p>Tomorrow, we'll send you the full program details and a link to apply or book your free consultation.</p>
      <p><strong>Ready to start?</strong> We'll see you then!</p>
    </div>

    <div class="footer">
      <p>Digital Creatives Hub</p>
      <p>© 2026. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${program.name} – How It Works`,
    html,
    from: "hello@digitalcreativeshub.com",
    replyTo: "hello@digitalcreativeshub.com",
  };
}

/**
 * Email 3: Call to Action (sent day 3)
 * - Program application or consultation booking
 * - Success stories / testimonials (optional)
 * - Final pitch
 */
export function generateEmail3(
  founderName: string,
  email: string,
  segment: SegmentResult,
  program: Program | null
): EmailPayload {
  if (!program) {
    return {
      to: email,
      subject: "Let's Get Started",
      html: "<p>Error generating email</p>",
    };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 24px; margin: 0 0 10px 0; color: #0f172a; }
    h2 { font-size: 18px; margin: 30px 0 15px 0; color: #1e293b; }
    .cta-primary { display: inline-block; background: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .cta-secondary { display: inline-block; background: #e2e8f0; color: #0f172a; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 10px 20px 0; }
    .benefit { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 10px 0; }
    .benefit-title { font-weight: bold; color: #166534; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Let's Get Started, ${founderName.split(" ")[0]}</h1>
    <p>You've done the work to understand your business. Now let's build the strategy to scale it.</p>

    <h2>Why This Moment Matters</h2>
    <p>The founders we work with tell us the moment they commit is the moment things shift. You have clarity. You know your segment. You know what program fits.</p>
    <p>The only question left: <strong>Are you ready to go?</strong></p>

    <h2>Your Options</h2>

    <div style="background: #fef3c7; padding: 25px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #92400e;">Option 1: Free Consultation</h3>
      <p>90 minutes to map your strategy, identify gaps, and decide if we're the right fit.</p>
      <a href="https://calendly.com/dch/consultation" class="cta-secondary">Book a Call</a>
    </div>

    <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0c4a6e;">Option 2: Join the Program</h3>
      <p>Jump straight in. ${program.paidProgram.duration}. ₦${program.paidProgram.price.min.toLocaleString()} - ₦${program.paidProgram.price.max.toLocaleString()}.</p>
      <a href="https://dch.apply" class="cta-primary">Apply Now</a>
    </div>

    <h2>What You'll Get</h2>
    <div class="benefit">
      <div class="benefit-title">✓ Clarity</div>
      <p style="margin: 5px 0; font-size: 14px;">Know exactly what you're building and why</p>
    </div>
    <div class="benefit">
      <div class="benefit-title">✓ Strategy</div>
      <p style="margin: 5px 0; font-size: 14px;">A step-by-step roadmap tailored to your segment</p>
    </div>
    <div class="benefit">
      <div class="benefit-title">✓ Accountability</div>
      <p style="margin: 5px 0; font-size: 14px;">Weekly check-ins and peer cohort support</p>
    </div>
    <div class="benefit">
      <div class="benefit-title">✓ Results</div>
      <p style="margin: 5px 0; font-size: 14px;">By end of program: ${program.successMetric}</p>
    </div>

    <h2>No Time to Waste</h2>
    <p>Your window is now. Founders who start in the next 7 days get:</p>
    <ul style="font-size: 14px; color: #475569;">
      <li>Early-bird pricing (20% off first month)</li>
      <li>Direct access to our founder community</li>
      <li>Custom 1-on-1 kickoff strategy session</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://calendly.com/dch/consultation" class="cta-secondary">Book Consultation</a>
      <a href="https://dch.apply" class="cta-primary">Apply to Program</a>
    </div>

    <p>Questions? Reply to this email. We read every message and respond within 24 hours.</p>

    <div class="footer">
      <p>Digital Creatives Hub</p>
      <p>© 2026. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: email,
    subject: `${program.name} – Let's Get Started`,
    html,
    from: "hello@digitalcreativeshub.com",
    replyTo: "hello@digitalcreativeshub.com",
  };
}

/**
 * Send email via Resend
 * This function should be called from a serverless function or backend
 */
export async function sendEmailViaResend(payload: EmailPayload): Promise<boolean> {
  try {
    // Use server-side API key (RESEND_API_KEY from .env)
    // This function is called from server-side API routes only
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
      messageId: data.id,
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
