import { useEffect, useState } from "react";
import CrayonUnderline from "../crayon/CrayonUnderline";
import CrayonDoodle from "../crayon/CrayonDoodle";
import CrayonTrail from "../crayon/CrayonTrail";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="start"
      className="section min-h-screen flex flex-col justify-center items-center pt-20"
    >
      {/* Halftone Background */}
      <div className="absolute inset-0 z-0 opacity-10 halftone" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        {/* Volume Tag */}
        <div
          className={`transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2
            className="text-sm sm:text-xl md:text-2xl tracking-wide md:tracking-widest mb-4 px-3 py-1 inline-block border-2 transform -rotate-2"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-poster)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            VOL. 1: FRONTEND ENGINEER
          </h2>
        </div>

        {/* Main Title */}
        <div
          className={`text-center transform transition-all duration-700 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1
            className="text-5xl sm:text-7xl md:text-9xl tracking-tighter leading-none mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="sr-only">
              Haru Li — Frontend Engineer, React, Next.js, TypeScript
            </span>
            <span className="text-outline block" aria-hidden="true">
              FRONTEND
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
          className={`relative mt-8 w-full max-w-4xl aspect-video transform transition-all duration-700 delay-400 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
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
                  backgroundColor: "var(--color-nekoma)",
                  borderColor: "var(--color-ink)",
                }}
              >
                OPEN TO WORK
              </span>
              <span
                className="px-3 py-1 text-xs text-white border"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-teal)",
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
              className={`absolute bottom-8 right-8 speech-bubble max-w-xs transform transition-all duration-500 delay-700 ${
                isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <p className="text-sm font-bold leading-tight">
                "重視產品理解與工程品質，
                <br />
                不只實作介面，更關注系統設計。"
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
                    width: `${30 + Math.random() * 20}%`,
                    transform: `rotate(${-15 + Math.random() * 30}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`mt-12 flex flex-col items-center transform transition-all duration-700 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <span
            className="text-sm tracking-widest mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            SCROLL
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
