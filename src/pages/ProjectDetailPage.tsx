import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

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
          <button onClick={() => navigate("/")} className="underline">
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
        backgroundColor: "var(--color-paper)",
        color: "var(--color-ink)",
      }}
    >
      {/* Halftone bg */}
      <div className="absolute inset-0 z-0 opacity-5 halftone" />

      <div
        className={`relative z-10 container mx-auto px-4 py-12 max-w-4xl transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
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
                backgroundColor: "var(--color-teal)",
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
                borderColor: "var(--color-ink)",
              }}
            >
              {project.year}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl mt-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: project.color }}
          >
            {project.title}
          </h1>
        </div>

        {/* Live Preview Browser Mockup */}
        {project.liveUrl && (
          <div className="mb-10">
            <div
              className="absolute -top-3 -left-3 px-3 py-1 text-sm text-white border-2 relative inline-block mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-teal)",
                borderColor: "var(--color-ink)",
                boxShadow: "2px 2px 0 0 var(--color-ink)",
              }}
            >
              LIVE PREVIEW
            </div>
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
                  backgroundColor: "var(--color-ink)",
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
                  title="在新分頁開啟"
                >
                  ↗
                </a>
              </div>
              {/* Preview area */}
              <div
                className="relative flex flex-col items-center justify-center gap-6"
                style={{
                  height: "300px",
                  backgroundColor: "var(--color-paper)",
                }}
              >
                {/* Grid decoration */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--color-ink) 1px, transparent 1px),
                      linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* Halftone dots */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "6px 6px",
                  }}
                />
                <div className="relative z-10 text-center">
                  <p
                    className="text-5xl mb-2 opacity-20"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    NDAY
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    網站安全政策不允許嵌入預覽
                  </p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 text-sm text-white border-2 transition-all hover:-translate-y-1 inline-block"
                    style={{
                      fontFamily: "var(--font-heading)",
                      backgroundColor: "var(--color-ink)",
                      borderColor: "var(--color-ink)",
                      boxShadow: "4px 4px 0 0 var(--color-teal)",
                    }}
                  >
                    VISIT SITE →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.screenshots.map((src, i) => (
              <div
                key={i}
                className="border-2 overflow-hidden"
                style={{
                  borderColor: "var(--color-ink)",
                  boxShadow: "4px 4px 0 0 var(--color-ink)",
                }}
              >
                <img
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {project.fullDesc && (
          <div
            className="mb-10 p-6 border-2 relative"
            style={{
              borderColor: "var(--color-ink)",
              boxShadow: "4px 4px 0 0 var(--color-ink)",
              backgroundColor: "white",
            }}
          >
            <div
              className="absolute -top-3 -left-3 px-3 py-1 text-sm text-white border-2"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-nekoma)",
                borderColor: "var(--color-ink)",
                boxShadow: "2px 2px 0 0 var(--color-ink)",
              }}
            >
              DETAIL
            </div>
            <p className="leading-relaxed text-gray-700 mt-2">
              {project.fullDesc}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        <div
          className="mb-10 p-6 border-2"
          style={{
            backgroundColor: "var(--color-ink)",
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
                  backgroundColor: "var(--color-nekoma)",
                  borderColor: "var(--color-ink)",
                  boxShadow: "4px 4px 0 0 var(--color-ink)",
                }}
              >
                LIVE DEMO →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
