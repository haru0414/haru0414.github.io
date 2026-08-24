import { useState } from "react";
import { useTranslation } from "react-i18next";

// 手機直式截圖的展示：左邊一支大畫面，右邊是該畫面的標題與說明，
// 底下的縮圖列可切換。文案取 i18n 的 projects.<projectId>.shots.<i>.{label,desc}
// 機身色固定不跟主題走：--color-ink 在深色模式是米白，套在機身上會跟
// 截圖本身的淺色底融成一片，整支手機就消失了
const BEZEL = "#17181c";

export default function PhoneGallery({
  projectId,
  title,
  screenshots,
  accent,
}: {
  projectId: string;
  title: string;
  screenshots: string[];
  accent: string;
}) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const key = (i: number, field: "label" | "desc") =>
    `projects.${projectId}.shots.${i}.${field}`;

  return (
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
        SCREENS
      </span>

      <div
        className="border-2 p-5 md:p-8"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-ink)",
          boxShadow: "4px 4px 0 0 var(--color-ink)",
        }}
      >
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-10">
          {/* 機身外框。截圖本身已含狀態列與 Dynamic Island，這裡只補機身邊框。
              外圈再描一道 ink，深色底上才有輪廓；硬陰影用專案色撐出立體 */}
          <div
            className="w-[210px] shrink-0 self-start overflow-hidden rounded-[2rem] border-[6px]"
            style={{
              borderColor: BEZEL,
              backgroundColor: BEZEL,
              boxShadow: `0 0 0 2px var(--color-ink), 8px 8px 0 0 ${accent}`,
            }}
          >
            <img
              key={active}
              src={screenshots[active]}
              alt={`${title} — ${t(key(active, "label"))}`}
              width={720}
              height={1559}
              decoding="async"
              className="rise-in block h-auto w-full rounded-[1.6rem]"
            />
          </div>

          {/* 目前畫面的標題與說明；縮圖列壓在同一欄底部，避免右側留下大片空白 */}
          <div className="flex w-full flex-1 flex-col">
            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl leading-none opacity-25"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <h2
                className="m-0 text-2xl"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-nekoma)",
                }}
              >
                {t(key(active, "label"))}
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-gray-700">
              {t(key(active, "desc"))}
            </p>

            <div
              className="mt-8 flex gap-3 overflow-x-auto pt-5 md:mt-auto"
              style={{ borderTop: "2px solid var(--color-ink)" }}
            >
              {screenshots.map((src, i) => {
                const on = i === active;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={t(key(i, "label"))}
                    className="interactive w-16 shrink-0 overflow-hidden border-2 transition-transform hover:-translate-y-0.5"
                    style={{
                      borderColor: on
                        ? "var(--color-nekoma)"
                        : "var(--color-ink)",
                      opacity: on ? 1 : 0.5,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      width={720}
                      height={1559}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
