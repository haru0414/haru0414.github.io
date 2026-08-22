import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";

const TOTAL = 10000;
const ROW_H = 28;
const VIEW_H = 224;

// 資料只產生一次：兩側用的是同一份，差別只在「畫幾筆到 DOM 上」
function useRows() {
  return useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        id: i + 1,
        label: `row-${String(i + 1).padStart(5, "0")}`,
      })),
    [],
  );
}

function Row({ id, label }: { id: number; label: string }) {
  return (
    <div
      className="flex items-center gap-3 px-3 text-[11px]"
      style={{ height: ROW_H, borderBottom: "1px solid color-mix(in srgb, var(--color-ink) 10%, transparent)" }}
    >
      <span className="w-12 shrink-0 tabular-nums" style={{ color: "var(--color-muted)" }}>
        #{id}
      </span>
      <span style={{ fontFamily: "monospace" }}>{label}</span>
    </div>
  );
}

function Pane({
  title,
  accent,
  nodes,
  ms,
  children,
  footer,
  onScroll,
}: {
  title: string;
  accent: string;
  nodes: number | null;
  ms: number | null;
  children: ReactNode;
  footer?: ReactNode;
  onScroll?: (top: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-heading)", color: accent }}>
        {title}
      </span>
      <div
        className="overflow-y-auto overscroll-contain border-2"
        style={{ height: VIEW_H, backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
        onScroll={onScroll ? (e) => onScroll(e.currentTarget.scrollTop) : undefined}
      >
        {children}
      </div>
      <dl className="grid grid-cols-2 gap-x-2 text-[11px]" style={{ color: "var(--color-muted)" }}>
        <dt>{t("perf.virtual.nodes")}</dt>
        <dd className="text-right tabular-nums" style={{ color: accent }}>
          {nodes === null ? "—" : nodes.toLocaleString()}
        </dd>
        <dt>{t("perf.virtual.firstPaint")}</dt>
        <dd className="text-right tabular-nums">{ms === null ? "—" : `${ms.toFixed(0)} ms`}</dd>
      </dl>
      {footer}
    </div>
  );
}

export default function VirtualDemo() {
  const { t } = useTranslation();
  const rows = useRows();
  const [renderAll, setRenderAll] = useState(false);
  const [allMs, setAllMs] = useState<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // 虛擬捲動：只畫可視範圍前後各多留兩筆當緩衝
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - 2);
  const visible = rows.slice(start, start + Math.ceil(VIEW_H / ROW_H) + 4);

  // flushSync 逼 React 同步畫完 10,000 筆，回來才量得到真正的首次渲染耗時
  const paintAll = () => {
    const t0 = performance.now();
    flushSync(() => setRenderAll(true));
    setAllMs(performance.now() - t0);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Pane
          title={t("perf.virtual.allTitle")}
          accent="var(--color-nekoma)"
          nodes={renderAll ? TOTAL : null}
          ms={allMs}
          footer={
            renderAll ? null : (
              <button
                type="button"
                onClick={paintAll}
                className="interactive self-start border-2 px-3 py-1.5 text-[11px] transition-transform hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-poster)",
                  borderColor: "var(--color-ink)",
                  color: "var(--color-panel)",
                }}
              >
                {t("perf.virtual.paintAll", { n: TOTAL.toLocaleString() })}
              </button>
            )
          }
        >
          {renderAll ? (
            rows.map((r) => <Row key={r.id} {...r} />)
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-[11px]" style={{ color: "var(--color-muted)" }}>
              {t("perf.virtual.allIdle")}
            </div>
          )}
        </Pane>

        <Pane
          title={t("perf.virtual.virtualTitle")}
          accent="var(--color-teal)"
          nodes={visible.length}
          ms={0}
          onScroll={setScrollTop}
        >
          {/* 撐出完整高度讓捲軸正確，實際只畫可視那幾筆 */}
          <div style={{ height: rows.length * ROW_H }}>
            <div style={{ transform: `translateY(${start * ROW_H}px)` }}>
              {visible.map((r) => (
                <Row key={r.id} {...r} />
              ))}
            </div>
          </div>
        </Pane>
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
        {t("perf.virtual.note")}
      </p>
    </div>
  );
}

