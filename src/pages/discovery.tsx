import SEO from "@/components/SEO";
import FocusedShell from "@/components/layout/FocusedShell";
import DiscoveryFlow from "@/components/discovery/DiscoveryFlow";

// The flow itself is src/components/discovery/DiscoveryFlow.tsx.
export default function DiscoveryPage() {
  return (
    <FocusedShell>
      <SEO
        title="Growth Diagnostic"
        description="A free four-minute diagnostic: see where your business really stands, what's holding it back, and the right first move, before you talk to anyone."
        path="/diagnostic"
      />
      <DiscoveryFlow />
    </FocusedShell>
  );
}
