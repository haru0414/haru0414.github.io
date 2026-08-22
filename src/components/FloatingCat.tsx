import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";
import catCover from "../assets/images/onigiri/cover.webp";
import PetBowl from "./play/PetBowl";
import { ArrowUp, Moon, PawPrint, Sun } from "lucide-react";

// 浮動「常駐監工」多功能鈕：點飯糰貼紙展開選單，
// 收納主題切換（夜讀／日讀版）與回到頂部，避免與頂部導覽列重疊。
/**
 * 主題狀態直接訂閱 <html> 的 class，而不是另外存一份 state 再用 effect 校正。
 * 那種寫法會多觸發一次渲染，也違反「不要在 effect 裡同步 setState」的規則。
 */
const htmlTheme = {
  subscribe(onChange: () => void) {
    const ob = new MutationObserver(onChange);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => ob.disconnect();
  },
  get: (): "light" | "dark" =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  getServer: (): "light" | "dark" => "light",
};

export default function FloatingCat() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // 主題的真實來源是 <html> 上的 class，直接訂閱它而不另外存一份 state。
  // getServerSnapshot 回 light，與 prerender 快照一致（避免 hydration mismatch）
  const theme = useSyncExternalStore(htmlTheme.subscribe, htmlTheme.get, htmlTheme.getServer);
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
    // 只改 class，訂閱者會自動收到通知，不必再同步一份 state
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
      // 容器本身不攔點擊：它會撐到選單面板寬（w-52），在手機上是一大片透明區，
      // 否則會蓋住底下的陪跑貓且點了沒反應。只有實際互動子元素開回 pointer-events。
      className="pointer-events-none fixed bottom-2 right-5 z-60 flex flex-col items-end gap-3"
    >
      {/* 多功能選單面板 */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
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
                {t("menu.role")}
                <PawPrint size={13} className="ml-1 inline-block align-[-1px]" aria-hidden="true" />
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
              {isDark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
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
            <span className="flex w-5 justify-center"><ArrowUp size={14} aria-hidden="true" /></span>
            {t("menu.top")}
          </button>

        </div>
      </div>

      {/* 飼料碗觸發鈕：捲到頁面底部時，陪跑貓會走過來吃飼料 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("a11y.menuOpen")}
        aria-expanded={isOpen}
        className={`interactive pointer-events-auto w-11 transition-all duration-200 hover:-translate-y-1 ${
          isOpen ? "opacity-60" : "opacity-100"
        }`}
        style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
      >
        <PetBowl className="block h-auto w-full" />
      </button>
    </div>
  );
}
