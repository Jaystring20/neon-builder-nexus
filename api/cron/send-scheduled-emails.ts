/**
 * Scheduled email sender (cron job).
 *
 * Drains the scheduled_emails queue: the day-1 and day-3 follow-ups that
 * /api/discovery enqueues after a founder completes the form. Email 1 is sent
 * synchronously by that handler and never passes through here.
 *
 * Runs once daily — see the schedule in vercel.json. Do not restore the hourly
 * expression: Vercel's Hobby plan permits at most one run per day and rejects
 * the whole deployment at config validation if a cron asks for more, before the
 * build even starts. That silently froze production on a stale commit for
 * hours. Sub-daily delivery requires a Pro plan, not a code change.
 *
 * Because a run happens once a day, an email can go out up to a day after its
 * scheduled_for timestamp. That is within tolerance for day-scale follow-ups.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase } from "../../src/lib/supabase.server.js";
import { sendEmailBatchViaResend, sendEmailViaResend } from "../../src/lib/resend.v3.js";
import { weeklyDigestEmail, type DigestLead, type DigestDiscovery } from "../../src/lib/leadEmails.js";
import { paymentReminderEmail, reminderEmail, type RegistrationRow } from "../../src/lib/eventEmails.js";
import { lagosDay, type EventRecord } from "../../src/data/events.js";

interface ScheduledEmail {
  id: string;
  email: string;
  email_type: string;
  subject: string;
  html: string;
  scheduled_for: string;
  retry_count: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only Vercel's scheduler may run this. With CRON_SECRET set in Vercel, its
  // requests carry "Bearer <secret>" and nothing else is accepted. Without it,
  // Vercel sends no Authorization header at all, so fall back to its user agent;
  // the earlier check demanded a header that never came, so every scheduled
  // run was refused and the database saw no activity.
  const secret = process.env.CRON_SECRET;
  const authorized = secret
    ? req.headers.authorization === `Bearer ${secret}`
    : String(req.headers["user-agent"] ?? "").startsWith("vercel-cron/");
  if (!authorized) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("🕐 Scheduled email cron job started");

  // Mondays: the weekly lead summary to DCH. Best-effort, and it doubles as a
  // weekly proof that the database and email both work.
  if (new Date().getUTCDay() === 1) {
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [leads, discoveries] = await Promise.all([
        getSupabase()
          .from("leads")
          .select("created_at,name,email,company,priority,practice,problem")
          .gte("created_at", since)
          .order("created_at", { ascending: false }),
        getSupabase()
          .from("discovery_results")
          .select("created_at,email,program")
          .gte("updated_at", since)
          .order("updated_at", { ascending: false }),
      ]);
      if (leads.error) console.error("Digest: leads query failed:", leads.error.message);
      if (discoveries.error) console.error("Digest: discovery query failed:", discoveries.error.message);
      const sentDigest = await sendEmailViaResend(
        weeklyDigestEmail((leads.data ?? []) as DigestLead[], (discoveries.data ?? []) as DigestDiscovery[]),
      );
      if (!sentDigest) console.error("Weekly digest not sent");
    } catch (err) {
      console.error("Weekly digest failed:", err);
    }
  }

  // Event reminders. This job runs once a day (10:00 Lagos), so anything
  // starting in the next 36 hours gets its reminder now: "tomorrow" for most,
  // "today" for events late the next evening that the previous run missed.
  // Confirmed registrants get the join details; anyone still awaiting payment
  // gets the payment details again instead.
  try {
    const now = new Date();
    const { data: events, error } = await getSupabase()
      .from("events")
      .select("*")
      .eq("status", "published")
      .is("reminder_sent_at", null)
      .gt("starts_at", now.toISOString())
      .lte("starts_at", new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString());
    if (error) console.error("Event reminders: query failed:", error.message);
    for (const e of (events ?? []) as EventRecord[]) {
      const when = lagosDay(new Date(e.starts_at)) === lagosDay(now) ? "today" : "tomorrow";
      const { data: regs } = await getSupabase()
        .from("event_registrations")
        .select("name,email,reference,status")
        .eq("event_id", e.id)
        .in("status", ["confirmed", "pending_payment"]);
      const mails = ((regs ?? []) as (RegistrationRow & { status: string })[]).map((r) =>
        r.status === "confirmed" ? reminderEmail(e, r, when) : paymentReminderEmail(e, r, when),
      );
      const { sent } = await sendEmailBatchViaResend(mails);
      await getSupabase().from("events").update({ reminder_sent_at: new Date().toISOString() }).eq("id", e.id);
      console.log(`Event reminders: ${e.title}, ${sent}/${mails.length} sent`);
    }
  } catch (err) {
    console.error("Event reminders failed:", err);
  }

  try {
    // Get all unsent emails that are past their scheduled time
    const now = new Date().toISOString();
    const { data: scheduledEmails, error: fetchError } = await getSupabase()
      .from("scheduled_emails")
      .select("*")
      .eq("sent", false)
      .lte("scheduled_for", now)
      .limit(50); // Process max 50 at a time

    if (fetchError) {
      console.error("❌ Failed to fetch scheduled emails:", fetchError);
      return res.status(500).json({
        success: false,
        error: fetchError.message,
      });
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      console.log("✓ No scheduled emails to send");
      return res.status(200).json({
        success: true,
        sent: 0,
        message: "No pending emails",
      });
    }

    console.log(
      `📧 Found ${scheduledEmails.length} email(s) to send, processing...`
    );

    // Send each email and track results
    let sent = 0;
    let failed = 0;
    const results: Array<{ id: string; email: string; success: boolean }> = [];

    for (const scheduledEmail of scheduledEmails as ScheduledEmail[]) {
      try {
        const success = await sendEmailViaResend({
          to: scheduledEmail.email,
          subject: scheduledEmail.subject,
          html: scheduledEmail.html,
        });

        if (success) {
          // Mark as sent
          const { error: updateError } = await getSupabase()
            .from("scheduled_emails")
            .update({
              sent: true,
              sent_at: new Date().toISOString(),
            })
            .eq("id", scheduledEmail.id);

          if (updateError) {
            console.error(
              `⚠️  Sent but couldn't mark as sent: ${scheduledEmail.id}`,
              updateError
            );
          }

          sent++;
          results.push({ id: scheduledEmail.id, email: scheduledEmail.email, success: true });
          console.log(
            `✓ Sent ${scheduledEmail.email_type} to ${scheduledEmail.email}`
          );
        } else {
          failed++;
          results.push({ id: scheduledEmail.id, email: scheduledEmail.email, success: false });

          // Increment retry count
          const retryCount = (scheduledEmail.retry_count || 0) + 1;

          // If less than 3 retries, keep in queue; otherwise mark as failed
          if (retryCount < 3) {
            await getSupabase()
              .from("scheduled_emails")
              .update({
                retry_count: retryCount,
                updated_at: new Date().toISOString(),
              })
              .eq("id", scheduledEmail.id);

            console.log(
              `⚠️  Failed to send ${scheduledEmail.email_type} to ${scheduledEmail.email} (retry ${retryCount}/3)`
            );
          } else {
            // Mark as permanently failed after 3 retries
            await getSupabase()
              .from("scheduled_emails")
              .update({
                sent: true, // Mark as "processed" to stop retrying
                error_message: "Failed after 3 retry attempts",
                updated_at: new Date().toISOString(),
              })
              .eq("id", scheduledEmail.id);

            console.error(
              `❌ Permanently failed ${scheduledEmail.email_type} to ${scheduledEmail.email} after 3 retries`
            );
          }
        }
      } catch (err) {
        failed++;
        results.push({ id: scheduledEmail.id, email: scheduledEmail.email, success: false });
        console.error(
          `❌ Error sending ${scheduledEmail.email_type} to ${scheduledEmail.email}:`,
          err
        );
      }
    }

    console.log(
      `\n📊 Cron job complete: ${sent} sent, ${failed} failed/retrying`
    );

    return res.status(200).json({
      success: true,
      sent,
      failed,
      total: scheduledEmails.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Cron job error:", err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
