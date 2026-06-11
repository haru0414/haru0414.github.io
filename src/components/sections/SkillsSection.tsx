import { useEffect, useRef, useState } from "react";

const careerPath = [
  {
    year: "2019 — 2023",
    role: "學士｜電腦與通訊工程學系",
    company: "國立高雄科技大學",
    desc: "系排名 20 / 112（前 17.86%）。系學會美宣長，奠定前端開發與系統設計基礎，畢業前已實際參與專案開發。",
  },
  {
    year: "2022 — 2023",
    role: "前端實習生（大四實習）",
    company: "GLSoft",
    desc: "以 Angular + SCSS 為主，學習基本切版與 UI 實作，協助簡單功能修復，建立前端開發的實務基礎。",
  },
  {
    year: "2024 — NOW",
    role: "Frontend Engineer",
    company: "好日子科技",
    desc: "主導前端架構從 Astro+React 遷移至 Next.js 14 App Router，開發多步驟預約系統、TapPay 金流、LINE LIFF 登入、GA4 電商追蹤與 WebSocket 即時客服聊天室。",
  },
];

export default function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section ref={sectionRef} id="career" className="py-20">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Section Title */}
        <div
          className={`mb-12 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2
            className="text-3xl md:text-4xl px-6 py-3 bg-white border-2"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga)",
            }}
          >
            CAREER PATH
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl w-full">
          {/* Vertical Line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2"
            style={{ backgroundColor: "var(--color-ink)" }}
          />

          {careerPath.map((job, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-12 transform transition-all duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              } ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              style={{
                transitionDelay: `${index * 200}ms`,
                transform: isVisible
                  ? "translateX(0)"
                  : index % 2 === 0
                    ? "translateX(50px)"
                    : "translateX(-50px)",
              }}
            >
              {/* Content Box */}
              <div className="ml-20 md:ml-0 md:w-1/2 px-4">
                <div
                  className={`bg-white border-2 p-5 relative ${
                    index % 2 === 0
                      ? "md:text-left md:mr-8"
                      : "md:text-right md:ml-8"
                  }`}
                  style={{
                    borderColor: "var(--color-ink)",
                    boxShadow: "var(--shadow-manga)",
                  }}
                >
                  {/* Year Tag */}
                  <span
                    className={`absolute -top-3 px-3 py-1 text-xs border ${
                      index % 2 === 0
                        ? "left-4"
                        : "md:right-4 left-4 md:left-auto"
                    }`}
                    style={{
                      fontFamily: "var(--font-heading)",
                      backgroundColor: "var(--color-poster)",
                      borderColor: "var(--color-ink)",
                      boxShadow: "2px 2px 0 0 var(--color-ink)",
                    }}
                  >
                    {job.year}
                  </span>

                  <h3
                    className="text-xl mt-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-nekoma)",
                    }}
                  >
                    {job.company}
                  </h3>
                  <h4 className="font-medium mb-2 text-gray-700">{job.role}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    {job.desc}
                  </p>
                </div>
              </div>

              {/* Bus Stop Node */}
              <div
                className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white border-4 rounded-full flex items-center justify-center z-10"
                style={{
                  borderColor: "var(--color-ink)",
                  boxShadow: "2px 2px 0 0 var(--color-ink)",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "var(--color-nekoma)" }}
                />
              </div>

              {/* Spacer for opposite side */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}

          {/* End Node */}
          <div
            className={`relative flex justify-center transform transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${careerPath.length * 200}ms` }}
          >
            <div
              className="w-14 h-14 bg-white border-4 rounded-full flex items-center justify-center z-10 ml-8 md:ml-0"
              style={{
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga-sm)",
              }}
            >
              <span
                className="text-smmd:text-lg"
                style={{ fontFamily: "var(--font-heading)" }}
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
