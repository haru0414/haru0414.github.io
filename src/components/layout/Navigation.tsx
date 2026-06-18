import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// id 對應頁面區塊、navKey 對應 i18n 字典裡 nav.* 的鍵
const sections = [
  { id: "start", navKey: "intro" },
  { id: "character", navKey: "about" },
  { id: "episodes", navKey: "projects" },
  { id: "career", navKey: "career" },
  { id: "next", navKey: "contact" },
];

export default function Navigation() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("start");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, attempt = 0) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (attempt < 20) {
      // 折線下方的 section 是懶載入的，剛載入前可能還不在 DOM；短暫重試
      window.setTimeout(() => scrollToSection(id, attempt + 1), 50);
    }
  };

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div
          className="bg-white border-2 px-6 py-3 flex items-center gap-3 pointer-events-auto rounded-full"
          style={{
            borderColor: "var(--color-ink)",
            boxShadow: "var(--shadow-manga-sm)",
          }}
        >
          {/* Logo：點擊回頂部 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hidden sm:block text-sm tracking-wider select-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-badge-red)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            H·L
          </button>

          {/* Connection Line */}
          <div
            className="hidden sm:block h-0.5 w-8"
            style={{ backgroundColor: "var(--color-ink)" }}
          />

          {/* Station Dots */}
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center justify-center"
              >
                {/* Station Dot */}
                <div
                  className="w-4 h-4 rounded-full border-2 transition-all duration-200"
                  style={{
                    borderColor: "var(--color-ink)",
                    backgroundColor:
                      activeSection === section.id
                        ? "var(--color-nekoma)"
                        : "white",
                    transform:
                      activeSection === section.id ? "scale(1.2)" : "scale(1)",
                  }}
                />

                {/* Tooltip */}
                <span
                  className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundColor: "var(--color-panel)",
                    color: "white",
                  }}
                >
                  {t(`nav.${section.navKey}`)}
                </span>
              </button>

              {/* Connection Line Between Stations */}
              {index < sections.length - 1 && (
                <div
                  className="h-0.5 w-6"
                  style={{
                    backgroundColor: "var(--color-ink)",
                    opacity: 0.3,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
