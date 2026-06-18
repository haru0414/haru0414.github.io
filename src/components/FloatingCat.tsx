import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";
import catCover from "../assets/images/onigiri/cover.webp";
import PetBowl from "./play/PetBowl";

// 浮動「常駐監工」多功能鈕：點飯糰貼紙展開選單，
// 收納主題切換（夜讀／日讀版）與回到頂部，避免與頂部導覽列重疊。
export default function FloatingCat() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // 初次 render 一律 light，與 prerender 快照一致（避免 hydration mismatch）；
  // mount 後再用 effect 校正成 <html> 上的實際主題
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

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

  // 中 / 英切換：changeLanguage 會先動態載入語系包再切換，
  // 並寫回 localStorage，所有用 t() 的元件自動重繪
  const toggleLang = () => {
    changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-2 right-5 z-60 flex flex-col items-end gap-3"
    >
      {/* 多功能選單面板 */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {/* disclosure 彈出面板：用一般按鈕群即可（無 role="menu"，因為沒有
           實作方向鍵導覽；原生 <button> 本身就無障礙），觸發鈕帶 aria-expanded */}
        <div
          aria-label={t("menu.role")}
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
              alt={t("a11y.cat")}
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
              <span className="text-[10px] text-white/70">
                {t("menu.role")} 🐾
              </span>
            </div>
          </div>

          {/* 功能列 */}
          <button
            type="button"
            onClick={toggleTheme}
            className="interactive w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-poster hover:text-(--color-panel)"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-base w-5 text-center">
              {isDark ? "☀︎" : "☾"}
            </span>
            {isDark ? t("menu.light") : t("menu.dark")}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="interactive w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left border-t-2 transition-colors hover:bg-poster hover:text-(--color-panel)"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: "var(--color-ink)",
            }}
          >
            <span className="text-base w-5 text-center">文</span>
            {t("menu.lang")}
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="interactive w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left border-t-2 transition-colors hover:bg-poster hover:text-(--color-panel)"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: "var(--color-ink)",
            }}
          >
            <span className="text-base w-5 text-center">↑</span>
            {t("menu.top")}
          </button>
        </div>
      </div>

      {/* 飼料碗觸發鈕：捲到頁面底部時，陪跑貓會走過來吃飼料 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("a11y.menuOpen")}
        aria-expanded={isOpen}
        className={`interactive w-11 transition-all duration-200 hover:-translate-y-1 ${
          isOpen ? "opacity-60" : "opacity-100"
        }`}
        style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
      >
        <PetBowl className="block h-auto w-full" />
      </button>
    </div>
  );
}
