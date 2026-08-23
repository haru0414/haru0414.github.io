import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const BOXES = 1400;

type Mode = "batched" | "thrashing";

export default function LayoutCostDemo() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("batched");
  const [running, setRunning] = useState(false);
  const [frameMs, setFrameMs] = useState<number | null>(null);
  const boxesRef = useRef<HTMLDivElement>(null);

  // 直接操作 DOM 而非走 React state：這個 demo 要量的是瀏覽器處理版面的
  // 成本，不該被 React 的重新渲染成本混進來
  useEffect(() => {
    if (!running) return;
    const root = boxesRef.current;
    if (!root) return;
    const els = Array.from(root.children) as HTMLElement[];
    let raf = 0;
    let t = 0;

    // 量每一幀「寫入樣式 + 瀏覽器完成版面計算」的耗時。
    // 不量 FPS：rAF 的節奏可能被瀏覽器或環境固定住，跟實際成本脫鉤
    let acc = 0;
    let frames = 0;
    let reportAt = performance.now();

    const step = () => {
      const t0 = performance.now();
      t += 0.03;

      // 兩種模式做的事完全一樣：都把每個方塊的 margin 改掉、也都讀了版面。
      // 差別只在「讀寫的順序」
      if (mode === "thrashing") {
        els.forEach((el, i) => {
          el.style.marginLeft = `${Math.sin(t + i * 0.12) * 40 + 40}px`;
          // 寫完立刻讀 → 瀏覽器必須當場把版面算完才能回答，
          // 於是這一幀就同步重排了 N 次
          void el.offsetHeight;
        });
      } else {
        els.forEach((el, i) => {
          el.style.marginLeft = `${Math.sin(t + i * 0.12) * 40 + 40}px`;
        });
        // 全部寫完才讀一次 → 瀏覽器只需要重排一次
        void root.offsetHeight;
      }

      acc += performance.now() - t0;
      frames += 1;
      const now = performance.now();
      if (now - reportAt >= 400) {
        setFrameMs(acc / frames);
        acc = 0;
        frames = 0;
        reportAt = now;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      els.forEach((el) => {
        el.style.marginLeft = "";
      });
    };
  }, [running, mode]);

  // 一幀的預算約 16ms（60Hz）。超過就代表這個動畫撐不住流暢
  const good = frameMs !== null && frameMs < 8;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-2xl tabular-nums"
            style={{ fontFamily: "var(--font-heading)", color: good ? "var(--color-teal)" : "var(--color-nekoma)" }}
          >
            {frameMs === null ? "—" : frameMs.toFixed(1)}
            <span className="ml-1 text-xs" style={{ color: "var(--color-muted)" }}>
              {t("perf.layout.perFrame")}
            </span>
          </span>
          <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
            {t("perf.layout.boxes", { n: BOXES })}
          </span>
        </div>

        <div ref={boxesRef} className="relative flex h-40 flex-wrap content-start gap-px overflow-hidden">
          {Array.from({ length: BOXES }, (_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5"
              style={{ backgroundColor: i % 4 === 0 ? "var(--color-nekoma)" : "var(--color-teal)", opacity: 0.75 }}
            />
          ))}
        </div>
      </div>

      {/* 免責說明：切到讀寫交錯後整頁會明顯卡頓，先講清楚那是預期行為，
          使用者才不會以為頁面壞了或按不到停止 */}
      <p
        className="m-0 border-l-2 pl-3 text-[11px] leading-relaxed"
        style={{ borderColor: "var(--color-poster)", color: "var(--color-muted)" }}
      >
        {t("perf.layout.warning")}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex border-2" style={{ borderColor: "var(--color-ink)" }} role="group">
          {(["batched", "thrashing"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className="interactive px-3 py-2 text-[11px] transition-colors"
              style={{
                fontFamily: "monospace",
                backgroundColor:
                  mode === m ? (m === "batched" ? "var(--color-teal)" : "var(--color-nekoma)") : "transparent",
                color: mode === m ? "#fff" : "var(--color-muted)",
              }}
            >
              {t(`perf.layout.mode.${m}`)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="interactive border-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: running ? "var(--color-nekoma)" : "var(--color-poster)",
            borderColor: "var(--color-ink)",
            color: running ? "#fff" : "var(--color-panel)",
            boxShadow: "var(--shadow-manga-sm)",
          }}
        >
          {t(running ? "perf.layout.stop" : "perf.layout.start")}
        </button>
      </div>
    </div>
  );
}
