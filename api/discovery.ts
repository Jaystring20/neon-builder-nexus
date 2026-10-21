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
import { calculateSegment, type DiscoveryAnswers } from "../src/data/segmentLogic.js";
import { getProgramBySegment } from "../src/data/programDefinitions.js";
import { saveDiscoveryResult, getSupabase, missingServerEnv } from "../src/lib/supabase.server.js";
import {
  generateEmail1,
  generateEmail2,
  generateEmail3,
  sendEmailViaResendDetailed,
  type EmailContext,
} from "../src/lib/resend.v3.js";
import { discoveryAlertEmail } from "../src/lib/leadEmails.js";
import { matchOffer, offerLine } from "../src/data/offerMatch.js";
import { buildReading } from "../src/data/diagnosticReading.js";
import { SEGMENT_NAME } from "../src/data/segmentLogic.js";
import { mergeProgram } from "../src/data/siteContent.js";
import { loadSiteContent } from "../src/lib/siteContent.server.js";
import { leadHeat } from "../src/data/leadHeat.js";
import {
  recordEmailEvent,
  recordFunnelEvent,
  sessionSignals,
  upsertDiagnosticLead,
  validSession,
} from "../src/lib/diagnosticLeads.server.js";

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

  // ?op=track: one step of the funnel from the browser. Always 204, so a
  // visitor never sees an error for something they didn't ask for.
  if (req.query.op === "track") {
    try {
      const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
      await recordFunnelEvent(raw as Record<string, unknown>);
    } catch (err) {
      console.error("track failed:", err);
    }
    return res.status(204).end();
  }

  try {
    // Vercel parses JSON bodies, but a raw string arrives if the caller sent an
    // unusual content-type. Normalise rather than crashing on `.answers`.
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
    // Honeypot: a field people never see. Bots fill it; pretend all is well,
    // so nothing is saved and no email goes to an address a script supplied.
    if (typeof body.website === "string" && body.website.trim()) {
      return res.status(200).json({ success: true, emailQueued: true });
    }

    const { answers, email } = body as { answers?: DiscoveryAnswers; email?: string };
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";

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
    // With the team's dashboard edits, so emails match what the result screen showed.
    const program = mergeProgram(getProgramBySegment(segment.segment), (await loadSiteContent()).programmes?.[segment.segment]);
    const founderName = name;
    const reading = buildReading(segment, answers as unknown as Record<string, unknown>);
    const session = validSession(body.session_id);
    const signals = await sessionSignals(session).catch(() => ({ openedBooking: false, booked: false }));
    const allAnswers = { ...(answers as unknown as Record<string, unknown>), ...(name ? { contact_name: name } : {}) };
    const heat = leadHeat(allAnswers, { ...signals, confidence: segment.confidence });

    // Persist before anything that can fail on a third party.
    const saved = await saveDiscoveryResult(
      trimmedEmail,
      segment.segment,
      segment.program,
      // The first name rides with the answers; it has no column of its own.
      allAnswers,
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

    // Into the pipeline straight away, scored, so hot leads are seen first.
    if (saved.id) {
      try {
        await recordEmailEvent(session, saved.id, answers.q0_type);
        await upsertDiagnosticLead({
          discoveryId: saved.id,
          email: trimmedEmail,
          name,
          answers: allAnswers,
          program: segment.program,
          heat,
          booked: signals.booked,
          newsletter: body.newsletter === true,
        });
      } catch (err) {
        console.error("Could not create the diagnostic lead:", err);
      }
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
    let emailError: string | undefined;
    try {
      const sent = await sendEmailViaResendDetailed(
        generateEmail1(founderName, trimmedEmail, segment, program, emailContext, reading)
      );
      emailQueued = sent.ok;
      emailError = sent.error;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("Email 1 send failed:", err);
    }

    // Tell DCH a new lead has arrived. Best-effort, like every send here.
    try {
      const alert = await sendEmailViaResendDetailed(
        discoveryAlertEmail(
          trimmedEmail,
          { segment: segment.segment, program: segment.program, capabilityGap: segment.capabilityGap },
          answers as unknown as Record<string, unknown>,
          offerLine(matchOffer(segment.segment, answers as unknown as Record<string, unknown>, program)),
          {
            name: name || undefined,
            archetype: `${SEGMENT_NAME[segment.segment]}${reading.traits ? `, ${reading.traits}` : ""} (${segment.confidence} confidence)`,
            firstMove: reading.firstMove,
            tensions: reading.tensions,
          },
          heat,
        ),
      );
      if (!alert.ok) console.error("Discovery alert not sent:", alert.error);
    } catch (err) {
      console.error("Discovery alert failed:", err);
    }

    // Logged, never returned: this is a public endpoint, and the reason a send
    // failed can name the sending domain and other configuration. `emailQueued`
    // is enough for the caller; the detail belongs in the runtime logs.
    if (emailError) console.error("Email 1 not sent:", emailError);

    // Someone who has already booked doesn't need the nudges to book.
    if (!signals.booked) {
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
