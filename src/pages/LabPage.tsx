import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import { DEMOS } from "../components/perf/registry";

// 效能實作展示頁。由 registry 驅動：新增 demo 只要在那裡加一筆，
// 這頁的錨點導覽、編號與版面都會自動跟上。

// 站台頁首是 sticky top-0，高 h-14 + 2px 邊框 = 58px。sticky 導覽與錨點
// 捲動都要讓開這段，否則會被壓在頁首底下。數值對齊 scroll-mt-20 / lg:top-20
const HEADER_OFFSET = 80;

export default function LabPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState(DEMOS[0]?.slug ?? "");

  // 錨點導覽的目前位置。用 IntersectionObserver 而非捲動事件，
  // 不必自己節流也不會在捲動時反覆計算版面
  useEffect(() => {
    const obs = DEMOS.map(({ slug }) => {
      const el = document.getElementById(slug);
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(slug);
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      ob.observe(el);
      return ob;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <header className="mb-14 flex flex-col items-start gap-4">
          <div className="relative">
            <CrayonDoodle
              type="zigzag"
              color="var(--color-nekoma)"
              className="absolute -left-9 -top-6 h-8 w-8"
              delay={300}
            />
            <h1
              className="border-2 px-6 py-3 text-3xl md:text-5xl"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-ink)",
                boxShadow: "var(--shadow-manga)",
              }}
            >
              PERF LAB
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {t("perf.intro")}
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* 錨點導覽。demo 變多時這裡是找路的入口 */}
          <nav
            aria-label={t("perf.navLabel")}
            className="lg:sticky lg:top-20 lg:w-52 lg:shrink-0"
          >
            <ol className="m-0 flex list-none flex-wrap gap-2 p-0 lg:flex-col lg:gap-0">
              {DEMOS.map(({ slug, tag }, i) => (
                <li key={slug} className="lg:border-l-2" style={{ borderColor: "var(--color-ink)" }}>
                  <a
                    href={`#${slug}`}
                    onClick={(e) => {
                      // 第一項回到頁面最頂端（含標題區），其餘捲到該區塊。
                      // 用原生 anchor 的話 01 只會停在它自己的位置，看起來像沒反應
                      e.preventDefault();
                      const target = i === 0 ? 0 : (document.getElementById(slug)?.offsetTop ?? 0) - HEADER_OFFSET;
                      window.scrollTo({ top: target, behavior: "smooth" });
                      setActive(slug);
                    }}
                    className="interactive block px-3 py-2 text-xs no-underline transition-colors"
                    style={{
                      fontFamily: "monospace",
                      color: active === slug ? "var(--color-nekoma)" : "var(--color-muted)",
                      backgroundColor:
                        active === slug ? "color-mix(in srgb, var(--color-nekoma) 12%, transparent)" : "transparent",
                    }}
                    aria-current={active === slug ? "true" : undefined}
                  >
                    {String(i + 1).padStart(2, "0")} · {tag}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-10">
            {DEMOS.map(({ slug, tag, i18n, post, Component }, i) => (
              <article
                key={slug}
                id={slug}
                className="grid scroll-mt-20 gap-6 border-2 p-6 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-8 md:p-8"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "var(--shadow-manga)",
                }}
              >
                <header className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs tabular-nums"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--color-muted)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <code
                      className="px-2 py-0.5 text-[11px] tracking-[0.1em]"
                      style={{
                        fontFamily: "monospace",
                        backgroundColor: "var(--color-panel)",
                        color: "var(--color-on-panel)",
                      }}
                    >
                      {tag}
                    </code>
                  </div>
                  <h2 className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                    {t(`perf.${i18n}.title`)}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {t(`perf.${i18n}.desc`)}
                  </p>
                  <p
                    className="mt-1 border-l-2 pl-3 text-xs leading-relaxed"
                    style={{ borderColor: "var(--color-nekoma)", color: "var(--color-muted)" }}
                  >
                    {t(`perf.${i18n}.hint`)}
                  </p>
                  {/* 這裡只放得下操作說明。完整的來由、量測與原理寫在文章裡 */}
                  <Link
                    to={`/blog/${post}`}
                    className="interactive mt-2 inline-flex w-fit items-center gap-1.5 border-2 px-3 py-1.5 text-[11px] tracking-[0.1em] no-underline transition-transform hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-heading)",
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-ink)",
                      color: "var(--color-ink)",
                      boxShadow: "var(--shadow-manga-sm)",
                    }}
                  >
                    {t("perf.readPost")} →
                  </Link>
                </header>

                <div className="min-w-0">
                  <Component />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
