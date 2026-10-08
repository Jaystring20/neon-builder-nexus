import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOK_A_CALL } from "@/lib/contact";

/** Closing call to action shared by /services and each practice page. */
const ServicesCTA = ({ heading = "Not sure where to start?" }: { heading?: string }) => (
  <section className="py-24 md:py-32">
    <div className="container-narrow max-w-3xl">
      <h2 className="font-display-refined text-[2.4rem] leading-[1.05] text-foreground sm:text-5xl">{heading}</h2>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Most clients aren&rsquo;t. Tell us what you&rsquo;re trying to move and we&rsquo;ll find the right first step.
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
          className="group inline-flex items-center justify-center gap-2 text-base text-foreground/75 hover:text-foreground sm:justify-start"
        >
          Not ready to talk? <span className="font-semibold text-foreground">Take the discovery.</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);

export default ServicesCTA;
