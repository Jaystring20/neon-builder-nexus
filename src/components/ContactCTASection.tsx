import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactCTASection = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-display-refined text-3xl md:text-4xl leading-tight text-foreground mb-6">
            Ready to Build?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Start with a conversation. We'll talk about the question hiding inside your brief. No pitch. Just listening.
          </p>
        </div>

        {/* CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Book a Call */}
          <a
            href="https://cal.com/dch"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Book a Call
                </h3>
                <p className="text-sm text-muted-foreground">
                  30-minute discovery conversation to understand your project.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                Let's talk
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Send Your Brief */}
          <a
            href="mailto:hello@dch.build?subject=Project%20Brief"
            className="group relative rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Send Your Brief
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Write down what you're building and what you're trying to prove.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                hello@dch.build
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Location info */}
        <div className="border-t border-border/30 pt-12 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Where We're Built
            </h3>
            <p className="text-sm text-muted-foreground">
              Lagos, Nigeria. New York, USA. Remote, everywhere.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              We work in distributed teams. Time zones aren't a constraint—they're a feature.
            </p>
          </div>
        </div>

        {/* Credibility footer */}
        <div className="mt-12 pt-12 border-t border-border/30 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-1.5">
              Projects shipped
            </dt>
            <dd className="text-lg font-semibold text-foreground">18+</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-1.5">
              Active users
            </dt>
            <dd className="text-lg font-semibold text-foreground">50K+</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-1.5">
              System uptime
            </dt>
            <dd className="text-lg font-semibold text-foreground">99.9%</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-1.5">
              Year founded
            </dt>
            <dd className="text-lg font-semibold text-foreground">2020</dd>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;
