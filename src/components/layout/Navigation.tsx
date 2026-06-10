import { useState, useEffect } from "react";

const sections = [
  { id: "start", label: "Intro" },
  { id: "character", label: "About" },
  { id: "episodes", label: "Projects" },
  { id: "career", label: "Career" },
  { id: "next", label: "Contact" },
];

export default function Navigation() {
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="bg-white border-2 px-6 py-3 flex items-center gap-3 pointer-events-auto rounded-full"
        style={{
          borderColor: "var(--color-ink)",
          boxShadow: "var(--shadow-manga-sm)",
        }}
      >
        {/* Logo */}
        <span
          className="hidden sm:block text-sm tracking-wider"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-nekoma)",
          }}
        >
          H·L
        </span>

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
                  backgroundColor: "var(--color-ink)",
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
  );
}
