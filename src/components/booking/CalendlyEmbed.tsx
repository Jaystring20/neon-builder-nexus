import { useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Calendly's booking page inside ours, as a plain iframe (no third-party
 * script). The link already carries the prefill from src/lib/booking.ts, so
 * the visitor only picks a time. A direct link sits underneath for anyone
 * whose browser blocks the frame.
 */
const CalendlyEmbed = ({ url, title = "Pick a time" }: { url: string; title?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const src = (() => {
    const u = new URL(url);
    u.searchParams.set("embed_type", "Inline");
    u.searchParams.set("embed_domain", typeof window !== "undefined" ? window.location.host : "digitalcreativeshubltd.com");
    u.searchParams.set("hide_gdpr_banner", "1");
    return u.toString();
  })();

  return (
    <div>
      <div className="relative h-[720px] overflow-hidden border border-border/60 bg-white">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-card text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading the calendar
          </div>
        )}
        <iframe title={title} src={src} onLoad={() => setLoaded(true)} className="h-full w-full" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Calendar not showing?{" "}
        <a href={url} target="_blank" rel="noreferrer" className="font-medium text-primary hover:text-foreground">
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
};

export default CalendlyEmbed;
