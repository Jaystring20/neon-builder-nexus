import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "square" | "triangle" | "ring";
  color: "primary" | "secondary";
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

const FloatingParticles = ({ count = 15, className = "" }: FloatingParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const shapes: Particle["shape"][] = ["circle", "square", "triangle", "ring"];
    // Cyan only. Randomly colouring half the field orange spent the emphasis
    // accent on background decoration — the one place it can carry no meaning
    // at all, since a drifting particle is not pointing at anything.
    const colors: Particle["color"][] = ["primary"];

    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 8,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * -30,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.3 + 0.1,
    }));
    
    setParticles(generated);
  }, [count]);

  const renderShape = (particle: Particle) => {
    const colorClass = particle.color === "primary" 
      ? "text-primary" 
      : "text-secondary";

    switch (particle.shape) {
      case "circle":
        return (
          <div
            className={`rounded-full bg-current ${colorClass}`}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        );
      case "square":
        return (
          <div
            className={`bg-current ${colorClass}`}
            style={{
              width: particle.size,
              height: particle.size,
              transform: `rotate(${Math.random() * 45}deg)`,
            }}
          />
        );
      case "triangle":
        return (
          <div
            className={colorClass}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid currentColor`,
            }}
          />
        );
      case "ring":
        return (
          <div
            className={`rounded-full border-2 border-current ${colorClass}`}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float-drift"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {renderShape(particle)}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;
