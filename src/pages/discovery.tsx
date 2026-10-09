import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import DiscoveryFlow from "@/components/discovery/DiscoveryFlow";
import dchLogo from "@/assets/dch-logo-primary.png";

// A focused page: the logo and a way out, nothing else competing with the
// questions. The flow itself is src/components/discovery/DiscoveryFlow.tsx.
export default function DiscoveryPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <SEO
        title="Discovery"
        description="Twelve questions, about four minutes: see what kind of business you're building, what's holding it back, and where to start."
        path="/discovery"
      />
      <div className="blueprint-grid" />
      <header className="container-narrow relative z-10 flex items-center justify-between py-6">
        <Link to="/" aria-label="Digital Creatives Hub home">
          <img
            src={dchLogo}
            alt="Digital Creatives Hub"
            className="h-10 w-auto"
            style={{ filter: "hue-rotate(-2deg) saturate(0.58)" }}
          />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </header>
      <main className="container-narrow relative z-10 pb-24 pt-10 md:pt-16">
        <DiscoveryFlow />
      </main>
    </div>
  );
}
