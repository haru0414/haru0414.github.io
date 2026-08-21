import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CrayonDoodle from "../crayon/CrayonDoodle";
import MemoDemo from "../perf/MemoDemo";
import LazyDemo from "../perf/LazyDemo";
import SuspenseDemo from "../perf/SuspenseDemo";

// 可操作的效能實作展示。做成互動而非截圖：數字是當場跑出來的，
// 看的人可以自己調參數驗證，比宣稱「我懂效能」有說服力。
const DEMOS = [
  { key: "memo", tag: "useMemo", Demo: MemoDemo },
  { key: "lazy", tag: "React.lazy", Demo: LazyDemo },
  { key: "suspense", tag: "Suspense", Demo: SuspenseDemo },
] as const;

export default function PerfLabSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShown(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} id="perf" className="py-20">
      <div className="container mx-auto flex flex-col items-center px-4">
        <div className="relative mb-4">
          <CrayonDoodle
            type="zigzag"
            color="var(--color-nekoma)"
            className="absolute -left-10 -top-6 h-8 w-8"
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
            PERF LAB
          </h2>
        </div>

        <p className="mb-14 max-w-xl text-center text-sm" style={{ color: "var(--color-muted)" }}>
          {t("perf.intro")}
        </p>

        <div className="flex w-full max-w-5xl flex-col gap-8">
          {DEMOS.map(({ key, tag, Demo }, i) => (
            <article
              key={key}
              className="grid gap-6 border-2 p-6 transition-all duration-500 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-8 md:p-8"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga)",
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <header className="flex flex-col gap-2">
                <code
                  className="self-start px-2 py-0.5 text-[11px] tracking-[0.1em]"
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "var(--color-panel)",
                    color: "var(--color-paper)",
                  }}
                >
                  {tag}
                </code>
                <h3 className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  {t(`perf.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {t(`perf.${key}.desc`)}
                </p>
                <p
                  className="mt-1 border-l-2 pl-3 text-xs leading-relaxed"
                  style={{ borderColor: "var(--color-nekoma)", color: "var(--color-muted)" }}
                >
                  {t(`perf.${key}.hint`)}
                </p>
              </header>

              <div className="min-w-0">
                <Demo />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
