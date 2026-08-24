import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "../components/LocaleLink";
import { ExternalLink } from "lucide-react";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import { projects } from "../data/projects";

// 出現在兩個以上專案的技術才放進篩選列。只出現一次的選了等於直接跳到那一件，
// 篩選的意義不大，卻會把整列塞滿
const TECH_FILTERS = (() => {
  const count = new Map<string, number>();
  projects.forEach((p) => p.techStack.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
  return [...count.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech);
})();

export default function WorkPage() {
  const { t } = useTranslation();
  const [tech, setTech] = useState<string | null>(null);

  const shown = tech ? projects.filter((p) => p.techStack.includes(tech)) : projects;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="mb-10 flex flex-col items-start gap-4">
          <div className="relative">
            <CrayonDoodle
              type="zigzag"
              color="var(--color-nekoma)"
              className="pointer-events-none absolute -left-9 -top-6 h-8 w-8"
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
              WORK
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {t("work.intro")}
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span
            className="mr-1 text-[11px] tracking-[0.14em]"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-muted)" }}
          >
            {t("work.filterLabel")}
          </span>
          {[null, ...TECH_FILTERS].map((item) => {
            const on = tech === item;
            return (
              <button
                key={item ?? "__all"}
                type="button"
                onClick={() => setTech(item)}
                aria-pressed={on}
                className="interactive border-2 px-3 py-1 text-xs transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "monospace",
                  borderColor: "var(--color-ink)",
                  backgroundColor: on ? "var(--color-nekoma)" : "var(--color-surface)",
                  color: on ? "#fff" : "var(--color-ink)",
                  cursor: "pointer",
                }}
              >
                {item ?? t("work.all")}
              </button>
            );
          })}
          <span className="ml-auto text-xs tabular-nums" style={{ color: "var(--color-muted)" }}>
            {t("work.count", { n: shown.length })}
          </span>
        </div>

        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <li key={project.id} className="flex">
              <article
                className="flex w-full flex-col border-2"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "var(--shadow-manga)",
                }}
              >
                {/* 封面色帶。網站截圖鋪滿整格；手機直式截圖的長寬比塞不進 16:10，
                    改成網點底上立一支帶機身外框的手機；沒有截圖的就只留網點 */}
                <div
                  className="relative aspect-16/10 overflow-hidden border-b-2"
                  style={{ backgroundColor: project.color, borderColor: "var(--color-ink)" }}
                >
                  {project.screenshots?.[0] && !project.portrait ? (
                    <img
                      src={project.screenshots[0].src}
                      alt=""
                      width={project.screenshots[0].w}
                      height={project.screenshots[0].h}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-25"
                      style={{
                        backgroundImage: "radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
                        backgroundSize: "4px 4px",
                      }}
                    />
                  )}
                  {project.screenshots?.[0] && project.portrait && (
                    <div className="absolute inset-x-0 top-5 flex justify-center">
                      <div
                        className="w-[86px] overflow-hidden rounded-[10px] border-[3px]"
                        style={{
                          // 同 PhoneGallery：機身色固定深色，否則深色模式下會跟截圖底色融在一起
                          borderColor: "#17181c",
                          backgroundColor: "#17181c",
                          boxShadow: "4px 4px 0 0 rgba(0,0,0,0.4)",
                        }}
                      >
                        <img
                          src={project.screenshots[0].src}
                          alt=""
                          width={project.screenshots[0].w}
                          height={project.screenshots[0].h}
                          loading="lazy"
                          decoding="async"
                          className="block h-auto w-full rounded-[7px]"
                        />
                      </div>
                    </div>
                  )}
                  <span
                    className="absolute left-0 top-0 border-b-2 border-r-2 px-2 py-1 text-xs"
                    style={{
                      fontFamily: "var(--font-heading)",
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-ink)",
                    }}
                  >
                    VOL. {project.id}
                  </span>
                  <span
                    className="absolute right-0 top-0 border-b-2 border-l-2 px-2 py-1 text-xs tabular-nums"
                    style={{
                      fontFamily: "var(--font-heading)",
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-ink)",
                    }}
                  >
                    {project.year}
                  </span>
                  {project.side && (
                    <span
                      className="absolute bottom-0 left-0 border-r-2 border-t-2 px-2 py-1 text-[11px] tracking-[0.1em]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        backgroundColor: "var(--color-poster)",
                        color: "var(--color-on-poster)",
                        borderColor: "var(--color-ink)",
                      }}
                    >
                      {t("work.side")}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h2 className="m-0 text-lg leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    {project.title}
                  </h2>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {t(`projects.${project.id}.desc`)}
                  </p>

                  <ul className="m-0 flex flex-wrap gap-1.5 p-0">
                    {project.techStack.slice(0, 5).map((item) => (
                      <li
                        key={item}
                        className="list-none px-1.5 py-0.5 text-[11px]"
                        style={{
                          fontFamily: "monospace",
                          backgroundColor: "color-mix(in srgb, var(--color-ink) 8%, transparent)",
                          color: "var(--color-muted)",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                    {project.techStack.length > 5 && (
                      <li className="list-none px-1 py-0.5 text-[11px]" style={{ color: "var(--color-muted)" }}>
                        +{project.techStack.length - 5}
                      </li>
                    )}
                  </ul>

                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <Link
                      to={`/project/${project.id}/`}
                      className="interactive border-2 px-3 py-1.5 text-xs tracking-[0.1em] no-underline transition-transform hover:-translate-y-0.5"
                      style={{
                        fontFamily: "var(--font-heading)",
                        backgroundColor: "var(--color-panel)",
                        borderColor: "var(--color-ink)",
                        color: "var(--color-on-panel)",
                      }}
                    >
                      {t("work.view")} →
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs no-underline underline-offset-4 hover:underline"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <ExternalLink size={13} aria-hidden="true" />
                        {t("work.live")}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
