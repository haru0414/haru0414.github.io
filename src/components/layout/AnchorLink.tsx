import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  /** 形如 /#next 的路徑，井號後面是目標區塊的 id；沒有井號時等同一般連結 */
  to: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  // 帶連字號的 JSX 屬性 TypeScript 不會檢查，漏掉不會編譯錯、只會靜靜被丟掉，
  // 所以這裡明確宣告並轉發出去
  "aria-label"?: string;
  "aria-current"?: "page" | "true" | undefined;
};

/**
 * 指向某一頁某個區塊的連結。
 *
 * 換頁的情況交給 App 的 ScrollToTop（它監聽 location 變化）。但同一頁再點
 * 一次時網址不會變，location 也就不更新，只靠監聽的話第二次點就毫無反應
 * ——所以同頁直接在事件裡捲。
 */
export default function AnchorLink({
  to,
  children,
  className,
  style,
  onClick,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: Props) {
  const { pathname } = useLocation();
  const [rawPath, id] = to.split("#");
  const target = rawPath.replace(/\/+$/, "") || "/";
  const current = pathname.replace(/\/+$/, "") || "/";

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (!id || current !== target) return;
    const el = document.getElementById(id);
    if (!el) return;
    // 同頁捲動用 smooth，與右側區塊點列的行為一致
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Link
      to={to}
      onClick={handle}
      className={className}
      style={style}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  );
}
