import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import dchLogo from "@/assets/dch-logo-primary.png";

/**
 * A page with only the logo and a way out, for flows that should hold
 * attention: the discovery and Book a call.
 */
const FocusedShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen bg-background">
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
    <main className="container-narrow relative z-10 pb-24 pt-10 md:pt-16">{children}</main>
  </div>
);

export default FocusedShell;
