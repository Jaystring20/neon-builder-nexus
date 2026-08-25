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

import React from "react";
import { DiscoveryForm } from "../components/DiscoveryForm";

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <DiscoveryForm />
    </div>
  );
}
