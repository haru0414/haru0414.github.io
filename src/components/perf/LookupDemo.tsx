import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Order = { id: number; userId: number; total: number };
type User = { id: number; name: string };

const SIZES = [500, 2000, 5000] as const;

function makeData(n: number) {
  const users: User[] = Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `user-${i + 1}` }));
  const orders: Order[] = Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    // 刻意讓要找的人分散在整個陣列，find 平均得掃過一半
    userId: ((i * 7919) % n) + 1,
    total: 100 + ((i * 37) % 900),
  }));
  return { users, orders };
}

type Result = { ms: number; ops: number };

// 示意動畫用的縮小版：12 位使用者、依序要找其中幾位。
// 數字只說明「差多少」，這段是用來說明「為什麼會差」
const CELLS = 12;
const TARGETS = [8, 3, 11, 5];

// 定義在模組層級：寫在元件內部的話每次 render 都是新的元件型別，
// React 會整個重建、內部狀態也會重置
function ScanRow({
  label,
  color,
  lit,
  note,
  target,
}: {
  label: string;
  color: string;
  lit: (i: number) => boolean;
  note: string;
  target: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span className="shrink-0 text-[10px] sm:w-24" style={{ fontFamily: "monospace", color }}>
          {label}
        </span>
        <div className="flex flex-1 gap-0.5">
          {Array.from({ length: CELLS }, (_, i) => (
            <span
              key={i}
              className="h-5 flex-1 transition-colors duration-150"
              style={{
                backgroundColor: lit(i)
                  ? color
                  : i === target
                    ? "color-mix(in srgb, var(--color-ink) 22%, transparent)"
                    : "color-mix(in srgb, var(--color-ink) 8%, transparent)",
              }}
            />
          ))}
        </div>
      </div>
      <span className="text-[10px] sm:pl-[6.5rem]" style={{ color: "var(--color-muted)" }}>
        {note}
      </span>
    </div>
  );
}

// 把原理直接攤開：光看長條圖只知道「差多少」，看不出「為什麼」
const SNIPPETS = [
  {
    key: "find",
    color: "var(--color-nekoma)",
    lines: [
      "orders.map(o =>",
      "  users.find(",
      "    u => u.id === o.userId",
      "  )",
      ")",
    ],
  },
  {
    key: "map",
    color: "var(--color-teal)",
    lines: [
      "const index = new Map(",
      "  users.map(u => [u.id, u])",
      ")",
      "orders.map(o =>",
      "  index.get(o.userId)",
      ")",
    ],
  },
] as const;

function CodeCompare() {
  const { t } = useTranslation();
  return (
    // 用容器查詢而非視窗斷點：這塊的可用寬度取決於外層 demo 欄，
    // 而那一欄的寬度隨文章版面變化。用 lg/xl 這類視窗斷點總會在某個
    // 尺寸剛好切成兩欄卻不夠寬（1024 就是這樣被截斷的）
    <div className="@3xl:grid-cols-2 grid gap-3">
      {SNIPPETS.map(({ key, color, lines }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <span className="text-[10px]" style={{ fontFamily: "monospace", color }}>
            {t(`perf.lookup.${key}`)}
          </span>
          <pre
            className="m-0 overflow-x-auto border-2 p-2.5 text-[10px] leading-relaxed"
            style={{
              fontFamily: "monospace",
              backgroundColor: "var(--color-bg)",
              borderColor: "color-mix(in srgb, var(--color-ink) 20%, transparent)",
            }}
          >
            {lines.join("\n")}
          </pre>
          <span className="text-[10px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {t(`perf.lookup.${key}Why`)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScanIllustration() {
  const { t } = useTranslation();
  const [order, setOrder] = useState(0);
  const [scan, setScan] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setScan((s) => {
        const target = TARGETS[order];
        if (s < target) return s + 1;
        // 掃到目標就換下一筆訂單，重新從頭開始掃
        setOrder((o) => (o + 1) % TARGETS.length);
        return 0;
      });
    }, 170);
    return () => window.clearInterval(id);
  }, [order]);

  const target = TARGETS[order];

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-[11px]" style={{ color: "var(--color-muted)" }}>
        {t("perf.lookup.scanTitle", { id: target + 1 })}
      </p>
      <ScanRow
        label="map + find"
        color="var(--color-nekoma)"
        target={target}
        lit={(i) => i <= scan}
        note={t("perf.lookup.scanFind", { n: scan + 1 })}
      />
      <ScanRow
        label="Map index"
        color="var(--color-teal)"
        target={target}
        lit={(i) => i === target}
        note={t("perf.lookup.scanMap")}
      />
    </div>
  );
}

export default function LookupDemo() {
  const { t } = useTranslation();
  const [size, setSize] = useState<number>(2000);
  const [find, setFind] = useState<Result | null>(null);
  const [map, setMap] = useState<Result | null>(null);
  const data = useMemo(() => makeData(size), [size]);

  // 全部在事件處理函式裡量：不牽涉 render，數字就是純粹的資料處理成本
  const run = () => {
    const { users, orders } = data;

    // 每一筆訂單都從頭掃一次 users。這就是「在 map 裡面呼叫 find」的成本，
    // 總共 n × m 次比對
    let t0 = performance.now();
    let checked = 0;
    const a = orders.map((o) => {
      const u = users.find((x) => {
        checked += 1;
        return x.id === o.userId;
      });
      return u?.name ?? "";
    });
    const findRes = { ms: performance.now() - t0, ops: checked };

    // 先花 O(n) 建一次索引，之後每筆查詢都是 O(1)
    t0 = performance.now();
    const index = new Map(users.map((u) => [u.id, u]));
    const b = orders.map((o) => index.get(o.userId)?.name ?? "");
    const mapRes = { ms: performance.now() - t0, ops: users.length + orders.length };

    // 兩邊結果必須完全一致，否則這個比較沒有意義
    if (a.length !== b.length || a.some((v, i) => v !== b[i])) {
      console.warn("[lookup] 兩種做法結果不一致");
    }

    setFind(findRes);
    setMap(mapRes);
  };

  const max = Math.max(find?.ms ?? 0, map?.ms ?? 0, 0.01);
  const ratio = find && map && map.ms > 0 ? find.ms / map.ms : null;
  const rows = [
    { key: "find", res: find, color: "var(--color-nekoma)" },
    { key: "map", res: map, color: "var(--color-teal)" },
  ] as const;

  return (
    <div className="@container flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <CodeCompare />

        <hr className="m-0 border-0 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-ink) 15%, transparent)" }} />

        <ScanIllustration />

        <hr className="m-0 border-0 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-ink) 15%, transparent)" }} />

        <div className="flex items-baseline justify-between gap-3 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <span>{t("perf.lookup.dataset", { n: size.toLocaleString() })}</span>
          <span style={{ color: ratio ? "var(--color-nekoma)" : undefined }}>
            {ratio ? t("perf.lookup.ratio", { n: ratio.toFixed(0) }) : t("perf.lookup.idle")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map(({ key, res, color }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-20 shrink-0 sm:w-28" style={{ fontFamily: "monospace", color }}>
                  {t(`perf.lookup.${key}`)}
                </span>
                <span
                  className="block h-2.5 flex-1"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 14%, transparent)" }}
                >
                  <span
                    className="block h-full transition-[width] duration-500 ease-out"
                    style={{ width: res ? `${(res.ms / max) * 100}%` : "0%", backgroundColor: color }}
                  />
                </span>
                <span className="w-16 shrink-0 text-right tabular-nums" style={{ color: "var(--color-ink)" }}>
                  {res ? `${res.ms.toFixed(1)} ms` : "—"}
                </span>
              </div>
              <span className="pl-20 text-[10px] tabular-nums sm:pl-28" style={{ color: "var(--color-muted)" }}>
                {res ? t("perf.lookup.ops", { n: res.ops.toLocaleString() }) : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex border-2" style={{ borderColor: "var(--color-ink)" }} role="group">
          <span
            className="px-2.5 py-2 text-[11px]"
            style={{ fontFamily: "monospace", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)" }}
          >
            {t("perf.lookup.size")}
          </span>
          {SIZES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setSize(n);
                setFind(null);
                setMap(null);
              }}
              aria-pressed={size === n}
              className="interactive px-3 py-2 text-[11px] tabular-nums transition-colors"
              style={{
                fontFamily: "monospace",
                backgroundColor: size === n ? "var(--color-teal)" : "transparent",
                color: size === n ? "#fff" : "var(--color-muted)",
              }}
            >
              {n.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={run}
          className="interactive border-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-poster)",
            borderColor: "var(--color-ink)",
            color: "var(--color-panel)",
            boxShadow: "var(--shadow-manga-sm)",
          }}
        >
          {t("perf.lookup.run")}
        </button>
      </div>
    </div>
  );
}
