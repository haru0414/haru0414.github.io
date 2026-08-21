import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Row } from "./DataRow";

type RowComp = typeof import("./DataRow")["default"];

const BATCH = 12;
const TOTAL = 60;
const NAMES = ["build", "prerender", "optimize-images", "lint", "typecheck", "deploy", "purge-cache", "sitemap"];

// 產生決定性的假資料：用索引推導而非 Math.random，
// 才不會每次 render 都變一組數字
function makeBatch(from: number): Row[] {
  return Array.from({ length: Math.min(BATCH, TOTAL - from) }, (_, i) => {
    const id = from + i + 1;
    return {
      id,
      name: `${NAMES[id % NAMES.length]}-${String(id).padStart(3, "0")}`,
      status: id % 7 === 0 ? "queued" : id % 3 === 0 ? "running" : "done",
      ms: 40 + ((id * 37) % 260),
    };
  });
}

export default function LazyDemo() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Row[]>([]);
  const [Row, setRowComp] = useState<RowComp | null>(null);
  const [loading, setLoading] = useState(false);
  const [moduleMs, setModuleMs] = useState<number | null>(null);
  const [round, setRound] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef(0);
  rowsRef.current = rows.length;
  // 防重入：觀察器會在載入完成前重複觸發，沒有這道保護會同時跑好幾批
  const busyRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    // 第一批要先把列渲染元件抓下來——它是獨立 chunk，不在主 bundle 裡
    if (!Row) {
      const start = performance.now();
      const mod = await import("./DataRow");
      setModuleMs(performance.now() - start);
      setRowComp(() => mod.default);
    }
    // 模擬後端回應延遲
    await new Promise((r) => setTimeout(r, 420));
    setRows((prev) => [...prev, ...makeBatch(prev.length)]);
    setLoading(false);
    busyRef.current = false;
  }, [Row]);

  // 觀察範圍限定在捲動容器內（root: 容器本身），不是整頁視窗，
  // demo 因此自足——不必等使用者剛好把頁面捲到某個位置
  useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && rowsRef.current < TOTAL) void loadMore();
      },
      { root, rootMargin: "80px", threshold: 0 },
    );
    ob.observe(target);
    return () => ob.disconnect();
  }, [loadMore, rows.length, round]);

  const reset = () => {
    setRows([]);
    setRowComp(null);
    setModuleMs(null);
    setLoading(false);
    busyRef.current = false;
    scrollRef.current?.scrollTo({ top: 0 });
    setRound((v) => v + 1);
  };

  const atEnd = rows.length >= TOTAL;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto overscroll-contain border-2"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <ul className="m-0 p-0">
          {Row
            ? rows.map((r, i) => <Row key={r.id} row={r} index={i} />)
            : null}
        </ul>

        <div ref={sentinelRef} className="flex h-16 items-center justify-center px-3 text-[11px]">
          {atEnd ? (
            <span style={{ color: "var(--color-muted)" }}>{t("perf.lazy.end", { n: TOTAL })}</span>
          ) : loading ? (
            <span className="animate-pulse" style={{ color: "var(--color-muted)" }}>
              {t("perf.lazy.loading")}
            </span>
          ) : (
            <span style={{ color: "var(--color-nekoma)" }}>{t("perf.lazy.scrollPrompt")} ↓</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reset}
          disabled={loading}
          className="interactive border-2 px-4 py-2 text-sm transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-45"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-poster)",
            borderColor: "var(--color-ink)",
            color: "var(--color-panel)",
            boxShadow: "var(--shadow-manga-sm)",
          }}
        >
          {t("perf.lazy.reset")}
        </button>

        <span className="text-xs tabular-nums" style={{ color: "var(--color-muted)" }}>
          {t("perf.lazy.count", { n: rows.length, total: TOTAL })}
          {moduleMs !== null ? ` · ${t("perf.lazy.elapsed", { ms: moduleMs.toFixed(0) })}` : ""}
        </span>
      </div>
    </div>
  );
}
