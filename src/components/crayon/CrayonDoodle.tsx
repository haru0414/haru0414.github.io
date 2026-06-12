import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PATHS: Record<string, string> = {
  star: "M50 10 L62 38 L92 40 L68 58 L77 88 L50 71 L23 88 L32 58 L8 40 L38 38 Z",
  swirl:
    "M52 50 C 60 44 66 52 60 58 C 52 66 38 60 38 48 C 38 32 58 24 72 34 C 88 46 84 72 62 80 C 38 88 14 70 16 46",
  sparkle: "M50 8 L50 92 M8 50 L92 50 M27 27 L40 40 M73 73 L60 60 M73 27 L60 40 M27 73 L40 60",
  zigzag: "M5 62 L20 40 L35 62 L50 40 L65 62 L80 40 L95 62",
  arrow: "M12 84 C 32 62 52 60 76 38 M58 34 L78 34 L76 56",
};

type DoodleType = keyof typeof PATHS;

interface CrayonDoodleProps {
  type: DoodleType;
  color?: string;
  className?: string;
  strokeWidth?: number;
  delay?: number;
}

// Small hand-drawn crayon doodle (star, swirl, sparkle...) that sketches
// itself in when scrolled into view, with a wobbly boil animation.
export default function CrayonDoodle({
  type,
  color = "var(--color-nekoma)",
  className = "",
  strokeWidth = 6,
  delay = 0,
}: CrayonDoodleProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [drawn, setDrawn] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <svg
      ref={ref}
      className={`crayon-boil pointer-events-none overflow-visible ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d={PATHS[type]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={drawn ? 0 : 1}
        style={{
          transition: reduced
            ? "none"
            : `stroke-dashoffset 800ms ease-out ${delay}ms`,
        }}
      />
    </svg>
  );
}
