import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import dchLogo from "@/assets/dch-logo.jpg";
import { cn } from "@/lib/utils";
import React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; to?: string }
>(({ className, title, children, to, ...props }, ref) => {
  const content = (
    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground">
      <div className="text-sm font-semibold leading-none text-foreground">{title}</div>
      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">
        {children}
      </p>
    </div>
  );

  if (to) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link ref={ref as any} to={to} className={cn(className)}>
            {content}
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }

  return (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={cn(className)} {...props}>
          {content}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  }, [location.pathname]);

  const serviceItems = [
    { title: "Strategic Consulting", description: "Digital transformation roadmaps and AI integration strategies", href: "/services" },
    { title: "Professional Training", description: "Future-ready skills development and no-code mastery", href: "/services" },
    { title: "Innovation Lab", description: "Sprint-based workshops, prototyping, and go-to-market guidance", href: "/services" },
    { title: "Digital Solutions", description: "End-to-end web, mobile, and AI-powered product development", href: "/services" },
  ];

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
              <img
                src={dchLogo}
                alt="Digital Creatives Hub"
                className="w-full h-full object-cover"
              />
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
                {/* What We Do - Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary text-sm uppercase tracking-wider font-medium">
                    What We Do
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-1 p-4">
                      {serviceItems.map((item) => (
                        <ListItem key={item.title} title={item.title} to={item.href}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Our Work - Direct Link */}
                <NavigationMenuItem>
                  <Link
                    to={isHomePage ? "#lab" : "/#lab"}
                    className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Our Work
                  </Link>
                </NavigationMenuItem>

                {/* Who We Are - Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary text-sm uppercase tracking-wider font-medium">
                    Who We Are
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[380px] gap-1 p-4">
                      {whoWeAreItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.href.startsWith("#") || item.href.startsWith("/#") ? undefined : item.href}
                          href={item.href.startsWith("#") || item.href.startsWith("/#") ? item.href : undefined}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Contact - Direct Link */}
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

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="hero" size="sm">
              Book a Call
            </Button>
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
            <div className="container-narrow py-6 space-y-1">
              {/* What We Do - Mobile Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileDropdown(mobileDropdown === "services" ? null : "services")}
                >
                  What We Do
                  <ChevronDown className={cn("w-4 h-4 transition-transform", mobileDropdown === "services" && "rotate-180")} />
                </button>
                {mobileDropdown === "services" && (
                  <div className="pl-4 pb-2 space-y-1 animate-fade-in">
                    {serviceItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
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

              {/* Who We Are - Mobile Dropdown */}
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
                    {whoWeAreItems.map((item) => (
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
                    ))}
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
                <Button variant="hero" className="w-full">
                  Book a Call
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
