import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// id 對應首頁的區塊、navKey 對應 i18n 字典裡 nav.* 的鍵
const sections = [
  { id: "start", navKey: "intro" },
  { id: "character", navKey: "about" },
  { id: "episodes", navKey: "projects" },
  { id: "career", navKey: "career" },
  { id: "next", navKey: "contact" },
];

/**
 * 首頁的區塊指示器。原本是頂端那顆浮動膠囊，站台頁首出現後就與它重疊了，
 * 所以改成桌機右側的直向點列：不佔版面高度，仍看得出目前在哪一段。
 *
 * 只在首頁渲染——這些 id 在其他頁面不存在。
 */
export default function HomeSectionRail() {
  const { t } = useTranslation();
  const [active, setActive] = useState("start");

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && line >= el.offsetTop && line < el.offsetTop + el.offsetHeight) {
          setActive(section.id);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string, attempt = 0) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (attempt < 20) {
      // 折線下方的區塊是懶載入的，剛進站時可能還不在 DOM；短暫重試
      window.setTimeout(() => scrollTo(id, attempt + 1), 50);
    }
  };

  return (
    <nav
      aria-label={t("a11y.mainNav")}
      className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            aria-label={t(`nav.${section.navKey}`)}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center justify-center"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <span
              className="block h-3 w-3 rounded-full border-2 transition-transform duration-200"
              style={{
                borderColor: "var(--color-ink)",
                backgroundColor: isActive ? "var(--color-nekoma)" : "var(--color-bg)",
                transform: isActive ? "scale(1.25)" : "scale(1)",
              }}
            />
            <span
              className="pointer-events-none absolute right-7 whitespace-nowrap px-2 py-1 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-panel)",
                color: "var(--color-on-panel)",
              }}
            >
              {t(`nav.${section.navKey}`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
