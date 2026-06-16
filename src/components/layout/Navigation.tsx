import { useState, useEffect } from "react";
import catCover from "../../assets/images/onigiri/cover.webp";

const sections = [
  { id: "start", label: "Intro" },
  { id: "character", label: "About" },
  { id: "episodes", label: "Projects" },
  { id: "career", label: "Career" },
  { id: "next", label: "Contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("start");
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showCatEgg, setShowCatEgg] = useState(false);

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    if (next >= 3) {
      setShowCatEgg(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(next);
    }
  };

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="hidden sm:block text-sm tracking-wider select-none"
            style={{
              fontFamily: "var(--font-heading)",
              color:
                logoClickCount > 0
                  ? "var(--color-teal)"
                  : "var(--color-nekoma)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            title={logoClickCount > 0 ? `${3 - logoClickCount} more...` : ""}
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
                  {section.label}
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

      {/* Easter egg modal */}
      {showCatEgg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowCatEgg(false)}
        >
          <div
            className="relative border-4 overflow-hidden max-w-xs w-full"
            style={{
              backgroundColor: "var(--color-paper)",
              borderColor: "var(--color-ink)",
              boxShadow: "8px 8px 0 0 var(--color-nekoma)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-4 py-2 border-b-4 flex items-center justify-between"
              style={{
                backgroundColor: "var(--color-panel)",
                borderColor: "var(--color-ink)",
              }}
            >
              <span
                className="text-sm text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                HIDDEN CHARACTER UNLOCKED
              </span>
              <button
                onClick={() => setShowCatEgg(false)}
                className="text-white/70 hover:text-white text-xs"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ✕
              </button>
            </div>
            <img
              src={catCover}
              alt="飯糰"
              width={1658}
              height={1414}
              className="w-full object-cover block"
            />
            <div className="px-5 py-4 text-center">
              <p
                className="text-xl mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ✦ ONIGIRI ✦
              </p>
              <p className="text-sm text-gray-500">
                常駐在我身邊的監工，負責審查所有程式碼品質。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
