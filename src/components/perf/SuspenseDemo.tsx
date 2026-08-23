import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

type Resource<T> = { read: () => T };

// 最小的 Suspense 資源實作：未完成時 throw promise，React 接住後顯示
// fallback，promise resolve 再重試 render。這是 Suspense 的底層契約。
function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: "pending" | "success" = "pending";
  let value: T;
  const suspender = promise.then((v) => {
    status = "success";
    value = v;
  });
  return {
    read() {
      if (status === "pending") throw suspender;
      return value;
    },
  };
}

type Item = { name: string; meta: string; accent: string };

const ITEMS: Item[] = [
  { name: "Next.js 14", meta: "App Router", accent: "var(--color-teal)" },
  { name: "TapPay", meta: "金流串接", accent: "var(--color-nekoma)" },
  { name: "LINE LIFF", meta: "第三方登入", accent: "var(--color-poster)" },
  { name: "GA4", meta: "電商事件追蹤", accent: "#6366f1" },
];

const delay = (ms: number) =>
  new Promise<Item[]>((res) => setTimeout(() => res(ITEMS), ms));

function Card({ item }: { item: Item }) {
  return (
    <li
      className="flex list-none flex-col gap-0.5 border-2 p-3"
      style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-ink)" }}
    >
      <span className="h-1 w-7" style={{ backgroundColor: item.accent }} aria-hidden="true" />
      <span className="mt-1 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
        {item.name}
      </span>
      <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
        {item.meta}
      </span>
    </li>
  );
}

function Payload({ resource }: { resource: Resource<Item[]> }) {
  const items = resource.read();
  return (
    <ul className="m-0 grid grid-cols-2 gap-2 p-0">
      {items.map((it) => (
        <Card key={it.name} item={it} />
      ))}
    </ul>
  );
}

// 骨架與卡片同尺寸同排版，資料抵達時才不會有版面跳動
function Fallback({ ms }: { ms: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <ul className="m-0 grid grid-cols-2 gap-2 p-0">
        {[0, 1, 2, 3].map((i) => (
          <li
            key={i}
            className="flex list-none flex-col gap-1.5 border-2 p-3"
            style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-ink)", opacity: 0.5 }}
            aria-hidden="true"
          >
            <span className="h-1 w-7 animate-pulse" style={{ backgroundColor: "var(--color-ink)", opacity: 0.35 }} />
            <span
              className="mt-1 h-3.5 animate-pulse rounded-[2px]"
              style={{ width: `${58 + ((i * 17) % 26)}%`, backgroundColor: "var(--color-ink)", opacity: 0.16 }}
            />
            <span
              className="h-2.5 animate-pulse rounded-[2px]"
              style={{ width: `${40 + ((i * 29) % 30)}%`, backgroundColor: "var(--color-ink)", opacity: 0.12 }}
            />
          </li>
        ))}
      </ul>
      <span className="text-[11px] tabular-nums" style={{ color: "var(--color-muted)" }}>
        {t("perf.suspense.waiting", { ms })}
      </span>
    </div>
  );
}

export default function SuspenseDemo() {
  const { t } = useTranslation();
  const [latency, setLatency] = useState(1200);
  const [resource, setResource] = useState<Resource<Item[]> | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="min-h-[11rem] border-2 p-4"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-ink)" }}
      >
        {resource ? (
          <Suspense fallback={<Fallback ms={latency} />}>
            <Payload resource={resource} />
          </Suspense>
        ) : (
          <p className="m-0 text-xs" style={{ color: "var(--color-muted)" }}>
            {t("perf.suspense.idle")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--color-muted)" }}>
          <span className="flex justify-between">
            <span>{t("perf.suspense.latency")}</span>
            <span className="tabular-nums">{latency} ms</span>
          </span>
          <input
            type="range"
            min={200}
            max={3000}
            step={200}
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="interactive w-full accent-[var(--color-teal)]"
          />
        </label>

        <button
          type="button"
          onClick={() => setResource(createResource(delay(latency)))}
          className="interactive self-start border-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-poster)",
            borderColor: "var(--color-ink)",
            color: "var(--color-panel)",
            boxShadow: "var(--shadow-manga-sm)",
          }}
        >
          {resource ? t("perf.suspense.replay") : t("perf.suspense.start")}
        </button>
      </div>
    </div>
  );
}
