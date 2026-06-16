import { useEffect, useRef, useState } from "react";
import photo1 from "../../assets/images/photo_1.webp";
import photo2 from "../../assets/images/photo_2.webp";
import catCover from "../../assets/images/onigiri/cover.webp";
import sticker3 from "../../assets/images/onigiri/stickers/3.webp";

const photos = [photo1, photo2];

// Radar Chart Component
function RadarChart() {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={chartRef}
      className="relative w-full max-w-[180px] md:max-w-[220px] lg:max-w-[260px] mx-auto aspect-square"
    >
      <svg viewBox="-25 -18 150 136" className="w-full h-full overflow-visible">
        {/* Background Grid */}
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        <polygon
          points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Data Polygon */}
        <polygon
          points="50,10 90,30 80,70 50,85 20,70 15,35"
          fill="rgba(200, 62, 52, 0.4)"
          stroke="var(--color-nekoma)"
          strokeWidth="2"
          style={{
            transform: isVisible ? "scale(1)" : "scale(0)",
            transformOrigin: "center",
            transition: "transform 0.8s ease-out",
          }}
        />

        {/* Labels */}
        <text
          x="50"
          y="-2"
          textAnchor="middle"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          CODE
        </text>
        <text
          x="102"
          y="28"
          textAnchor="start"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          DESIGN
        </text>
        <text
          x="102"
          y="78"
          textAnchor="start"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          STORY
        </text>
        <text
          x="50"
          y="108"
          textAnchor="middle"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          SPEED
        </text>
        <text
          x="-2"
          y="78"
          textAnchor="end"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          LOGIC
        </text>
        <text
          x="-2"
          y="28"
          textAnchor="end"
          className="text-[8px]"
          style={{
            fontFamily: "var(--font-heading)",
            fill: "var(--color-ink)",
          }}
        >
          VIBE
        </text>
      </svg>
    </div>
  );
}

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "SCSS",
    "Vite",
    "Astro",
    "WebSocket",
    "Axios",
    "LINE LIFF",
  ];

  return (
    <section ref={sectionRef} id="character" className="section py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Vertical Title */}
          <div className="hidden md:flex flex-col justify-center items-center">
            <h2
              className="text-vertical text-6xl opacity-20 text-outline"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              CHARACTER
            </h2>
          </div>

          {/* Main Bento Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Profile Photo */}
            <div
              className={`md:col-span-1 manga-card transform transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div
                className="relative w-full aspect-[3/4] overflow-hidden border cursor-pointer"
                style={{
                  backgroundColor: "var(--color-teal)",
                  borderColor: "var(--color-ink)",
                }}
                onMouseEnter={() => setIsPhotoHovered(true)}
                onMouseLeave={() => setIsPhotoHovered(false)}
                onClick={() => setIsPhotoHovered((prev) => !prev)}
              >
                {/* Profile Photos - hover crossfade */}
                {photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Haru Li"
                    width={i === 0 ? 3933 : 2268}
                    height={i === 0 ? 5244 : 4032}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-500"
                    style={{ opacity: i === (isPhotoHovered ? 1 : 0) ? 1 : 0 }}
                  />
                ))}
                {/* Sticker overlay */}
                <img
                  src={sticker3}
                  alt=""
                  aria-hidden="true"
                  width={1013}
                  height={527}
                  loading="lazy"
                  decoding="async"
                  className="absolute bottom-4 object-cover object-left right-2 w-16 h-16 rounded-full p-1 opacity-80 pointer-events-none transition-transform duration-300 hover:scale-110"
                  style={{
                    filter: "drop-shadow(1px 2px 0px rgba(0,0,0,0.5))",
                    backgroundColor: "var(--color-nekoma)",
                  }}
                />
                {/* Player Number Tag */}
                <div
                  className="absolute bottom-0 left-0 px-3 py-1 border-t-2 border-r-2 text-xs"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundColor: "var(--color-poster)",
                    borderColor: "var(--color-ink)",
                  }}
                >
                  FRONTEND DEV
                </div>
              </div>

              <div className="mt-3 text-center">
                <h3
                  className="text-xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  HARU LI
                </h3>
                <p className="text-xs text-gray-500 mt-1">Frontend Developer</p>
              </div>
            </div>

            {/* Card 2: Stats Radar */}
            <div
              className={`md:col-span-1 manga-card flex flex-col items-center justify-center transform transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <h3
                className="text-lg border-b-2 w-full text-center pb-2 mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  borderColor: "var(--color-ink)",
                }}
              >
                SKILL RADAR
              </h3>
              <RadarChart />
            </div>

            {/* Card 3: Bio Dialogue */}
            <div
              className={`md:col-span-1 manga-card relative flex flex-col justify-center transform transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: "200ms",
                backgroundColor: "var(--color-paper)",
              }}
            >
              {/* BIO Tag */}
              <div
                className="absolute -top-3 -left-3 px-3 py-1 text-sm text-white border-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-nekoma)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "2px 2px 0 0 var(--color-ink)",
                }}
              >
                BIO
              </div>

              <p className="font-medium leading-relaxed mt-4">
                "以前端工程為核心，主要使用 React，熟悉 TypeScript、SCSS 與
                Tailwind CSS，擅長將設計需求轉化為可維護的前端架構。
                <br />
                <br />
                <span
                  className="px-1"
                  style={{ backgroundColor: "rgba(255, 200, 69, 0.5)" }}
                >
                  核心優勢：
                </span>{" "}
                架構重構能力 ✕ AI 輔助開發流程"
              </p>
            </div>

            {/* Card 4: Cat */}
            <div
              className={`md:col-span-1 manga-card transform transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div
                className="relative w-full aspect-[3/4] overflow-hidden border"
                style={{
                  backgroundColor: "var(--color-nekoma)",
                  borderColor: "var(--color-ink)",
                }}
              >
                <img
                  src={catCover}
                  alt="飯糰"
                  width={1658}
                  height={1414}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-left"
                />

                <div
                  className="absolute bottom-0 left-0 px-3 py-1 border-t-2 border-r-2 text-xs"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundColor: "var(--color-poster)",
                    borderColor: "var(--color-ink)",
                  }}
                >
                  CODE REVIEWER
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3
                  className="text-xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ONIGIRI
                </h3>
                <p className="text-xs text-gray-500 mt-1">常駐監工 🐾</p>
              </div>
            </div>

            {/* Card 5: Tech Stack (Full Width) */}
            <div
              className={`md:col-span-2 lg:col-span-4 p-6 border-2 transform transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: "300ms",
                backgroundColor: "var(--color-panel)",
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga)",
              }}
            >
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <span
                  className="text-2xl mr-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-poster)",
                  }}
                >
                  TECH STACK //
                </span>
                {techStack.map((tech, index) => (
                  <span
                    key={tech}
                    className="px-4 py-2 border-2 text-sm text-white hover:bg-white hover:text-[var(--color-panel)] transition-colors cursor-default"
                    style={{
                      fontFamily: "var(--font-heading)",
                      borderColor: "white",
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
