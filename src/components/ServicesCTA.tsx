import StartCTA from "@/components/StartCTA";

/** Closing call to action shared by /services and each practice page. */
const ServicesCTA = ({ heading = "Not sure where to start?" }: { heading?: string }) => (
  <section className="py-24 md:py-32">
    <div className="container-narrow max-w-3xl">
      <h2 className="font-display-refined text-[2.4rem] leading-[1.05] text-foreground sm:text-5xl">{heading}</h2>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Most clients aren&rsquo;t. The Growth Diagnostic shows where you stand and which practices fit, in about four minutes.
      </p>
      <StartCTA className="mt-10" />
    </div>
  </section>
);

export default ServicesCTA;
