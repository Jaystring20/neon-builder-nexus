import { Twitter, Linkedin, Instagram, Youtube, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import dchLogo from "@/assets/dch-logo-primary.png";

const Footer = () => {
  const links = {
    company: [
      { label: "About Us", href: "/about", isRoute: true },
      { label: "Our Mission", href: "/about#mission", isRoute: true },
      { label: "Lead Architect", href: "/about#founder", isRoute: true },
      { label: "Careers", href: "/careers", isRoute: true },
    ],
    services: [
      { label: "All Services", href: "/services", isRoute: true },
      { label: "Growth Architecture", href: "/services", isRoute: true },
      { label: "Performance Engines", href: "/services", isRoute: true },
      { label: "Innovation Lab", href: "/services", isRoute: true },
    ],
    resources: [
      { label: "Builder's Blueprint", href: "#blueprint" },
      { label: "Blog", href: "/blog", isRoute: true },
      { label: "Case Studies", href: "/case-studies", isRoute: true },
      { label: "FAQ", href: "/faq", isRoute: true },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
      { label: "Terms of Service", href: "/terms-of-service", isRoute: true },
      { label: "Cookie Policy", href: "/cookie-policy", isRoute: true },
    ],
  };

  const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" aria-label="Digital Creatives Hub — Home" className="inline-flex items-center mb-4">
              <img
                src={dchLogo}
                alt="Digital Creatives Hub"
                className="h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Business Development Creative Agency. We build the systems that grow brands.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Digital Creatives Hub Ltd. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {/* Heart sits in the fine print, not in orange. Sentiment is not
                emphasis, and this glyph was competing with the one CTA a few
                hundred pixels above it. */}
            Built with <Heart className="w-4 h-4 text-muted-foreground" /> by Growth Architects
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
