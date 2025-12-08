import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-up" 
  | "fade-in" 
  | "blur-in" 
  | "scale-in" 
  | "slide-left" 
  | "slide-right";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationClasses: Record<AnimationType, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-10",
    visible: "opacity-100 translate-y-0",
  },
  "fade-in": {
    initial: "opacity-0",
    visible: "opacity-100",
  },
  "blur-in": {
    initial: "opacity-0 blur-lg scale-95",
    visible: "opacity-100 blur-0 scale-100",
  },
  "scale-in": {
    initial: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  "slide-left": {
    initial: "opacity-0 -translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
  "slide-right": {
    initial: "opacity-0 translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
};

const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const { initial, visible } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
