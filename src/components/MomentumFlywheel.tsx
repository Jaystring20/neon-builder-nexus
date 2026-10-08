import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * The hero's argument, acted out: "Projects end. Momentum doesn't."
 *
 * Brand, Platforms and People start scattered and dim, like pieces bought
 * from separate vendors. AI at the centre engages each one in turn (a spoke of
 * light, then the piece snaps into its slot), the ring closes, and the whole
 * wheel starts turning. Its speed ramps up rather than jumping, which is the
 * point: momentum is something that builds.
 *
 * Everything moves through transforms driven by motion values, so nothing
 * re-renders per frame. The loop pauses off-screen, and reduced motion gets
 * the assembled wheel, still.
 */

const NODES = [
  { label: "Brand", slot: 0, scatter: 38 },
  { label: "Platforms", slot: 120, scatter: -52 },
  { label: "People", slot: 240, scatter: 64 },
] as const;

// Timeline (seconds). Each node engages after the previous one has landed.
const FIRST_ENGAGE = 0.7;
const ENGAGE_GAP = 0.55;
const RING_CLOSE = FIRST_ENGAGE + ENGAGE_GAP * NODES.length;
const SPIN_START = RING_CLOSE + 0.35;

// Cruising speed in degrees per second (one turn every 48s), and how quickly
// the wheel approaches it. A low rate makes the acceleration readable.
const CRUISE = 7.5;
const RAMP = 0.45;

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface NodeProps {
  label: string;
  slot: number;
  scatter: number;
  index: number;
  angle: MotionValue<number>;
  still: boolean;
}

const FlywheelNode = ({ label, slot, scatter, index, angle, still }: NodeProps) => {
  const engageAt = FIRST_ENGAGE + ENGAGE_GAP * index;

  // How far the piece sits from its slot. Animated to zero when AI engages it.
  const offset = useMotionValue(still ? 0 : scatter);
  const engaged = useMotionValue(still ? 1 : 0);

  useEffect(() => {
    if (still) return;
    const spring = animate(offset, 0, {
      type: "spring",
      stiffness: 140,
      damping: 16,
      delay: engageAt + 0.18,
    });
    const glow = animate(engaged, 1, { duration: 0.5, ease: EASE_OUT, delay: engageAt });
    return () => {
      spring.stop();
      glow.stop();
    };
  }, [still, engageAt, offset, engaged]);

  const armRotate = useTransform([angle, offset], ([a, o]: number[]) => a + slot + o);
  const counterRotate = useTransform(armRotate, (r) => -r);
  const opacity = useTransform(engaged, [0, 1], [0.38, 1]);
  const scale = useTransform(engaged, [0, 1], [0.88, 1]);
  const spokeScale = useTransform(engaged, [0, 0.6, 1], [0, 1, 1]);
  const dotOpacity = useTransform(engaged, [0, 1], [0.15, 1]);

  return (
    <motion.div className="absolute inset-0" style={{ rotate: armRotate }}>
      {/* Spoke from the AI core out to this piece. Drawn on engage. */}
      <motion.div
        className="absolute left-1/2 top-[13%] bottom-1/2 w-px origin-bottom"
        style={{
          x: "-50%",
          scaleY: spokeScale,
          background:
            "linear-gradient(to top, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.08))",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-[13%]"
        style={{ x: "-50%", y: "-50%", rotate: counterRotate }}
      >
        <motion.div
          className="flywheel-slab flex items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5"
          style={{ opacity, scale }}
        >
          <motion.span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            style={{ opacity: dotOpacity }}
          />
          <span className="whitespace-nowrap font-heading text-sm font-medium tracking-tight text-foreground sm:text-base">
            {label}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const MomentumFlywheel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { margin: "120px" });

  const angle = useMotionValue(0);
  const velocity = useRef(0);
  const startedAt = useRef<number | null>(null);

  // The wheel's own turn. Velocity eases toward cruise speed, so each turn is
  // a little faster than the last until it settles.
  useAnimationFrame((time, delta) => {
    if (reduce || !inView) return;
    if (startedAt.current === null) startedAt.current = time;
    const elapsed = (time - startedAt.current) / 1000;
    if (elapsed < SPIN_START) return;
    const dt = Math.min(delta, 64) / 1000;
    velocity.current += (CRUISE - velocity.current) * (1 - Math.exp(-RAMP * dt));
    angle.set(angle.get() + velocity.current * dt);
  });

  // The energy pulse on the ring travels three times faster than the wheel.
  const pulseRotate = useTransform(angle, (a) => a * 3 - 90);

  // Hover tilt. Springs keep it soft; leaving resets to the resting angle.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [16, 4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-14, 6]), { stiffness: 120, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const ringDraw = {
    initial: reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: reduce ? 0 : 1.1, ease: EASE_OUT, delay: reduce ? 0 : RING_CLOSE },
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Brand, Platforms and People turning together as one wheel, driven by AI at the centre"
      className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px]"
      style={{ perspective: 1200 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Floor shadow: the wheel floats above the plane rather than sitting on it. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[14%] bottom-[2%] h-[10%] rounded-[50%] bg-black/50 blur-2xl"
        />

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {/* Track the pieces sit on. */}
          <circle cx="50" cy="50" r="37" fill="none" stroke="hsl(var(--foreground) / 0.06)" strokeWidth="0.3" />
          {/* The ring that closes once all three are engaged. */}
          <motion.circle
            cx="50"
            cy="50"
            r="37"
            fill="none"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth="0.35"
            transform="rotate(-90 50 50)"
            {...ringDraw}
          />
        </svg>

        {/* Travelling energy on the ring. */}
        {!reduce && (
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            style={{ rotate: pulseRotate }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: SPIN_START }}
          >
            <defs>
              <linearGradient id="flywheel-pulse" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <path
              d="M 87 50 A 37 37 0 0 1 76.16 76.16"
              fill="none"
              stroke="url(#flywheel-pulse)"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </motion.svg>
        )}

        {NODES.map((node, i) => (
          <FlywheelNode key={node.label} {...node} index={i} angle={angle} still={reduce} />
        ))}

        {/* AI core: the force that sets everything else moving. */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
        >
          <div className="flywheel-core relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20">
            {!reduce && <span aria-hidden="true" className="flywheel-core-pulse" />}
            <span className="font-heading text-sm font-semibold tracking-wide text-primary-foreground sm:text-base">
              AI
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MomentumFlywheel;
