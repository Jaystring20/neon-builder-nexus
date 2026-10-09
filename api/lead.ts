/**
 * POST /api/lead: one Book a call intake from /book.
 *
 * A lead must never be lost, so it is kept in two places: the `leads` table
 * and an alert email to DCH. Either one succeeding is enough to say yes to the
 * visitor; only when both fail do we ask them to try again. After that, the
 * confirmation to the lead and the two-day nudge are best-effort.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseLead, routeLead } from "../src/data/leadIntake.js";
import { getSupabase, missingServerEnv } from "../src/lib/supabase.server.js";
import { sendEmailViaResendDetailed } from "../src/lib/resend.v3.js";
import { leadAlertEmail, leadConfirmationEmail, leadNudgeEmail } from "../src/lib/leadEmails.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};

  // Honeypot: a field people never see. Bots fill it; pretend all is well.
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ success: true });
  }

  const parsed = parseLead(body);
  if ("error" in parsed) return res.status(400).json({ success: false, error: parsed.error });
  const { lead } = parsed;
  const route = routeLead(lead);

  let stored = false;
  if (missingServerEnv().length === 0) {
    try {
      const { error } = await getSupabase().from("leads").insert([
        {
          source: "book_a_call",
          name: lead.name,
          email: lead.email,
          company: lead.company ?? null,
          phone: lead.phone ?? null,
          client_type: lead.clientType,
          needs: lead.needs,
          problem: lead.problem,
          currency: lead.currency,
          budget: lead.budget,
          timeline: lead.timeline,
          practice: route.practice,
          priority: route.priority,
        },
      ]);
      if (error) console.error("leads insert failed:", error.message);
      else stored = true;
    } catch (err) {
      console.error("leads insert failed:", err);
    }
  }

  const alert = await sendEmailViaResendDetailed(leadAlertEmail(lead, route));
  if (!alert.ok) console.error("Lead alert not sent:", alert.error);

  if (!stored && !alert.ok) {
    return res.status(500).json({
      success: false,
      error: "We couldn't send your details just now. Please try again in a moment.",
    });
  }

  // Best-effort from here: the lead is already safe.
  const confirm = await sendEmailViaResendDetailed(leadConfirmationEmail(lead, route));
  if (!confirm.ok) console.error("Lead confirmation not sent:", confirm.error);

  if (missingServerEnv().length === 0) {
    try {
      const nudge = leadNudgeEmail(lead, route);
      const { error } = await getSupabase().from("scheduled_emails").insert([
        {
          email: lead.email,
          email_type: "lead_nudge",
          subject: nudge.subject,
          html: nudge.html,
          scheduled_for: new Date(Date.now() + 2 * DAY_MS).toISOString(),
          sent: false,
        },
      ]);
      if (error) console.error("Could not queue lead nudge:", error.message);
    } catch (err) {
      console.error("Could not queue lead nudge:", err);
    }
  }

  return res.status(200).json({ success: true, practice: route.practice, summary: route.summary });
}
