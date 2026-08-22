import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const DEBOUNCE_MS = 350;
const THROTTLE_MS = 200;

type Counts = { raw: number; debounced: number; throttled: number };
const ZERO: Counts = { raw: 0, debounced: 0, throttled: 0 };

export default function RateLimitDemo() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [counts, setCounts] = useState<Counts>(ZERO);

  const debounceTimer = useRef<number | null>(null);
  const throttleAt = useRef(0);

  useEffect(() => () => { if (debounceTimer.current) window.clearTimeout(debounceTimer.current); }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // 原始：每一次輸入都算一次「送出請求」
    setCounts((c) => ({ ...c, raw: c.raw + 1 }));

    // 防抖：停手超過 DEBOUNCE_MS 才真的送。連續打字期間一次都不送
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      setCounts((c) => ({ ...c, debounced: c.debounced + 1 }));
    }, DEBOUNCE_MS);

    // 節流：固定間隔最多送一次，打字期間仍會穩定送出
    const now = performance.now();
    if (now - throttleAt.current >= THROTTLE_MS) {
      throttleAt.current = now;
      setCounts((c) => ({ ...c, throttled: c.throttled + 1 }));
    }
  };

  const rows = [
    { key: "raw", value: counts.raw, color: "var(--color-nekoma)", note: t("perf.rate.rawNote") },
    { key: "debounced", value: counts.debounced, color: "var(--color-teal)", note: t("perf.rate.debouncedNote", { ms: DEBOUNCE_MS }) },
    { key: "throttled", value: counts.throttled, color: "var(--color-poster)", note: t("perf.rate.throttledNote", { ms: THROTTLE_MS }) },
  ];
  const max = Math.max(counts.raw, 1);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-4 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <input
          type="text"
          value={text}
          onChange={onChange}
          placeholder={t("perf.rate.placeholder")}
          className="interactive w-full border-2 px-3 py-2 text-sm"
          style={{
            fontFamily: "monospace",
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-ink)",
            color: "var(--color-ink)",
          }}
          aria-label={t("perf.rate.placeholder")}
        />

        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.key} className="flex items-center gap-2 text-[11px]">
              <span className="w-20 shrink-0" style={{ fontFamily: "monospace", color: r.color }}>
                {t(`perf.rate.${r.key}`)}
              </span>
              <span
                className="block h-2.5 flex-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 14%, transparent)" }}
              >
                <span
                  className="block h-full transition-[width] duration-200 ease-out"
                  style={{ width: `${(r.value / max) * 100}%`, backgroundColor: r.color }}
                />
              </span>
              <span className="w-10 shrink-0 text-right tabular-nums" style={{ color: "var(--color-ink)" }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[10px]" style={{ color: "var(--color-muted)" }}>
          {rows.map((r) => (
            <li key={r.key}>· {r.note}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => { setCounts(ZERO); setText(""); }}
        className="interactive self-start border-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
        style={{
          fontFamily: "var(--font-heading)",
          backgroundColor: "var(--color-poster)",
          borderColor: "var(--color-ink)",
          color: "var(--color-panel)",
          boxShadow: "var(--shadow-manga-sm)",
        }}
      >
        {t("perf.rate.reset")}
      </button>
    </div>
  );
}
