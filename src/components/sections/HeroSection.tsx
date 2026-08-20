import { useTranslation } from "react-i18next";
import CrayonUnderline from "../crayon/CrayonUnderline";
import CrayonDoodle from "../crayon/CrayonDoodle";
import CrayonTrail from "../crayon/CrayonTrail";

// 決定性偽隨機（取代 Math.random），讓 speed lines 在 prerender 快照與
// client render 產生相同值，避免 hydration mismatch
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="start"
      className="section min-h-screen flex flex-col justify-center items-center pt-20"
    >
      {/* Halftone Background */}
      <div className="absolute inset-0 z-0 opacity-10 halftone" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        {/* Volume Tag */}
        <div className="rise-in">
          {/* 裝飾性「卷號」標籤：非章節標題，用 <p> 不佔 heading 階層；
             poster 黃底固定深字確保深色模式對比 */}
          <p
            className="text-sm sm:text-xl md:text-2xl tracking-wide md:tracking-widest mb-4 px-3 py-1 inline-block border-2 transform -rotate-2"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-poster)",
              color: "var(--color-on-poster)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("hero.volume")}
          </p>
        </div>

        {/* Main Title */}
        <div
          className="text-center rise-in"
          style={{ animationDelay: "200ms" }}
        >
          {/* 手機字級依視窗寬換算：FULL-STACK 在 tracking-tighter 下寬度約為字級的
             7.85 倍，除以 8.2 留安全邊際，確保 320px 起都能單行、不被連字號斷開 */}
          <h1
            className="text-[calc((100vw-2rem)/8.2)] sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="sr-only">
              Haru Li — Full-Stack Engineer, React, Next.js, TypeScript, PHP, Laravel
            </span>
            <span className="text-outline block" aria-hidden="true">
              FULL-STACK
            </span>
            <span
              className="block transform translate-x-2 md:translate-x-4"
              style={{ color: "var(--color-ink)" }}
              aria-hidden="true"
            >
              <CrayonUnderline color="var(--color-nekoma)" delay={900}>
                DEV!!
              </CrayonUnderline>
            </span>
          </h1>
        </div>

        {/* Hero Image / Manga Cover */}
        <div
          className="relative mt-8 w-full max-w-4xl aspect-video pop-in"
          style={{ animationDelay: "400ms" }}
        >
          <div
            className="w-full h-full bg-white border-4 overflow-hidden group"
            style={{
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga)",
            }}
          >
            {/* Corner Tags */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <span
                className="px-3 py-1 text-sm text-white border"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-badge-red)",
                  borderColor: "var(--color-ink)",
                }}
              >
                {t("hero.openToWork")}
              </span>
              <span
                className="px-3 py-1 text-xs text-white border"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-badge-teal)",
                  borderColor: "var(--color-ink)",
                }}
              >
                2026
              </span>
            </div>

            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  linear-gradient(135deg, var(--color-poster) 0%, var(--color-nekoma) 50%, var(--color-teal) 100%)
                `,
              }}
            />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Circles */}
              <div
                className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-30 animate-float"
                style={{ backgroundColor: "var(--color-poster)" }}
              />
              <div
                className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-20 animate-float"
                style={{
                  backgroundColor: "var(--color-nekoma)",
                  animationDelay: "2s",
                }}
              />
              <div
                className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full opacity-25 animate-float"
                style={{
                  backgroundColor: "var(--color-teal)",
                  animationDelay: "4s",
                }}
              />

              {/* Crayon Doodles */}
              <CrayonDoodle
                type="star"
                color="var(--color-nekoma)"
                className="absolute top-8 left-12 w-10 h-10 md:w-14 md:h-14 opacity-70"
                delay={800}
              />
              <CrayonDoodle
                type="swirl"
                color="var(--color-teal)"
                className="absolute bottom-10 right-1/4 w-12 h-12 md:w-16 md:h-16 opacity-60"
                delay={1100}
              />
              <CrayonDoodle
                type="sparkle"
                color="var(--color-poster)"
                className="absolute top-1/3 right-10 w-8 h-8 md:w-12 md:h-12 opacity-80"
                delay={1400}
              />

              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--color-ink) 1px, transparent 1px),
                    linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p
                  className="text-6xl md:text-8xl font-bold opacity-10"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-ink)",
                  }}
                >
                  HARU LI
                </p>
              </div>
            </div>

            {/* Dialogue Bubble */}
            <div
              className="absolute bottom-8 right-8 speech-bubble max-w-xs pop-in"
              style={{ animationDelay: "700ms" }}
            >
              <p className="text-sm font-bold leading-tight">
                {t("hero.quote")}
              </p>
            </div>

            {/* Crayon Canvas - 在封面內按住拖曳可以用蠟筆塗鴉 */}
            <CrayonTrail className="absolute inset-0 z-10 opacity-80" />

            {/* Speed Lines Effect */}
            <div className="absolute inset-0 overflow-hidden opacity-5">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-px origin-left"
                  style={{
                    backgroundColor: "var(--color-ink)",
                    top: `${5 + i * 5}%`,
                    left: "50%",
                    width: `${30 + rand(i) * 20}%`,
                    transform: `rotate(${-15 + rand(i + 100) * 30}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="mt-12 flex flex-col items-center rise-in"
          style={{ animationDelay: "1000ms" }}
        >
          <span
            className="text-sm tracking-widest mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("hero.scroll")}
          </span>
          <div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: "var(--color-ink)" }}
          >
            <div
              className="w-1.5 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: "var(--color-nekoma)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
