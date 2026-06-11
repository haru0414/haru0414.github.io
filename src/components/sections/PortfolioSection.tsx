import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../../data/projects";

function EpisodeCard({ episode }: { episode: (typeof projects)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="flex-shrink-0 snap-center w-72 md:w-80 cursor-pointer"
      style={{
        perspective: "1000px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/project/${episode.id}`)}
    >
      <div
        className="w-full aspect-[2/3] relative transition-all duration-300"
        style={{
          transform: isHovered
            ? "translateY(-10px) rotateY(5deg)"
            : "translateY(0) rotateY(0)",
        }}
      >
        <div
          className="w-full h-full border-4 flex flex-col relative overflow-hidden"
          style={{
            backgroundColor: "var(--color-paper)",
            borderColor: "var(--color-ink)",
            boxShadow: isHovered
              ? "var(--shadow-manga-hover)"
              : "var(--shadow-manga)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Spine Design (Left Strip) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-10 border-r-4 bg-white flex flex-col items-center justify-center py-4 z-10"
            style={{ borderColor: "var(--color-ink)" }}
          >
            <span
              className="text-xl transform -rotate-90 whitespace-nowrap origin-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VOL. {episode.id}
            </span>
            <div
              className="mt-auto w-6 h-6 rounded-full"
              style={{ backgroundColor: "var(--color-ink)" }}
            />
          </div>

          {/* Cover Content */}
          <div
            className="ml-10 h-2/3 border-b-4 relative overflow-hidden"
            style={{
              backgroundColor: episode.color,
              borderColor: "var(--color-ink)",
            }}
          >
            {/* Decorative Pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(0,0,0,0.1) 0%, transparent 50%)
                `,
              }}
            />

            {/* Halftone Effect */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />

            {/* Title on Cover */}
            <h3
              className="absolute bottom-3 right-3 text-3xl text-white leading-tight text-right max-w-[80%]"
              style={{
                fontFamily: "var(--font-heading)",
                textShadow: "2px 2px 0 var(--color-ink)",
              }}
            >
              {episode.title}
            </h3>

            {/* Year Badge */}
            <div
              className="absolute top-3 right-3 px-2 py-1 text-xs border"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "white",
                borderColor: "var(--color-ink)",
              }}
            >
              {episode.year}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="ml-10 p-4 flex-1 flex flex-col justify-between">
            <p className="font-bold text-base">{episode.desc}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-sm text-white border-2 transition-all duration-200 hover:bg-[var(--color-nekoma)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-ink)",
                  borderColor: "var(--color-ink)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/project/${episode.id}`);
                }}
              >
                READ &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="episodes"
      className="py-20 overflow-hidden relative border-y-4"
      style={{
        backgroundColor: "white",
        borderColor: "var(--color-ink)",
      }}
    >
      {/* Background Stripes */}
      <div className="absolute inset-0 diagonal-stripes" />

      {/* Header */}
      <div className="container mx-auto px-4 mb-10 flex justify-between items-end">
        <div
          className={`transform transition-all duration-700 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          <h2
            className="text-5xl md:text-7xl leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-ink)",
            }}
          >
            PROJECT
            <br />
            <span style={{ color: "var(--color-nekoma)" }}>LIST</span>
          </h2>
        </div>

        <div
          className={`hidden md:block text-xl animate-pulse transform transition-all duration-700 delay-300 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          SCROLL ➔
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 px-4 pb-8 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overscrollBehaviorX: "contain",
          touchAction: "pan-x",
        }}
      >
        {/* Spacer */}
        <div className="flex-shrink-0 w-4 md:w-16" />

        {projects.map((episode, index) => (
          <div
            key={episode.id}
            data-card
            className={`transform transition-all duration-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <EpisodeCard episode={episode} />
          </div>
        ))}

        {/* End Spacer */}
        <div className="flex-shrink-0 w-4 md:w-16" />
      </div>

      {/* Mobile Scroll Hint */}
      <div className="md:hidden flex justify-center mt-4 gap-2">
        {projects.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                index === activeIndex
                  ? "var(--color-nekoma)"
                  : "var(--color-ink)",
              opacity: index === activeIndex ? 1 : 0.3,
              transition: "opacity 0.3s, background-color 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
