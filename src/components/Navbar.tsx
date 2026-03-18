import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import dchLogo from "@/assets/dch-logo.jpg";
import { cn } from "@/lib/utils";
import { serviceCategories } from "@/data/services";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  }, [location.pathname]);

  const whoWeAreItems = [
    { title: "About Us", description: "Our mission, vision, and the story behind Digital Creatives Hub", href: "/about" },
    { title: "Our Strategist", description: "Meet Jerry — the mind driving our digital transformation strategy", href: isHomePage ? "#strategist" : "/#strategist" },
    { title: "Digital Creatives Network", description: "A global community of builders, creators, and innovators", href: "/dcn" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container-narrow">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden animate-glow">
              <img src={dchLogo} alt="Digital Creatives Hub" className="w-full h-full object-cover" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:block">
              <span className="text-primary font-semibold">Digital</span>{" "}
              <span className="text-secondary font-semibold">Creatives</span>{" "}
              <span className="text-foreground">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* What We Do — Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary text-sm uppercase tracking-wider font-medium">
                    What We Do
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[780px] p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {serviceCategories.map((cat) => {
                          const colorClass = cat.color === "primary" ? "text-primary" : "text-secondary";
                          const borderColor = cat.color === "primary" ? "border-primary/30" : "border-secondary/30";
                          const bgColor = cat.color === "primary" ? "bg-primary/5" : "bg-secondary/5";

                          return (
                            <div key={cat.slug} className="space-y-3">
                              <Link
                                to={`/services/${cat.slug}`}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${borderColor} ${bgColor} ${colorClass} text-xs font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity`}
                              >
                                {cat.title}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                              <ul className="space-y-1.5 pl-1">
                                {cat.subServices.map((sub) => (
                                  <li key={sub.title}>
                                    <Link
                                      to={`/services/${cat.slug}`}
                                      className="flex items-start gap-2.5 rounded-md p-2 hover:bg-muted/50 transition-colors group"
                                    >
                                      <sub.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                      <div>
                                        <div className="text-sm font-medium text-foreground leading-tight">{sub.title}</div>
                                        <div className="text-xs text-muted-foreground leading-snug mt-0.5">{sub.description}</div>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">See all services and how they connect.</p>
                        <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                          View All Services <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Our Work */}
                <NavigationMenuItem>
                  <Link
                    to="/our-work"
                    className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Our Work
                  </Link>
                </NavigationMenuItem>

                {/* Who We Are — Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary text-sm uppercase tracking-wider font-medium">
                    Who We Are
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[380px] gap-1 p-4">
                      {whoWeAreItems.map((item) => {
                        const isHash = item.href.startsWith("#") || item.href.startsWith("/#");
                        const content = (
                          <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground">
                            <div className="text-sm font-semibold leading-none text-foreground">{item.title}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">{item.description}</p>
                          </div>
                        );
                        return (
                          <li key={item.title}>
                            {isHash ? (
                              <a href={item.href}>{content}</a>
                            ) : (
                              <Link to={item.href}>{content}</Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <a
                    href={isHomePage ? "#contact" : "/#contact"}
                    className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Contact
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="hero" size="sm">Book a Call</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="container-narrow py-6 space-y-1">
              {/* What We Do */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileDropdown(mobileDropdown === "services" ? null : "services")}
                >
                  What We Do
                  <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDropdown === "services" && "rotate-180")} />
                </button>
                {mobileDropdown === "services" && (
                  <div className="pl-4 pb-2 space-y-3 animate-fade-in">
                    {serviceCategories.map((cat) => {
                      const colorClass = cat.color === "primary" ? "text-primary" : "text-secondary";
                      return (
                        <div key={cat.slug}>
                          <Link
                            to={`/services/${cat.slug}`}
                            className={`block text-sm font-semibold ${colorClass} mb-1`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {cat.title} →
                          </Link>
                          {cat.subServices.map((sub) => (
                            <Link
                              key={sub.title}
                              to={`/services/${cat.slug}`}
                              className="block py-1 text-xs text-muted-foreground hover:text-primary transition-colors pl-2"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                    <Link
                      to="/services"
                      className="block text-xs text-primary font-semibold pt-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View All Services →
                    </Link>
                  </div>
                )}
              </div>

              {/* Our Work */}
              <a
                href={isHomePage ? "#lab" : "/#lab"}
                className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Work
              </a>

              {/* Who We Are */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileDropdown(mobileDropdown === "who" ? null : "who")}
                >
                  Who We Are
                  <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDropdown === "who" && "rotate-180")} />
                </button>
                {mobileDropdown === "who" && (
                  <div className="pl-4 pb-2 space-y-1 animate-fade-in">
                    {whoWeAreItems.map((item) =>
                      item.href.startsWith("#") || item.href.startsWith("/#") ? (
                        <a
                          key={item.title}
                          href={item.href}
                          className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Contact */}
              <a
                href={isHomePage ? "#contact" : "/#contact"}
                className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>

              <div className="pt-4">
                <Button variant="hero" className="w-full">Book a Call</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
