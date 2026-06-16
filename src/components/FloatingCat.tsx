import { useEffect, useRef, useState } from "react";
import catCover from "../assets/images/onigiri/cover.webp";
import sticker1 from "../assets/images/onigiri/stickers/1.webp";

// 浮動「常駐監工」多功能鈕：點飯糰貼紙展開選單，
// 收納主題切換（夜讀／日讀版）與回到頂部，避免與頂部導覽列重疊。
export default function FloatingCat() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  // 開啟時：點面板外或按 Esc 都關閉
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage 不可用時忽略
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 right-6 z-60 flex flex-col items-end gap-2"
    >
      {/* 多功能選單面板 */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div
          role="menu"
          className="border-2 overflow-hidden w-52"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-ink)",
            boxShadow: "4px 4px 0 0 var(--color-ink)",
          }}
        >
          {/* 角色卡頭 */}
          <div className="relative">
            <img
              src={catCover}
              alt="飯糰"
              width={1658}
              height={1414}
              className="w-full h-24 object-cover object-bottom block"
            />
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center justify-between"
              style={{ backgroundColor: "var(--color-panel)" }}
            >
              <span
                className="text-xs text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ONIGIRI
              </span>
              <span className="text-[10px] text-white/70">常駐監工 🐾</span>
            </div>
          </div>

          {/* 功能列 */}
          <button
            type="button"
            role="menuitem"
            onClick={toggleTheme}
            className="interactive w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-poster hover:text-(--color-panel)"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-base w-5 text-center">
              {isDark ? "☀︎" : "☾"}
            </span>
            {isDark ? "日讀版" : "夜讀版"}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={scrollToTop}
            className="interactive w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left border-t-2 transition-colors hover:bg-poster hover:text-(--color-panel)"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: "var(--color-ink)",
            }}
          >
            <span className="text-base w-5 text-center">↑</span>
            回到頂部
          </button>
        </div>
      </div>

      {/* 飯糰貼紙觸發鈕 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="開啟監工選單"
        aria-expanded={isOpen}
        className={`interactive w-16 transition-all duration-200 hover:-translate-y-1 ${
          isOpen ? "opacity-60" : "opacity-100"
        }`}
        style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
      >
        <img
          src={sticker1}
          alt="飯糰貼紙"
          width={960}
          height={870}
          className="w-full h-auto"
        />
      </button>
    </div>
  );
}
