import { useEffect, useRef, useState } from "react";

const episodes = [
  {
    id: "01",
    title: "E-COMMERCE ARC",
    desc: "Vue 3 + Quasar + TypeScript 電商平台，完整 RWD、Pinia 狀態管理、Axios API 封裝、reCAPTCHA、SSR + SEO",
    color: "var(--color-nekoma)",
    year: "2026",
  },
  {
    id: "02",
    title: "OFFICIAL SITE SAGA",
    desc: "Next.js 14 App Router 架構遷移，多步驟驗屋預約、TapPay 金流、LINE LIFF 登入、GA4 電商事件追蹤",
    color: "var(--color-teal)",
    year: "2024",
  },
  {
    id: "03",
    title: "ADMIN SYSTEM ARC",
    desc: "React + MUI 後台系統，WebSocket 即時客服聊天室，LINE 貼圖渲染、排班、訂單、會員管理模組",
    color: "var(--color-poster)",
    year: "2024",
  },
  {
    id: "04",
    title: "CLINIC SYSTEM",
    desc: "醫美診所管理系統，React Hook Form + Zod 多步驟表單、TanStack Query、帳號權限管理、罐頭訊息模組",
    color: "#6366f1",
    year: "2025",
  },
  {
    id: "05",
    title: "EMS DASHBOARD",
    desc: "React 19 + Vite 能源/環境監控 SPA，自適應縮放（1280px ～ 4K），即時節點流量追蹤、品牌設計系統",
    color: "#0891b2",
    year: "2025",
  },
  {
    id: "06",
    title: "POS CHRONICLES",
    desc: "平板最佳化餐飲 POS 系統，WebSocket 即時訂單更新、條碼掃描、多元支付辨識，高頻操作場景設計",
    color: "#16a34a",
    year: "2025",
  },
];

function EpisodeCard({ episode }: { episode: (typeof episodes)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 snap-center w-72 md:w-80"
      style={{
        perspective: "1000px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
  const sectionRef = useRef<HTMLElement>(null);

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
        className="flex overflow-x-auto gap-8 px-4 pb-8 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Spacer */}
        <div className="flex-shrink-0 w-4 md:w-16" />

        {episodes.map((episode, index) => (
          <div
            key={episode.id}
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
        {episodes.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                index === 0 ? "var(--color-nekoma)" : "var(--color-ink)",
              opacity: index === 0 ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
}
