import { ArrowRight, Mail, MapPin } from "lucide-react";

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

        {/* One route in, not two. A booking card used to sit beside this
            pointing at a scheduling link the studio doesn't use — a single
            real path beats a real one next to a dead one. */}
        <div className="mb-16 max-w-xl">
          {/* Send Your Brief */}
          <a
            href="mailto:hello@digitalcreativeshub.com?subject=Project%20Brief"
            className="group relative rounded-none border border-border/40 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/30 hover:bg-card/50 transition-all motion-snap"
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
                hello@digitalcreativeshub.com
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
              Headquartered in Lagos, Nigeria. Operating globally.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              We work in distributed teams. Time zones aren't a constraint—they're a feature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTASection;
