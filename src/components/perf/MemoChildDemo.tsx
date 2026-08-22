import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const NAMES = [
  "build", "prerender", "optimize-images", "lint",
  "typecheck", "deploy", "purge-cache", "sitemap",
  "bundle-report", "e2e", "lighthouse", "upload",
];

type Task = { id: number; name: string; ms: number };

const initial = (): Task[] =>
  NAMES.map((name, i) => ({ id: i + 1, name, ms: 40 + ((i * 53) % 220) }));

// 只換掉指定的那一筆：那筆是新物件，其餘十一筆的參考完全沒變。
// memo 比對 props 時才判定得出「這些沒變，不必重畫」。
// 更新函式必須是純的——StrictMode 下會被呼叫兩次，把 setState 寫在裡面會出錯
const applyRerun = (id: number) => (prev: Task[]) =>
  prev.map((task) => (task.id === id ? { ...task, ms: 40 + Math.floor(Math.random() * 260) } : task));

type RowProps = { task: Task; onRerun: (id: number) => void };

// 每次「實際渲染」計數並閃一下。全部在 useEffect 裡做——effect 在 commit
// 之後執行，操作 DOM 與 ref 都合法；在 render 期間記錄則違反 React 規則
function useRenderTracker() {
  const ref = useRef<HTMLButtonElement>(null);
  const countRef = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    countRef.current += 1;
    const badge = el.querySelector("[data-count]");
    if (badge) badge.textContent = String(countRef.current);
    el.style.animation = "none";
    // 讀取 offsetWidth 強制 reflow，動畫才能重新播放
    void el.offsetWidth;
    el.style.animation = "perf-flash 0.6s ease-out";
  });
  return ref;
}

function RowBase({ task, onRerun }: RowProps) {
  const { t } = useTranslation();
  const ref = useRenderTracker();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onRerun(task.id)}
      title={t("perf.memoChild.rerunHint")}
      className="interactive flex w-full items-center gap-3 border-b px-3 py-2 text-left text-[11px]"
      style={{
        fontFamily: "monospace",
        borderColor: "color-mix(in srgb, var(--color-ink) 12%, transparent)",
      }}
    >
      <span className="w-6 shrink-0 tabular-nums" style={{ color: "var(--color-muted)" }}>
        {task.id}
      </span>
      <span className="min-w-0 flex-1 truncate">{task.name}</span>
      <span className="shrink-0 text-[10px]" style={{ color: "var(--color-teal)" }} aria-hidden="true">
        ↻
      </span>
      <span className="w-14 shrink-0 text-right tabular-nums">{task.ms} ms</span>
      {/* 這個數字由 effect 直接寫入，是真的渲染次數 */}
      <span
        data-count
        className="w-8 shrink-0 text-right tabular-nums text-[10px]"
        style={{ color: "var(--color-muted)" }}
      >
        1
      </span>
    </button>
  );
}

const MemoRow = memo(RowBase);

export default function MemoChildDemo() {
  const { t } = useTranslation();
  const [memoOn, setMemoOn] = useState(true);
  const [cbOn, setCbOn] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [lastName, setLastName] = useState<string | null>(null);

  // 兩個版本的行為完全一樣，差別只在「函式參考是否跨 render 保持不變」。
  // 刻意各寫一次而不共用，才看得出 useCallback 包住的到底是什麼
  const stable = useCallback((id: number) => {
    setTasks(applyRerun(id));
    setLastName(NAMES[id - 1] ?? null);
  }, []);
  const unstable = (id: number) => {
    setTasks(applyRerun(id));
    setLastName(NAMES[id - 1] ?? null);
  };
  const onRerun = cbOn ? stable : unstable;

  const Row = memoOn ? MemoRow : RowBase;

  const reset = () => {
    setTasks(initial());
    setLastName(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-2 border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        <div className="flex items-baseline justify-between gap-3 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <span>
            {lastName === null
              ? t("perf.memoChild.idle")
              : t("perf.memoChild.changed", { name: lastName })}
          </span>
          <span style={{ color: memoOn && cbOn ? "var(--color-teal)" : "var(--color-nekoma)" }}>
            {t(memoOn && cbOn ? "perf.memoChild.onlyOne" : "perf.memoChild.allRows", { n: tasks.length })}
          </span>
        </div>

        <div className="flex justify-between px-3 text-[10px]" style={{ color: "var(--color-muted)" }}>
          <span>{t("perf.memoChild.colTask")}</span>
          <span>{t("perf.memoChild.colRenders")}</span>
        </div>

        <div className="border-2" style={{ borderColor: "color-mix(in srgb, var(--color-ink) 20%, transparent)" }}>
          {tasks.map((task) => (
            <Row key={task.id} task={task} onRerun={onRerun} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {(
          [
            { label: "React.memo", on: memoOn, set: setMemoOn },
            { label: "useCallback", on: cbOn, set: setCbOn },
          ] as const
        ).map(({ label, on, set }) => (
          <div key={label} className="flex border-2" style={{ borderColor: "var(--color-ink)" }} role="group">
            <span
              className="px-2.5 py-2 text-[11px]"
              style={{ fontFamily: "monospace", backgroundColor: "var(--color-panel)", color: "var(--color-on-panel)" }}
            >
              {label}
            </span>
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set(v)}
                aria-pressed={on === v}
                className="interactive px-2.5 py-2 text-[11px] transition-colors"
                style={{
                  fontFamily: "monospace",
                  backgroundColor: on === v ? (v ? "var(--color-teal)" : "var(--color-nekoma)") : "transparent",
                  color: on === v ? "#fff" : "var(--color-muted)",
                }}
              >
                {v ? "ON" : "OFF"}
              </button>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={reset}
          className="interactive border-2 px-3 py-2 text-xs transition-transform hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-ink)",
          }}
        >
          {t("perf.memoChild.reset")}
        </button>
      </div>
    </div>
  );
}
