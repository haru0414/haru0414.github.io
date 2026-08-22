import { useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

// 資料量與「實際渲染出來的筆數」都要夠大，transition 才有東西可以延後。
// 先前只渲染 60 筆，過濾又只花幾毫秒，兩種模式量起來完全一樣
const SIZE = 20000;
const SHOWN = 1200;
const WORDS = ["build", "render", "cache", "bundle", "layout", "paint", "hydrate", "prefetch"];

// 真實列表的每一列通常還要做格式化、計算衍生值。這裡用一段小雜湊模擬，
// 讓 commit 的成本接近實際情況——沒有這層，1200 個簡單 li 對 React 太輕，
// 兩種排程模式量起來看不出差別
function derive(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  for (let i = 0; i < 400; i++) h = (h * 33 + i) | 0;
  return Math.abs(h % 900) + 40;
}

function useItems() {
  return useMemo(
    () => Array.from({ length: SIZE }, (_, i) => `${WORDS[i % WORDS.length]}-${String(i).padStart(4, "0")}`),
    [],
  );
}

export default function TransitionDemo() {
  const { t } = useTranslation();
  const items = useItems();
  const [txOn, setTxOn] = useState(true);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [lag, setLag] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // 過濾本身刻意做重一點，才看得出有沒有把它排到低優先權的差別
  const filtered = useMemo(() => {
    if (!query) return items.slice(0, SHOWN);
    const q = query.toLowerCase();
    return items.filter((s) => s.toLowerCase().includes(q)).slice(0, SHOWN);
  }, [items, query]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const t0 = performance.now();
    // 輸入框自己的值永遠立即更新，卡的是後面那份重運算
    setText(v);
    if (txOn) {
      startTransition(() => setQuery(v));
    } else {
      setQuery(v);
    }
    // 量到下一幀為止的耗時 = 這次按鍵實際卡住畫面的時間。
    // 在 rAF 回呼裡設 state 不算 render 期間的副作用
    requestAnimationFrame(() => setLag(performance.now() - t0));
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <input
          type="text"
          value={text}
          onChange={onChange}
          placeholder={t("perf.transition.placeholder")}
          className="interactive w-full border-2 px-3 py-2 text-sm"
          style={{
            fontFamily: "monospace",
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-ink)",
            color: "var(--color-ink)",
          }}
          aria-label={t("perf.transition.placeholder")}
        />

        <div className="flex items-baseline justify-between gap-2 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <span>
            {t("perf.transition.lag")}{" "}
            <b className="tabular-nums" style={{ color: lag && lag > 60 ? "var(--color-nekoma)" : "var(--color-teal)" }}>
              {lag === null ? "—" : `${lag.toFixed(0)} ms`}
            </b>
          </span>
          <span>{t("perf.transition.hits", { n: filtered.length, total: SIZE.toLocaleString() })}</span>
        </div>

        <ul
          className="m-0 h-40 overflow-y-auto overscroll-contain border-2 p-0"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "color-mix(in srgb, var(--color-ink) 25%, transparent)",
            // 低優先權更新進行中時整份列表淡一點，表示「舊資料還在，新的在路上」
            opacity: isPending ? 0.55 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {filtered.map((s) => (
            <li
              key={s}
              className="flex list-none items-center justify-between gap-2 px-3 py-1 text-[11px]"
              style={{ fontFamily: "monospace" }}
            >
              <span className="truncate">{s}</span>
              <span className="shrink-0 tabular-nums" style={{ color: "var(--color-muted)" }}>
                {derive(s)} ms
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex border-2 self-start" style={{ borderColor: "var(--color-ink)" }} role="group">
        <span
          className="px-2.5 py-2 text-[11px]"
          style={{ fontFamily: "monospace", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)" }}
        >
          useTransition
        </span>
        {([true, false] as const).map((on) => (
          <button
            key={String(on)}
            type="button"
            onClick={() => setTxOn(on)}
            aria-pressed={txOn === on}
            className="interactive px-3 py-2 text-[11px] transition-colors"
            style={{
              fontFamily: "monospace",
              backgroundColor: txOn === on ? (on ? "var(--color-teal)" : "var(--color-nekoma)") : "transparent",
              color: txOn === on ? "#fff" : "var(--color-muted)",
            }}
          >
            {on ? "ON" : "OFF"}
          </button>
        ))}
      </div>
    </div>
  );
}
