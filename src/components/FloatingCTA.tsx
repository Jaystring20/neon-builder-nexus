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
      aria-label="Start the Build — open Project Builder"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_hsl(var(--primary)/0.7)] sm:bottom-6 sm:right-6 sm:px-6 sm:py-3.5 sm:text-base",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      Start the Build
      <ArrowRight className="h-4 w-4" />
    </button>
  );
};

export default FloatingCTA;
