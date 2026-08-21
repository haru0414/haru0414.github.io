import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";

// 刻意慢的運算：計算 n 以內的質數個數。用試除法而非篩法，
// 才有足夠的耗時讓 useMemo 的差異在畫面上看得出來。
function countPrimes(n: number) {
  let count = 0;
  for (let i = 2; i <= n; i++) {
    let prime = true;
    for (let d = 2; d * d <= i; d++) {
      if (i % d === 0) {
        prime = false;
        break;
      }
    }
    if (prime) count++;
  }
  return count;
}

// 受測元件。memoOn 決定同一份運算走不走 useMemo 快取。
function Heavy({ n, memoOn, tick }: { n: number; memoOn: boolean; tick: number }) {
  const { t } = useTranslation();
  const memoResult = useMemo(() => (memoOn ? countPrimes(n) : 0), [n, memoOn]);
  const result = memoOn ? memoResult : countPrimes(n);

  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs" style={{ color: "var(--color-muted)" }}>
      <dt>{t("perf.memo.result")}</dt>
      <dd className="text-right tabular-nums">{result.toLocaleString()}</dd>
      <dt>{t("perf.memo.renderNo")}</dt>
      <dd className="text-right tabular-nums">#{tick}</dd>
    </dl>
  );
}

export default function MemoDemo() {
  const { t } = useTranslation();
  const [n, setN] = useState(40000);
  const [memoOn, setMemoOn] = useState(true);
  const [tick, setTick] = useState(0);
  const [best, setBest] = useState<{ on: number | null; off: number | null }>({ on: null, off: null });
  const [last, setLast] = useState<number | null>(null);

  // 全部在事件處理函式裡完成：flushSync 會逼 React 同步跑完這次重新渲染，
  // 回來時才計時，量到的就是含運算在內的實際渲染耗時。
  // 不在 render 期間呼叫 performance.now()，production 也有效——
  // React 的 <Profiler> 在正式建置會被移除，量不到東西。
  const measure = () => {
    const t0 = performance.now();
    flushSync(() => setTick((v) => v + 1));
    const ms = performance.now() - t0;
    setLast(ms);
    setBest((prev) => ({ ...prev, [memoOn ? "on" : "off"]: ms }));
  };

  const rows = [
    { label: "useMemo ON", value: best.on, color: "var(--color-teal)" },
    { label: "useMemo OFF", value: best.off, color: "var(--color-nekoma)" },
  ];
  // 基準取兩者最大值：先前用 best.off 當分母，OFF 還沒量過時 ON 會畫成滿格，
  // 之後 OFF 一有值分母就跳動，長條看起來像亂縮
  const scale = Math.max(best.on ?? 0, best.off ?? 0, 0.1);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <p className="m-0 text-3xl tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
          {last === null ? "—" : last.toFixed(1)}
          <span className="ml-1 text-sm" style={{ color: "var(--color-muted)" }}>
            ms
          </span>
          <span className="ml-2 text-xs" style={{ color: "var(--color-muted)" }}>
            {t("perf.memo.lastRender")}
          </span>
        </p>

        <div className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2 text-[11px]">
              <span className="w-24 shrink-0" style={{ fontFamily: "monospace", color: r.color }}>
                {r.label}
              </span>
              {/* 軌道用半透明色而非 opacity：opacity 會連同裡面的填色條一起
                  變淡，寬度差異就被淹沒成一條淡淡的滿版 */}
              <span
                className="block h-2 flex-1"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 14%, transparent)" }}
              >
                <span
                  className="block h-full transition-[width] duration-500 ease-out"
                  style={{
                    width: r.value === null ? "0%" : `${Math.max(2, (r.value / scale) * 100)}%`,
                    backgroundColor: r.color,
                  }}
                />
              </span>
              <span className="w-16 shrink-0 text-right tabular-nums" style={{ color: "var(--color-muted)" }}>
                {r.value === null ? "—" : `${r.value.toFixed(1)} ms`}
              </span>
            </div>
          ))}
        </div>

        <Heavy n={n} memoOn={memoOn} tick={tick} />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--color-muted)" }}>
          <span className="flex justify-between">
            <span>{t("perf.memo.range")}</span>
            <span className="tabular-nums">{n.toLocaleString()}</span>
          </span>
          <input
            type="range"
            min={10000}
            max={80000}
            step={10000}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="interactive w-full accent-[var(--color-nekoma)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {/* 兩段式而非切換鈕：單一按鈕寫「useMemo ON」會分不清是
              「目前是 ON」還是「按了變 ON」 */}
          <div
            className="flex border-2"
            style={{ borderColor: "var(--color-ink)" }}
            role="group"
            aria-label="useMemo"
          >
            <span
              className="px-2.5 py-2 text-[11px]"
              style={{
                fontFamily: "monospace",
                backgroundColor: "var(--color-panel)",
                color: "var(--color-paper)",
              }}
            >
              useMemo
            </span>
            {([true, false] as const).map((on) => (
              <button
                key={String(on)}
                type="button"
                onClick={() => setMemoOn(on)}
                aria-pressed={memoOn === on}
                className="interactive px-3 py-2 text-[11px] transition-colors"
                style={{
                  fontFamily: "monospace",
                  backgroundColor:
                    memoOn === on ? (on ? "var(--color-teal)" : "var(--color-nekoma)") : "transparent",
                  color: memoOn === on ? "#fff" : "var(--color-muted)",
                }}
              >
                {on ? "ON" : "OFF"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={measure}
            className="interactive border-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-poster)",
              borderColor: "var(--color-ink)",
              color: "var(--color-panel)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("perf.memo.rerender")}
          </button>
        </div>
      </div>
    </div>
  );
}
