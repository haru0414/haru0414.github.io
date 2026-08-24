import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import PhoneGallery from "../components/ui/PhoneGallery";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const index = projects.findIndex((p) => p.id === id);
  const project = index >= 0 ? projects[index] : undefined;
  // 上一篇 / 下一篇（環狀：最後一篇接回第一篇，方便連續瀏覽）
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const backToList = () => navigate("/", { state: { scrollTo: "episodes" } });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-4xl mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            404
          </p>
          <button onClick={backToList} className="underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >
      {/* Halftone bg */}
      <div className="absolute inset-0 z-0 opacity-5 halftone" />

      {/* 進場動畫改用純 CSS 並以 id 當 key：切換上一篇/下一篇時元素重建，
          動畫自然重播。原本用 state + setTimeout 需要在 effect 裡 setState，
          那既多一次渲染也違反 React 規則。捲動歸零已由 App 的 ScrollToTop 處理 */}
      <div
        key={id}
        className="rise-in relative z-10 container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* Back Button */}
        <button
          onClick={backToList}
          className="mb-8 flex items-center gap-2 px-4 py-2 border-2 text-sm transition-all hover:translate-x-1"
          style={{
            fontFamily: "var(--font-heading)",
            borderColor: "var(--color-ink)",
            boxShadow: "3px 3px 0 0 var(--color-ink)",
          }}
        >
          ← BACK
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-4 flex-wrap">
            <span
              className="px-3 py-1 text-xs text-white border"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-badge-teal)",
                borderColor: "var(--color-ink)",
              }}
            >
              VOL. {project.id}
            </span>
            <span
              className="px-3 py-1 text-xs border"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-poster)",
                color: "var(--color-on-poster)",
                borderColor: "var(--color-ink)",
              }}
            >
              {project.year}
            </span>
            {project.side && (
              <span
                className="px-3 py-1 text-xs border"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-ink)",
                }}
              >
                {t("work.side")}
              </span>
            )}
          </div>

          <h1
            className="text-4xl md:text-6xl mt-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: project.color }}
          >
            {project.title}
            <span className="sr-only"> — {project.year} | Haru Li</span>
          </h1>
        </div>

        {/* Live Preview Browser Mockup */}
        {project.liveUrl && (
          <div className="mb-10">
            <span
              className="inline-block px-3 py-1 text-sm text-white border-2 mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-badge-teal)",
                borderColor: "var(--color-ink)",
                boxShadow: "2px 2px 0 0 var(--color-ink)",
              }}
            >
              LIVE PREVIEW
            </span>
            <div
              className="border-2 overflow-hidden"
              style={{
                borderColor: "var(--color-ink)",
                boxShadow: "4px 4px 0 0 var(--color-ink)",
              }}
            >
              {/* Browser Chrome */}
              <div
                className="flex items-center gap-3 px-4 py-2 border-b-2"
                style={{
                  backgroundColor: "var(--color-panel)",
                  borderColor: "var(--color-ink)",
                }}
              >
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div
                  className="flex-1 px-3 py-1 text-xs text-white/80 rounded font-mono truncate"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  {project.liveUrl}
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-white/60 hover:text-white transition-colors text-sm"
                  title={t("detail.openNewTab")}
                >
                  ↗
                </a>
              </div>

              {/* Screenshots or placeholder */}
              {project.screenshots && project.screenshots.length > 0 ? (
                <div
                  className="divide-y-2"
                  style={{ borderColor: "var(--color-ink)" }}
                >
                  {project.screenshots.map((shot, i) => (
                    <img
                      key={i}
                      src={shot.src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      width={shot.w}
                      height={shot.h}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    height: "220px",
                    backgroundColor: "var(--color-paper)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <p
                    className="relative text-4xl opacity-10"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {project.title}
                  </p>
                </div>
              )}

              {/* Hint + Button */}
              <div
                className="flex items-center justify-between gap-4 px-5 py-4 border-t-2"
                style={{
                  borderColor: "var(--color-ink)",
                  backgroundColor: "var(--color-paper)",
                }}
              >
                <p className="text-xs text-gray-500 leading-relaxed">
                  {project.screenshots && project.screenshots.length > 0
                    ? t("detail.hintScreenshot")
                    : t("detail.hintEmbed")}
                </p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-5 py-2 text-sm text-white border-2 transition-all hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundColor: "var(--color-panel)",
                    borderColor: "var(--color-ink)",
                    boxShadow: "3px 3px 0 0 var(--color-teal)",
                  }}
                >
                  VISIT SITE →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Screenshots (for projects without liveUrl)。手機直式截圖的長寬比與網站截圖
            差太多，硬套兩欄會被拉成細長條，所以另走一組可切換的手機畫廊 */}
        {!project.liveUrl &&
          project.screenshots &&
          project.screenshots.length > 0 &&
          (project.portrait ? (
            <PhoneGallery
              projectId={project.id}
              title={project.title}
              screenshots={project.screenshots}
              accent={project.color}
            />
          ) : (
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.screenshots.map((shot, i) => (
                <div
                  key={i}
                  className="border-2 overflow-hidden"
                  style={{
                    borderColor: "var(--color-ink)",
                    boxShadow: "4px 4px 0 0 var(--color-ink)",
                  }}
                >
                  <img
                    src={shot.src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={shot.w}
                    height={shot.h}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          ))}

        {/* Description */}
        <div
          className="mb-10 p-6 border-2 relative"
          style={{
            borderColor: "var(--color-ink)",
            boxShadow: "4px 4px 0 0 var(--color-ink)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div
            className="absolute -top-3 -left-3 px-3 py-1 text-sm text-white border-2"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-badge-red)",
              borderColor: "var(--color-ink)",
              boxShadow: "2px 2px 0 0 var(--color-ink)",
            }}
          >
            DETAIL
          </div>
          {/* 問題 / 做法 / 結果。沒有量化成果可寫的專案就不渲染結果段——
              留一個空標題或「持續優化中」之類的佔位比沒有更糟 */}
          <div className="mt-2 flex flex-col gap-5">
            {(["problem", "approach", "result"] as const).map((key) => {
              const k = `projects.${project.id}.${key}`;
              // i18next 找不到 key 時原樣回傳 key，用這個判斷這一段存不存在
              const body = t(k);
              if (body === k) return null;
              return (
                <section key={key}>
                  <h2
                    className="mb-2 text-lg"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-poster)",
                    }}
                  >
                    {t(`projects.labels.${key}`)}
                  </h2>
                  <p className="leading-relaxed text-gray-700">{body}</p>
                </section>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div
          className="mb-10 p-6 border-2"
          style={{
            backgroundColor: "var(--color-panel)",
            borderColor: "var(--color-ink)",
            boxShadow: "4px 4px 0 0 rgba(0,0,0,0.3)",
          }}
        >
          <span
            className="text-xl mr-4 block mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-poster)",
            }}
          >
            TECH STACK //
          </span>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 border text-sm text-white"
                style={{
                  fontFamily: "var(--font-heading)",
                  borderColor: "white",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex gap-4 flex-wrap">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 text-sm transition-all hover:translate-x-1 hover:translate-y-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "4px 4px 0 0 var(--color-ink)",
                }}
              >
                GITHUB →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 text-sm text-white transition-all hover:translate-x-1 hover:translate-y-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-badge-red)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "4px 4px 0 0 var(--color-ink)",
                }}
              >
                LIVE DEMO →
              </a>
            )}
          </div>
        )}

        {/* 上一篇 / 下一篇導覽 */}
        <nav
          className="mt-14 pt-6 border-t-2 flex items-stretch justify-between gap-4"
          style={{ borderColor: "var(--color-ink)" }}
          aria-label={t("detail.pager")}
        >
          <button
            onClick={() => navigate(`/project/${prev.id}`)}
            className="group min-w-0 flex-1 text-left px-4 py-3 border-2 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-ink)",
              boxShadow: "3px 3px 0 0 var(--color-ink)",
            }}
          >
            <span
              className="block text-xs opacity-60"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ← PREV / VOL. {prev.id}
            </span>
            <span className="block text-sm font-bold mt-0.5 truncate">
              {prev.title}
            </span>
          </button>
          <button
            onClick={() => navigate(`/project/${next.id}`)}
            className="group min-w-0 flex-1 text-right px-4 py-3 border-2 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-ink)",
              boxShadow: "3px 3px 0 0 var(--color-ink)",
            }}
          >
            <span
              className="block text-xs opacity-60"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              NEXT / VOL. {next.id} →
            </span>
            <span className="block text-sm font-bold mt-0.5 truncate">
              {next.title}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
