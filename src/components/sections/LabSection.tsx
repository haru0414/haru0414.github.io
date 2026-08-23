import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CrayonDoodle from "../crayon/CrayonDoodle";
import { DEMOS } from "../perf/registry";

// 非商業案的實驗與狀態頁。獨立成一區而非混進專案列表：
// 專案區是求職主訴求，把 demo 混進去會稀釋它。
const ENTRIES = [
  { to: "/blog", key: "blog", badge: "WRITING", code: "NOTES", accent: "var(--color-nekoma)" },
  { to: "/lab", key: "perf", badge: "PLAYGROUND", code: "PERF", accent: "#6366f1" },
  { to: "/surf", key: "surf", badge: "EXPERIMENT", code: "SURF", accent: "var(--color-teal)" },
  { to: "/404-demo", key: "notFound", badge: "STATE", code: "404", accent: "var(--color-nekoma)" },
  { to: "/500", key: "error", badge: "STATE", code: "500", accent: "var(--color-poster)" },
] as const;

export default function LabSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShown(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} id="lab" className="py-20">
      <div className="container mx-auto flex flex-col items-center px-4">
        <div className="relative mb-4">
          <CrayonDoodle
            type="sparkle"
            color="var(--color-teal)"
            className="absolute -left-9 -top-5 h-7 w-7"
            delay={300}
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
            SIDE LAB
          </h2>
        </div>

        <p className="mb-12 max-w-lg text-center text-sm" style={{ color: "var(--color-muted)" }}>
          {t("lab.intro")}
        </p>

        <div className="grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ENTRIES.map((e, i) => (
            <Link
              key={e.to}
              to={e.to}
              className="group block transform transition-all duration-500"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${i * 110}ms`,
              }}
            >
              <div
                className="flex h-full flex-col items-start gap-3 border-2 p-5 transition-transform duration-300 group-hover:-translate-y-1.5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "var(--shadow-manga)",
                }}
              >
                <span
                  className="px-2 py-0.5 text-[10px] tracking-[0.2em] text-white"
                  style={{ fontFamily: "var(--font-heading)", backgroundColor: e.accent }}
                >
                  {e.badge}
                </span>
                <span
                  className="text-4xl leading-none"
                  style={{ fontFamily: "var(--font-heading)", color: e.accent }}
                >
                  {e.code}
                </span>
                <h3 className="text-base font-medium">{t(`lab.${e.key}.title`)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {t(`lab.${e.key}.desc`, { n: DEMOS.length })}
                </p>
                <span
                  className="mt-auto pt-2 text-[11px] tracking-[0.15em] underline underline-offset-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("lab.enter")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
