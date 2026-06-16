import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CrayonDoodle from "../crayon/CrayonDoodle";

// 只留下年份；職稱 / 公司 / 描述依索引放在 i18n career.*
const careerPath = [
  { year: "2019 — 2023" },
  { year: "2022 — 2023" },
  { year: "2024 — NOW" },
];

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// 單一章節分鏡：自帶 IntersectionObserver，捲入視窗時從左/右滑入
function Chapter({ index, year }: { index: number; year: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  // 交替方向：EP.01 右、EP.02 左、EP.03 右…
  const onRight = index % 2 === 0;
  const ep = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShown(true);
      },
      { threshold: 0.35 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mb-16 md:mb-24">
      {/* 線上的節點：章節現身時點亮 */}
      <div
        className="absolute left-8 md:left-1/2 top-7 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 transition-colors duration-500"
        style={{
          backgroundColor: shown ? "var(--color-nekoma)" : "var(--color-surface)",
          borderColor: "var(--color-ink)",
          boxShadow: "2px 2px 0 0 var(--color-ink)",
        }}
      >
        <span
          className="text-[10px]"
          style={{
            fontFamily: "var(--font-heading)",
            color: shown ? "#fff" : "var(--color-ink)",
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* 章節卡：偏向其中一側，捲入時滑入 */}
      <div
        className={`ml-20 md:ml-0 md:w-[calc(50%-2.75rem)] ${
          onRight ? "md:ml-auto" : "md:mr-auto"
        }`}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown
            ? "translateX(0)"
            : `translateX(${onRight ? "40px" : "-40px"})`,
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div
          className="relative overflow-hidden border-2 p-5 pt-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-ink)",
            boxShadow: "var(--shadow-manga)",
          }}
        >
          {/* 大型 EP 浮水印 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-3 select-none text-7xl leading-none opacity-10"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            {ep}
          </span>

          {/* EP 標籤 + 年份 */}
          <div className="mb-2 flex items-center gap-3">
            <span
              className="px-2 py-0.5 text-xs text-white"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-panel)",
              }}
            >
              EP.{ep}
            </span>
            <span
              className="px-2 py-0.5 text-xs"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-poster)",
                color: "var(--color-panel)",
                border: "1px solid var(--color-ink)",
              }}
            >
              {year}
            </span>
          </div>

          <h3
            className="relative text-xl"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-nekoma)",
            }}
          >
            {t(`career.${index}.company`)}
          </h3>
          <h4 className="mb-2 font-medium text-gray-700">
            {t(`career.${index}.role`)}
          </h4>
          <p className="text-sm font-normal leading-relaxed text-gray-500">
            {t(`career.${index}.desc`)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 連接線隨捲動「畫出」：依時間軸容器捲過視窗的比例設定填滿高度
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const start = window.innerHeight * 0.75; // 容器頂進到視窗 75% 處開始畫
        setProgress(clamp((start - rect.top) / rect.height, 0, 1));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="career" className="py-20">
      <div className="container mx-auto flex flex-col items-center px-4">
        {/* Section Title */}
        <div
          className={`relative mb-16 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CrayonDoodle
            type="sparkle"
            color="var(--color-nekoma)"
            className="absolute -left-10 -top-6 h-8 w-8"
            delay={400}
          />
          <CrayonDoodle
            type="star"
            color="var(--color-poster)"
            className="absolute -bottom-7 -right-12 h-10 w-10"
            delay={700}
          />
          <h2
            className="border-2 px-6 py-3 text-3xl md:text-4xl"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga)",
            }}
          >
            CAREER PATH
          </h2>
        </div>

        {/* Timeline track */}
        <div ref={trackRef} className="relative w-full max-w-2xl">
          {/* 底線（淡） */}
          <div
            className="absolute bottom-0 left-8 top-0 w-1 -translate-x-1/2 md:left-1/2"
            style={{ backgroundColor: "var(--color-ink)", opacity: 0.15 }}
          />
          {/* 填滿線（隨捲動畫出） */}
          <div
            className="absolute left-8 top-0 w-1 -translate-x-1/2 md:left-1/2"
            style={{
              height: `${progress * 100}%`,
              backgroundColor: "var(--color-nekoma)",
            }}
          />

          {careerPath.map((job, index) => (
            <Chapter key={index} index={index} year={job.year} />
          ))}

          {/* 連載中：結尾節點 */}
          <div className="relative flex justify-start md:justify-center">
            <div
              className="ml-8 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 md:ml-0 md:translate-x-0"
              style={{
                backgroundColor: "var(--color-poster)",
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga-sm)",
              }}
            >
              <span
                className="text-sm md:text-base"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-panel)",
                }}
              >
                NOW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
