import { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import CrayonUnderline from "../crayon/CrayonUnderline";

// 決定性偽隨機（取代 Math.random），讓 speed lines 在 SSR 與 client render
// 產生相同值，避免 hydration mismatch
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com/in/liiiharu/" },
    { name: "GitHub", url: "https://github.com/haru0414" },
  ];

  return (
    <section
      ref={sectionRef}
      id="next"
      className="py-24 relative overflow-hidden border-t-4"
      style={{
        backgroundColor: "var(--color-teal)",
        borderColor: "var(--color-ink)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Speed Lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                backgroundColor: "white",
                top: `${rand(i) * 100}%`,
                left: 0,
                right: 0,
                transform: `rotate(${-5 + rand(i + 50) * 10}deg)`,
                opacity: 0.3 + rand(i + 100) * 0.7,
              }}
            />
          ))}
        </div>

        {/* Halftone Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Title - TO BE CONTINUED */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h2
            className="text-4xl sm:text-6xl md:text-8xl mb-6 cursor-pointer transition-transform duration-300"
            style={{
              fontFamily: "var(--font-heading)",
              WebkitTextStroke: "2px var(--color-ink)",
              color: isHovered ? "var(--color-poster)" : "white",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <CrayonUnderline
              variant="circle"
              trigger="hover"
              active={isHovered}
              color="var(--color-nekoma)"
            >
              TO BE
              <br />
              CONTINUED
            </CrayonUnderline>
          </h2>
        </div>

        {/* Subtitle - BIO 螢光標記樣式，關鍵字以黃色標起 */}
        <p
          className={`text-xl font-medium mb-10 max-w-md mx-auto leading-relaxed transform transition-all duration-700 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ color: "var(--color-paper)" }}
        >
          <Trans
            i18nKey="contact.subtitle"
            components={{
              hl: (
                <span
                  className="px-1"
                  style={{
                    backgroundColor: "var(--color-poster)",
                    color: "var(--color-panel)",
                  }}
                />
              ),
            }}
          />
        </p>

        {/* Contact + Resume Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-5 transform transition-all duration-700 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href="mailto:skb900414@gmail.com"
            className="inline-block text-2xl px-10 py-5 text-white border-4 transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-nekoma)",
              borderColor: "var(--color-ink)",
              boxShadow: "8px 8px 0 0 var(--color-ink)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0 0 var(--color-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "8px 8px 0 0 var(--color-ink)";
            }}
          >
            CONTACT ME
          </a>
          {/* 下載履歷 PDF：poster 黃底固定深字（對比安全），download 觸發另存 */}
          <a
            href="/files/resume.pdf"
            download="Haru-Li-Resume.pdf"
            className="inline-block text-2xl px-10 py-5 border-4 transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-poster)",
              color: "var(--color-on-poster)",
              borderColor: "var(--color-ink)",
              boxShadow: "8px 8px 0 0 var(--color-ink)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0 0 var(--color-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "8px 8px 0 0 var(--color-ink)";
            }}
          >
            RESUME ↓
          </a>
        </div>

        {/* Social Links */}
        <div
          className={`mt-12 flex justify-center gap-6 transform transition-all duration-700 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="px-4 py-2 text-sm border-2 transition-all duration-200 hover:bg-white"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-paper)",
                borderColor: "var(--color-paper)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-panel)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-paper)";
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div
          className={`mt-16 text-sm opacity-60 transform transition-all duration-700 delay-800 ${
            isVisible ? "translate-y-0 opacity-60" : "translate-y-10 opacity-0"
          }`}
          style={{
            fontFamily: "monospace",
            color: "var(--color-paper)",
          }}
        >
          © 2026 HARU LI // FRONTEND DEVELOPER // TAIWAN
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 left-4 hidden md:block">
          <div
            className="w-12 h-12 border-4 rounded-full opacity-30"
            style={{ borderColor: "var(--color-paper)" }}
          />
        </div>
        <div className="absolute top-8 right-8 hidden md:block">
          <div
            className="w-8 h-8 border-4 opacity-30"
            style={{ borderColor: "var(--color-paper)" }}
          />
        </div>
      </div>
    </section>
  );
}
