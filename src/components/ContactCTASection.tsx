import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { storyImage } from "@/lib/storyImages";
import { BOOK_A_CALL } from "@/lib/contact";

// Copy: docs/landing-copy.md, section 8. Selective by design: the invitation
// is to bring a problem, not to "get in touch". Discovery is the softer exit.

const ContactCTASection = () => {
  const image = storyImage("cta-first-connection");

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden py-28 md:py-40">
      {/* The image sits to the right and fades into the page; a scrim keeps
          the copy on solid dark ground whatever the image does behind it. */}
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-80 md:w-[72%] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/10 md:via-background/70 md:to-transparent"
          />
        </>
      )}

      <div className="container-narrow relative z-10">
        <div className="max-w-2xl">
          <h2
            id="contact-heading"
            className="font-display-refined text-[2.5rem] leading-[1.02] text-foreground sm:text-6xl"
          >
            We don&rsquo;t take every brief.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            We take the right problems and solve them completely.{" "}
            <span className="text-foreground">Bring us yours.</span>
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
            <Button asChild variant="action" size="xl" className="group w-full sm:w-auto">
              <a href={BOOK_A_CALL}>
                Book a call
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Link
              to="/discovery"
              className="group inline-flex items-center justify-center gap-2 text-base text-foreground/75 transition-colors hover:text-foreground sm:justify-start"
            >
              Not ready to talk? <span className="font-semibold text-foreground">Take the discovery.</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;
