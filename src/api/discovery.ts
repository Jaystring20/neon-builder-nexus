/**
 * Discovery Form API Handler
 *
 * Serverless function to handle discovery form submission.
 * Integrates: Segment calculation → Supabase storage → Resend emails → Schedule follow-ups
 *
 * Deploy to:
 * - Vercel: /api/discovery.ts
 * - Netlify: /functions/discovery.ts
 * - Or run locally with: npm run dev (Vite will proxy to this)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { DiscoveryAnswers, calculateSegment } from "../data/segmentLogic";
import { saveDiscoveryResult } from "../lib/supabase";
import {
  generateEmail1,
  generateEmail2,
  generateEmail3,
  sendEmailViaResend,
} from "../lib/resend";
import { getProgramBySegment } from "../data/programDefinitions";

// ============================================================
// TYPES
// ============================================================

interface DiscoveryRequest {
  answers: DiscoveryAnswers;
  email: string;
}

interface DiscoveryResponse {
  success: boolean;
  message: string;
  segment?: string;
  program?: string;
  error?: string;
}

// ============================================================
// HANDLER
// ============================================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiscoveryResponse>
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      error: "Only POST requests are accepted",
    });
  }

  try {
    const { answers, email } = req.body as DiscoveryRequest;

    // Validation
    if (!answers || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "answers and email are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
        error: "Please provide a valid email address",
      });
    }

    // Calculate segment
    const segment = calculateSegment(answers);
    const program = getProgramBySegment(segment.segment);

    // Extract founder name from email or use generic greeting
    const founderName = email.split("@")[0];

    // Save to Supabase
    const saved = await saveDiscoveryResult(
      email,
      segment.segment,
      segment.program,
      answers,
      segment.capabilityGap
    );

    if (!saved) {
      console.error("Failed to save to Supabase");
      // Continue anyway—emails are more important than storage
    }

    // Prepare email context (personalization data)
    const emailContext = {
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

    // Send Email 1 (immediate)
    const email1Payload = generateEmail1(founderName, email, segment, program, emailContext);
    const email1Sent = await sendEmailViaResend(email1Payload);

    if (!email1Sent) {
      console.error("Failed to send Email 1");
      return res.status(500).json({
        success: false,
        message: "Failed to send confirmation email",
        error: "Please try again or contact support",
      });
    }

    // Schedule Email 2 (1 day later) and Email 3 (3 days later)
    // This is handled by:
    // Option A: Serverless scheduled functions (Vercel Cron, Netlify Scheduled Functions)
    // Option B: External service (e.g., Inngest, Trigger.dev)
    // Option C: Delayed queue (e.g., Bull, Bee-Queue with Redis)
    // For now, we'll schedule via environment-specific setup

    try {
      await scheduleFollowupEmails(email, segment, program, founderName);
    } catch (err) {
      console.error("Failed to schedule follow-up emails:", err);
      // Don't fail the response—Email 1 was sent successfully
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Discovery submitted successfully. Check your email!",
      segment: segment.segment,
      program: segment.program,
    });
  } catch (error) {
    console.error("Discovery handler error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ============================================================
// HELPER: Schedule Follow-up Emails
// ============================================================

/**
 * Schedule Email 2 and Email 3 to be sent at specific times
 *
 * Three approaches:
 * 1. Vercel Cron + Database: Store scheduled emails in DB, query with cron job
 * 2. Third-party: Inngest, Trigger.dev (recommended for simplicity)
 * 3. Queue: Bull, RabbitMQ with delayed delivery
 *
 * For MVP, we use simple database + scheduled functions approach
 */
async function scheduleFollowupEmails(
  email: string,
  segment: any,
  program: any,
  founderName: string
) {
  // Option 1: Using Supabase scheduled functions (if available)
  // This assumes you have a scheduled task runner configured

  // For now, we'll use a simple approach:
  // Store the scheduled email record in Supabase, then use a cron job to send

  const now = new Date();
  const email2ScheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
  const email3ScheduledTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

  // Prepare email context for consistency across all emails
  const emailContext = {
    vision: (segment as any).answers?.q2_vision,
    values: (segment as any).answers?.q3_values,
    challenge: (segment as any).answers?.q9_challenge,
    priority: (segment as any).answers?.q10_priority,
    revenueModel: (segment as any).answers?.q7_revenue,
    scale: (segment as any).answers?.q6_scale,
  };

  // Generate email payloads
  const email2Payload = generateEmail2(founderName, email, segment, program, emailContext);
  const email3Payload = generateEmail3(founderName, email, segment, program, emailContext);

  // Store in database for later processing
  // (Assumes you have a scheduled_emails table in Supabase)
  try {
    const { supabase } = await import("../lib/supabase");

    await supabase.from("scheduled_emails").insert([
      {
        email,
        email_type: "email_2",
        subject: email2Payload.subject,
        html: email2Payload.html,
        scheduled_for: email2ScheduledTime.toISOString(),
        sent: false,
        created_at: now.toISOString(),
      },
      {
        email,
        email_type: "email_3",
        subject: email3Payload.subject,
        html: email3Payload.html,
        scheduled_for: email3ScheduledTime.toISOString(),
        sent: false,
        created_at: now.toISOString(),
      },
    ]);
  } catch (err) {
    console.error("Failed to schedule follow-up emails in DB:", err);

    // Alternative: Use Inngest or Trigger.dev if configured
    // Example with Inngest:
    // await inngest.send({
    //   name: "email.send.followup",
    //   data: { email, segment, program, founderName, emailType: "email_2" },
    //   delay: "1d",
    // });
  }
}

// ============================================================
// OPTIONAL: Scheduled Task Handler for Sending Queued Emails
// ============================================================

/**
 * This should be called by a cron job every hour
 * Deploy as: /api/cron/send-scheduled-emails.ts (Vercel)
 * or /functions/send-scheduled-emails.ts (Netlify)
 *
 * Example Vercel cron config in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-scheduled-emails",
 *     "schedule": "0 * * * *"  // Every hour
 *   }]
 * }
 */
export async function sendScheduledEmails() {
  try {
    const { supabase } = await import("../lib/supabase");
    const { sendEmailViaResend } = await import("../lib/resend");

    // Get all unsent emails that are past their scheduled time
    const now = new Date().toISOString();
    const { data: scheduledEmails, error } = await supabase
      .from("scheduled_emails")
      .select("*")
      .eq("sent", false)
      .lte("scheduled_for", now);

    if (error) {
      console.error("Failed to fetch scheduled emails:", error);
      return { success: false, error: error.message };
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      console.log("No scheduled emails to send");
      return { success: true, sent: 0 };
    }

    // Send each email and mark as sent
    let sent = 0;
    for (const scheduledEmail of scheduledEmails) {
      const success = await sendEmailViaResend({
        to: scheduledEmail.email,
        subject: scheduledEmail.subject,
        html: scheduledEmail.html,
      });

      if (success) {
        await supabase
          .from("scheduled_emails")
          .update({ sent: true, sent_at: new Date().toISOString() })
          .eq("id", scheduledEmail.id);
        sent++;
      } else {
        console.error(
          `Failed to send ${scheduledEmail.email_type} to ${scheduledEmail.email}`
        );
      }
    }

    return { success: true, sent };
  } catch (err) {
    console.error("Scheduled email handler error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
