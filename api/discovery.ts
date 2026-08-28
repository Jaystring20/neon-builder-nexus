/**
 * POST /api/discovery — receive one completed discovery form.
 *
 * Lives at the repository root because Vercel only turns files under a
 * top-level `api/` directory into serverless functions. The previous copy sat
 * in `src/api/`, where it was compiled into the client bundle as dead code and
 * never deployed, which is why this endpoint answered 404 in production.
 *
 * Ordering here is deliberate. The submission is persisted first, and email
 * delivery is treated as best-effort afterwards. An earlier version returned
 * 500 when the welcome email failed, which discarded a completed twelve-question
 * form because of an unrelated Resend outage. A lead we captured but could not
 * email is recoverable; one we rejected at the door is gone.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { calculateSegment, type DiscoveryAnswers } from "../src/data/segmentLogic";
import { getProgramBySegment } from "../src/data/programDefinitions";
import { saveDiscoveryResult, getSupabase, missingServerEnv } from "../src/lib/supabase.server";
import {
  generateEmail1,
  generateEmail2,
  generateEmail3,
  sendEmailViaResend,
  type EmailContext,
} from "../src/lib/resend.v3";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // Named up front so a misconfigured deployment says which variable is absent
  // instead of failing later as a generic 500. Names only, never values.
  const missing = missingServerEnv();
  if (missing.length > 0) {
    console.error("Refusing to accept submissions, missing env:", missing.join(", "));
    return res.status(500).json({
      success: false,
      error: "The server is not configured to accept submissions yet.",
      missingEnv: missing,
    });
  }

  try {
    // Vercel parses JSON bodies, but a raw string arrives if the caller sent an
    // unusual content-type. Normalise rather than crashing on `.answers`.
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
    const { answers, email } = body as { answers?: DiscoveryAnswers; email?: string };

    if (!email || !answers) {
      return res
        .status(400)
        .json({ success: false, error: "Both 'email' and 'answers' are required." });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res
        .status(400)
        .json({ success: false, error: "That does not look like a valid email address." });
    }

    const segment = calculateSegment(answers);
    const program = getProgramBySegment(segment.segment);
    const founderName = trimmedEmail.split("@")[0];

    // Persist before anything that can fail on a third party.
    const saved = await saveDiscoveryResult(
      trimmedEmail,
      segment.segment,
      segment.program,
      answers as unknown as Record<string, unknown>,
      segment.capabilityGap
    );

    if (!saved) {
      // The write is the one step with no fallback: without it the submission
      // does not exist anywhere. Surface it so the form can offer a retry.
      return res.status(500).json({
        success: false,
        error: "We could not save your answers. Please try again.",
      });
    }

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

    // Everything below is best-effort. The answers are already safe.
    let emailQueued = false;
    try {
      emailQueued = await sendEmailViaResend(
        generateEmail1(founderName, trimmedEmail, segment, program, emailContext)
      );
    } catch (err) {
      console.error("Email 1 send failed:", err);
    }

    try {
      const now = Date.now();
      const email2 = generateEmail2(founderName, trimmedEmail, segment, program, emailContext);
      const email3 = generateEmail3(founderName, trimmedEmail, segment, program, emailContext);

      const { error } = await getSupabase().from("scheduled_emails").insert([
        {
          email: trimmedEmail,
          email_type: "email_2",
          subject: email2.subject,
          html: email2.html,
          scheduled_for: new Date(now + DAY_MS).toISOString(),
          sent: false,
        },
        {
          email: trimmedEmail,
          email_type: "email_3",
          subject: email3.subject,
          html: email3.html,
          scheduled_for: new Date(now + 3 * DAY_MS).toISOString(),
          sent: false,
        },
      ]);

      if (error) console.error("Could not queue follow-up emails:", error.message);
    } catch (err) {
      console.error("Could not queue follow-up emails:", err);
    }

    return res.status(200).json({
      success: true,
      segment: segment.segment,
      program: segment.program,
      emailQueued,
    });
  } catch (err) {
    console.error("Discovery handler error:", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong on our end. Please try again.",
    });
  }
}
