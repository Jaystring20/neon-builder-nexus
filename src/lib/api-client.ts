/**
 * API Client
 *
 * Client-side utilities for calling the discovery form API
 */

import { DiscoveryAnswers } from "../data/segmentLogic";

export interface DiscoverySubmission {
  answers: DiscoveryAnswers;
  email: string;
}

export interface DiscoveryResponse {
  success: boolean;
  message: string;
  segment?: string;
  program?: string;
  error?: string;
}

/**
 * Submit discovery form to backend
 */
export async function submitDiscoveryForm(
  submission: DiscoverySubmission
): Promise<DiscoveryResponse> {
  try {
    const response = await fetch("/api/discovery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit discovery form");
    }

    return await response.json();
  } catch (error) {
    console.error("Discovery submission error:", error);
    return {
      success: false,
      message: "Failed to submit discovery form",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get discovery result by email (for admin/reference)
 */
export async function getDiscoveryByEmail(email: string) {
  try {
    const response = await fetch(`/api/discovery?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch discovery result");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch discovery result:", error);
    return null;
  }
}
