/**
 * Discovery Page
 *
 * Main page for the founder discovery questionnaire.
 * Mounts the DiscoveryForm component and handles routing.
 *
 * Typography: Geist sans-serif (imported in layout.tsx / root layout)
 * Dark Mode: Supports prefers-color-scheme and manual toggle
 * Accessibility: Full WCAG AA compliance, reduced-motion honored
 */

/**
 * Discovery Page
 *
 * Main page for the founder discovery questionnaire (v3 - multi-segment).
 * Mounts the DiscoveryFormV3 component and handles routing.
 *
 * v3 Features:
 * - Segment-agnostic questions (works for all 5 segments equally)
 * - Real-time insights after each answer
 * - Verification follow-ups to catch contradictions
 * - "I'm not sure" discovery pathways
 * - No AI slop in copy
 *
 * Typography: Geist sans-serif (imported in layout.tsx / root layout)
 * Dark Mode: Supports prefers-color-scheme and manual toggle
 * Accessibility: Full WCAG AA compliance, reduced-motion honored
 */

import React from "react";
import { DiscoveryFormV3 } from "../components/DiscoveryForm.v3";

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <DiscoveryFormV3 />
    </div>
  );
}
