import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CrayonDoodle from "../crayon/CrayonDoodle";

// 只留下年份；職稱 / 公司 / 描述依索引放在 i18n career.*
const careerPath = [
  { year: "2019 — 2023" },
  { year: "2022 — 2023" },
  { year: "2024 — NOW" },
];

export default function SkillsSection() {
  const { t } = useTranslation();
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
          className={`relative mb-12 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CrayonDoodle
            type="sparkle"
            color="var(--color-nekoma)"
            className="absolute -top-6 -left-10 w-8 h-8"
            delay={400}
          />
          <CrayonDoodle
            type="star"
            color="var(--color-poster)"
            className="absolute -bottom-7 -right-12 w-10 h-10"
            delay={700}
          />
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
                    {t(`career.${index}.company`)}
                  </h3>
                  <h4 className="font-medium mb-2 text-gray-700">
                    {t(`career.${index}.role`)}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    {t(`career.${index}.desc`)}
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
