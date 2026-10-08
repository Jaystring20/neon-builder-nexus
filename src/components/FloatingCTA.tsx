import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.8;
      const contact = document.getElementById("contact");
      const inContactView = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.8
        : false;
      setVisible(scrolled && !inContactView);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Book a call"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground shadow-[0_14px_34px_-12px_hsl(var(--secondary)/0.7)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-secondary/90 sm:bottom-6 sm:right-6 sm:px-6 sm:py-3.5 sm:text-base",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      Book a call
      <ArrowRight className="h-4 w-4" />
    </button>
  );
};

export default FloatingCTA;
