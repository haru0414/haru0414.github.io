import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// 訂閱指標型態。用 useSyncExternalStore 而非「effect 內 setState」：
// 後者會多觸發一次渲染，也違反 React 的規則；這個寫法還順帶支援
// 裝置中途改變（例如接上滑鼠的平板）
const coarsePointer = {
  subscribe(onChange: () => void) {
    const mq = window.matchMedia("(pointer: coarse)");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  },
  get: () => window.matchMedia("(pointer: coarse)").matches,
  // SSR 期間沒有指標可問，維持與原本一致的桌機預設
  getServer: () => false,
};

// Custom Cursor Component - Using refs for smooth performance
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isDesktop = !useSyncExternalStore(
    coarsePointer.subscribe,
    coarsePointer.get,
    coarsePointer.getServer,
  );

  // 只有自訂游標真的掛載且裝置適用時，才讓 CSS 隱藏系統游標。
  // JS 尚未載入、元件發生錯誤或切到 /surf 時，都會安全退回原生游標。
  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-active", isDesktop);
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous animation frame for smooth updates
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          const size = isHovering ? 40 : 20;
          cursorRef.current.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`;
          cursorRef.current.style.opacity = "1";
        }
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDesktop, isHovering]);

  if (!isDesktop) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
      style={{
        width: isHovering ? 40 : 20,
        height: isHovering ? 40 : 20,
        backgroundColor: isHovering
          ? "var(--color-poster)"
          : "var(--color-nekoma)",
        borderColor: "var(--color-ink)",
        opacity: 0,
        willChange: "transform",
        transition: "width 0.15s, height 0.15s, background-color 0.15s",
        mixBlendMode: "difference",
      }}
    />
  );
}
