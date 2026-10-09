import SEO from "@/components/SEO";
import FocusedShell from "@/components/layout/FocusedShell";
import DiscoveryFlow from "@/components/discovery/DiscoveryFlow";

// The flow itself is src/components/discovery/DiscoveryFlow.tsx.
export default function DiscoveryPage() {
  return (
    <FocusedShell>
      <SEO
        title="Discovery"
        description="Twelve questions, about four minutes: see what kind of business you're building, what's holding it back, and where to start."
        path="/discovery"
      />
      <DiscoveryFlow />
    </FocusedShell>
  );
}
