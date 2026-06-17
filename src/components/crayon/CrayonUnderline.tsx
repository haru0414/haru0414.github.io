import { useState, type CSSProperties, type ReactNode } from "react";

interface CrayonUnderlineProps {
  children: ReactNode;
  color?: string;
  /** underline = 波浪底線, circle = 蠟筆圈圈 */
  variant?: "underline" | "circle";
  /** view = 載入時描繪出（純 CSS）, hover = 滑鼠移入時畫出（JS） */
  trigger?: "view" | "hover";
  /** 外部控制 hover 狀態（覆寫內建 hover 偵測） */
  active?: boolean;
  delay?: number;
}

// Hand-drawn crayon stroke that draws itself in around/under the children.
// view 觸發用純 CSS 動畫（DOM 穩定、可安全 hydrate）；hover 觸發維持 JS。
export default function CrayonUnderline({
  children,
  color = "var(--color-nekoma)",
  variant = "underline",
  trigger = "view",
  active,
  delay = 0,
}: CrayonUnderlineProps) {
  const [hovered, setHovered] = useState(false);

  const viewMode = trigger === "view";
  const selfHover = trigger === "hover" && active === undefined;
  const hoverDrawn = active ?? hovered;
  const duration = variant === "circle" ? 900 : 600;

  // view：交給 CSS draw-stroke（初始未畫、載入後描繪）；DOM 不含會變動的狀態。
  // hover：用 JS 控制 stroke-dashoffset（初次一律未畫，快照/client 一致）。
  const pathClass = viewMode ? "draw-stroke" : undefined;
  const pathStyle: CSSProperties = viewMode
    ? { animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }
    : { transition: `stroke-dashoffset ${duration}ms ease-out ${delay}ms` };
  const pathOffset = viewMode ? undefined : hoverDrawn ? 0 : 1;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={selfHover ? () => setHovered(true) : undefined}
      onMouseLeave={selfHover ? () => setHovered(false) : undefined}
    >
      {children}
      {variant === "underline" ? (
        <svg
          className="crayon-boil absolute pointer-events-none overflow-visible"
          style={{
            left: "-2%",
            bottom: "-0.18em",
            width: "104%",
            height: "0.24em",
          }}
          viewBox="0 0 300 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={pathClass}
            d="M6 18 C 42 10, 76 24, 116 16 S 196 8, 230 18 S 282 14, 294 12"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={pathOffset}
            style={pathStyle}
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
            className={pathClass}
            d="M160 12 C 64 10, 14 38, 16 70 C 18 106, 88 132, 168 128 C 250 124, 306 100, 304 66 C 302 32, 232 6, 150 12 C 102 16, 56 30, 42 50"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.85"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={pathOffset}
            style={pathStyle}
          />
        </svg>
      )}
    </span>
  );
}
