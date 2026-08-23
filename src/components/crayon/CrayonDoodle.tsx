const PATHS: Record<string, string> = {
  star: "M50 10 L62 38 L92 40 L68 58 L77 88 L50 71 L23 88 L32 58 L8 40 L38 38 Z",
  swirl:
    "M52 50 C 60 44 66 52 60 58 C 52 66 38 60 38 48 C 38 32 58 24 72 34 C 88 46 84 72 62 80 C 38 88 14 70 16 46",
  sparkle:
    "M50 8 L50 92 M8 50 L92 50 M27 27 L40 40 M73 73 L60 60 M73 27 L60 40 M27 73 L40 60",
  zigzag: "M5 62 L20 40 L35 62 L50 40 L65 62 L80 40 L95 62",
  arrow: "M12 84 C 32 62 52 60 76 38 M58 34 L78 34 L76 56",
  // 三個由小到大往右上飄的 Z：睡著的提示，給 500 頁用
  zzz: "M12 74 L30 74 L12 92 L30 92 M38 42 L62 42 L38 66 L62 66 M70 6 L96 6 L70 32 L96 32",
  // 手畫的一撇：麵包屑分隔用。刻意畫得不直，才有蠟筆的手感
  slash: "M68 12 C 60 34 52 52 44 70 C 40 79 36 85 32 90",
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
// itself in on load via a pure-CSS draw animation (DOM 穩定，可安全 hydrate)。
export default function CrayonDoodle({
  type,
  color = "var(--color-nekoma)",
  className = "",
  strokeWidth = 6,
  delay = 0,
}: CrayonDoodleProps) {
  return (
    <svg
      className={`crayon-boil pointer-events-none overflow-visible ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        className="draw-stroke"
        d={PATHS[type]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        style={{ animationDuration: "800ms", animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}
