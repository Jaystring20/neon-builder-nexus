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
import { supabase } from "../../src/lib/supabase.server";
import { sendEmailViaResend } from "../../src/lib/resend.v3";

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
  // Verify this is a cron request (optional but recommended)
  // Vercel automatically includes this header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized - cron job must be triggered by Vercel",
    });
  }

  console.log("🕐 Scheduled email cron job started");

  try {
    // Get all unsent emails that are past their scheduled time
    const now = new Date().toISOString();
    const { data: scheduledEmails, error: fetchError } = await supabase
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
          const { error: updateError } = await supabase
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
            await supabase
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
            await supabase
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
