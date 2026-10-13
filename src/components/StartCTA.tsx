import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BOOK_A_CALL, START_DIAGNOSTIC } from "@/lib/contact";

/**
 * The standard pair of calls to action: the free Growth Diagnostic first (the
 * front door), and Book a call for people who already know what they need.
 */
const StartCTA = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col items-stretch gap-5 sm:flex-row sm:items-center", className)}>
    <Button asChild variant="action" size="xl" className="group w-full sm:w-auto">
      <Link to={START_DIAGNOSTIC}>
        Take the free diagnostic
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
    <Link
      to={BOOK_A_CALL}
      className="group inline-flex items-center justify-center gap-2 text-base text-foreground/75 transition-colors hover:text-foreground sm:justify-start"
    >
      Know what you need? <span className="font-semibold text-foreground">Book a call.</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

export default StartCTA;
