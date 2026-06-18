import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CrayonDoodle from "../components/crayon/CrayonDoodle";
import catArt from "../assets/images/onigiri/wait-cat.webp";

// 走進來的腳印：往貓的方向漸濃，暗示牠一路晃到這裡就沒路了
function PawTrail() {
  const paws = [0, 1, 2, 3, 4];
  return (
    <svg
      viewBox="0 0 240 60"
      className="pointer-events-none mx-auto mt-1 w-48"
      aria-hidden="true"
    >
      {paws.map((i) => (
        <g
          key={i}
          transform={`translate(${i * 46 + 6}, ${i % 2 ? 34 : 14})`}
          fill="var(--color-ink)"
          opacity={0.1 + i * 0.06}
        >
          <ellipse cx="10" cy="12" rx="8" ry="6.5" />
          <circle cx="2" cy="3" r="2.4" />
          <circle cx="9" cy="0.5" r="2.4" />
          <circle cx="16" cy="3" r="2.4" />
        </g>
      ))}
    </svg>
  );
}

// 404 迷路貓：做成一格漫畫分鏡，沿用全站 manga 視覺零件。
export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* 背景：淡點陣 + 斜線角落 */}
      <div className="halftone pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="diagonal-stripes pointer-events-none absolute -right-10 -top-10 h-48 w-48 rotate-12" />

      {/* 散落蠟筆塗鴉 */}
      <CrayonDoodle
        type="star"
        color="var(--color-nekoma)"
        className="absolute left-[12%] top-[16%] h-12 w-12"
        delay={300}
      />
      <CrayonDoodle
        type="sparkle"
        color="var(--color-poster)"
        className="absolute right-[14%] top-[22%] h-10 w-10"
        delay={600}
      />
      <CrayonDoodle
        type="swirl"
        color="var(--color-teal)"
        className="absolute bottom-[14%] left-[18%] h-10 w-10"
        delay={800}
      />

      {/* 漫畫分鏡 */}
      <div
        className="manga-card relative w-full max-w-xl px-6 py-10 text-center md:px-10"
        style={{ borderWidth: 4 }}
      >
        {/* 角落標籤 */}
        <span
          className="manga-tag absolute -left-3 -top-4 select-none"
          style={{
            backgroundColor: "var(--color-poster)",
            color: "var(--color-panel)",
          }}
        >
          {t("notFound.tag")}
        </span>

        {/* 大字 404（描邊） */}
        <p
          className="text-outline select-none text-7xl leading-none md:text-8xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </p>

        {/* 對話泡泡 + 迷路貓 */}
        <div className="relative mx-auto mt-6 w-fit">
          <div
            className="speech-bubble absolute -right-4 -top-6 z-10 px-3 py-2 text-xs md:-right-10"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-hidden="true"
          >
            {t("notFound.bubble")}
          </div>
          <img
            src={catArt}
            alt={t("a11y.cat")}
            width={200}
            height={200}
            draggable={false}
            className="cat-breathe w-44 select-none md:w-52"
            style={{ animationDuration: "2.6s" }}
          />
          <PawTrail />
        </div>

        <h1
          className="mt-6 text-2xl md:text-3xl"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-ink)",
          }}
        >
          {t("notFound.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          {t("notFound.desc")}
        </p>

        {/* 動作 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate("/")} className="manga-btn">
            {t("notFound.home")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border-2 px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("notFound.back")}
          </button>
        </div>
      </div>
    </main>
  );
}
