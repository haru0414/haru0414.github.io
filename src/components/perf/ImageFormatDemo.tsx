import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// 直接用 /surf 那批實際上線的素材，不是為了教學另外做的範例圖
const urls = import.meta.glob("../../assets/images/surf/s6-surface-*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const pick = (name: string) =>
  Object.entries(urls).find(([p]) => p.endsWith(name))?.[1] ?? "";

const VARIANTS = [
  { key: "avif1920", label: "AVIF", width: 1920, url: pick("s6-surface-1920.avif") },
  { key: "webp1920", label: "WebP", width: 1920, url: pick("s6-surface-1920.webp") },
  { key: "avif768", label: "AVIF", width: 768, url: pick("s6-surface-768.avif") },
  { key: "webp768", label: "WebP", width: 768, url: pick("s6-surface-768.webp") },
];

export default function ImageFormatDemo() {
  const { t } = useTranslation();
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState(VARIANTS[0]?.url ?? "");

  // 實際抓下來量位元組，不是寫死的數字
  useEffect(() => {
    let alive = true;
    Promise.all(
      VARIANTS.map(async (v) => {
        if (!v.url) return [v.key, 0] as const;
        const r = await fetch(v.url);
        const blob = await r.blob();
        return [v.key, blob.size] as const;
      }),
    ).then((pairs) => {
      if (alive) setSizes(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, []);

  const max = Math.max(...Object.values(sizes), 1);
  const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <div className="aspect-[3/2] overflow-hidden border-2" style={{ borderColor: "color-mix(in srgb, var(--color-ink) 25%, transparent)" }}>
          {preview ? (
            <img
              src={preview}
              alt={t("perf.image.alt")}
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          {VARIANTS.map((v) => {
            const size = sizes[v.key];
            const active = preview === v.url;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setPreview(v.url)}
                className="interactive flex items-center gap-2 text-left text-[11px]"
                aria-pressed={active}
              >
                <span
                  className="w-24 shrink-0"
                  style={{
                    fontFamily: "monospace",
                    color: active ? "var(--color-nekoma)" : "var(--color-muted)",
                  }}
                >
                  {v.label} {v.width}
                </span>
                <span
                  className="block h-2.5 flex-1"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 14%, transparent)" }}
                >
                  <span
                    className="block h-full transition-[width] duration-500 ease-out"
                    style={{
                      width: size ? `${(size / max) * 100}%` : "0%",
                      backgroundColor: v.label === "AVIF" ? "var(--color-teal)" : "var(--color-nekoma)",
                    }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right tabular-nums" style={{ color: "var(--color-ink)" }}>
                  {size ? kb(size) : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
        {t("perf.image.note")}
      </p>
    </div>
  );
}
