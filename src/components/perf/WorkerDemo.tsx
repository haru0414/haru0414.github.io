import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// 工作量可調：不同機器速度差好幾倍，寫死會在慢的裝置上卡太久。
// 預設值挑「明顯感覺得到但不至於像當機」的區間
const LEVELS = [2, 4, 6, 8] as const;

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

type Result = { where: "main" | "worker"; ms: number; result: number };

export default function WorkerDemo() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<"main" | "worker" | null>(null);
  const [level, setLevel] = useState<number>(4);
  const n = level * 1_000_000;
  const [last, setLast] = useState<Result | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Vite 認得這個 new Worker(new URL(...)) 寫法，會把 worker 切成獨立 bundle
  useEffect(() => {
    const w = new Worker(new URL("./primes.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = w;
    return () => w.terminate();
  }, []);

  const runMain = () => {
    setBusy("main");
    // 讓瀏覽器先畫出「計算中」再開始阻塞，否則使用者看不到狀態變化
    requestAnimationFrame(() => {
      const t0 = performance.now();
      const result = countPrimes(n);
      setLast({ where: "main", ms: performance.now() - t0, result });
      setBusy(null);
    });
  };

  const runWorker = () => {
    const w = workerRef.current;
    if (!w) return;
    setBusy("worker");
    const t0 = performance.now();
    w.onmessage = (e: MessageEvent<{ result: number; ms: number }>) => {
      setLast({ where: "worker", ms: performance.now() - t0, result: e.data.result });
      setBusy(null);
    };
    w.postMessage(n);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col items-center gap-4 border-2 p-5"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        {/* 這個動畫由 CSS 驅動，主執行緒被佔住時會整個凍住——
            那一下的停頓就是這個 demo 要講的事 */}
        <span
          className="block h-10 w-10 rounded-full border-4 border-t-transparent"
          style={{
            borderColor: "var(--color-nekoma)",
            borderTopColor: "transparent",
            animation: "spin 0.9s linear infinite",
          }}
          aria-hidden="true"
        />
        <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
          {busy ? t(`perf.worker.busy.${busy}`) : t("perf.worker.watch")}
        </span>

        <dl className="grid w-full grid-cols-2 gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <dt>{t("perf.worker.lastRun")}</dt>
          <dd className="text-right" style={{ color: "var(--color-ink)" }}>
            {last ? t(`perf.worker.where.${last.where}`) : "—"}
          </dd>
          <dt>{t("perf.worker.elapsed")}</dt>
          <dd className="text-right tabular-nums">{last ? `${last.ms.toFixed(0)} ms` : "—"}</dd>
          <dt>{t("perf.worker.result")}</dt>
          <dd className="text-right tabular-nums">{last ? last.result.toLocaleString() : "—"}</dd>
        </dl>
      </div>

      <label className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--color-muted)" }}>
        <span className="flex justify-between">
          <span>{t("perf.worker.workload")}</span>
          <span className="tabular-nums">{n.toLocaleString()}</span>
        </span>
        <input
          type="range"
          min={LEVELS[0]}
          max={LEVELS[LEVELS.length - 1]}
          step={2}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          disabled={busy !== null}
          className="interactive w-full accent-[var(--color-nekoma)]"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {(["main", "worker"] as const).map((where) => (
          <button
            key={where}
            type="button"
            onClick={where === "main" ? runMain : runWorker}
            disabled={busy !== null}
            className="interactive border-2 px-4 py-2 text-sm transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-45"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: where === "main" ? "var(--color-nekoma)" : "var(--color-teal)",
              borderColor: "var(--color-ink)",
              color: "#fff",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t(`perf.worker.run.${where}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
