import { useEffect, useRef, useState, type ReactNode } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface CrayonUnderlineProps {
  children: ReactNode;
  color?: string;
  /** underline = 波浪底線, circle = 蠟筆圈圈 */
  variant?: "underline" | "circle";
  /** view = 滾動進入視野時畫出, hover = 滑鼠移入時畫出 */
  trigger?: "view" | "hover";
  /** 外部控制 hover 狀態（覆寫內建 hover 偵測） */
  active?: boolean;
  delay?: number;
}

// Hand-drawn crayon stroke that draws itself in around/under the children.
export default function CrayonUnderline({
  children,
  color = "var(--color-nekoma)",
  variant = "underline",
  trigger = "view",
  active,
  delay = 0,
}: CrayonUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [drawn, setDrawn] = useState(reduced);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (trigger !== "view" || reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, reduced]);

  const isDrawn =
    reduced || (trigger === "view" ? drawn : (active ?? hovered));
  const selfHover = trigger === "hover" && active === undefined;
  const duration = variant === "circle" ? 900 : 600;

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={selfHover ? () => setHovered(true) : undefined}
      onMouseLeave={selfHover ? () => setHovered(false) : undefined}
    >
      {children}
      {variant === "underline" ? (
        <svg
          className="crayon-boil absolute pointer-events-none overflow-visible"
          style={{ left: "-2%", bottom: "-0.18em", width: "104%", height: "0.24em" }}
          viewBox="0 0 300 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M6 18 C 42 10, 76 24, 116 16 S 196 8, 230 18 S 282 14, 294 12"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={isDrawn ? 0 : 1}
            style={{
              transition: reduced
                ? "none"
                : `stroke-dashoffset ${duration}ms ease-out ${delay}ms`,
            }}
          />
        </svg>
      ) : (
        <svg
          className="crayon-boil absolute pointer-events-none overflow-visible"
          style={{ left: "-7%", top: "-12%", width: "114%", height: "124%" }}
          viewBox="0 0 320 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M160 12 C 64 10, 14 38, 16 70 C 18 106, 88 132, 168 128 C 250 124, 306 100, 304 66 C 302 32, 232 6, 150 12 C 102 16, 56 30, 42 50"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.85"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={isDrawn ? 0 : 1}
            style={{
              transition: reduced
                ? "none"
                : `stroke-dashoffset ${duration}ms ease-out ${delay}ms`,
            }}
          />
        </svg>
      )}
    </span>
  );
}
