import StartCTA from "@/components/StartCTA";
import { storyImage } from "@/lib/storyImages";

// Copy: docs/landing-copy.md, section 8. Selective by design: the invitation
// is to bring a problem, not to "get in touch". The diagnostic leads; Book a
// call is for people who already know what they need.

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

          <StartCTA className="mt-10" />
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;
