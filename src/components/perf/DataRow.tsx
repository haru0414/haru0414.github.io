// 這個檔案刻意不被主 bundle 直接引用，只透過動態 import 載入，
// Vite 會把它切成獨立 chunk。是 LazyDemo 第一批資料的載入目標。
export type Row = { id: number; name: string; status: "done" | "running" | "queued"; ms: number };

const STATUS: Record<Row["status"], { label: string; color: string }> = {
  done: { label: "完成", color: "var(--color-teal)" },
  running: { label: "執行中", color: "var(--color-poster)" },
  queued: { label: "排隊中", color: "var(--color-muted)" },
};

export default function DataRow({ row, index }: { row: Row; index: number }) {
  const s = STATUS[row.status];
  return (
    <li
      className="flex list-none items-center gap-3 border-b px-3 py-2.5 text-xs"
      style={{
        borderColor: "color-mix(in srgb, var(--color-ink) 12%, transparent)",
        // 逐筆淡入：以索引錯開，看起來像資料一筆一筆進來
        animation: "perf-row-in 0.34s ease-out both",
        animationDelay: `${(index % 12) * 45}ms`,
      }}
    >
      <span className="w-10 shrink-0 tabular-nums" style={{ color: "var(--color-muted)" }}>
        #{row.id}
      </span>
      <span className="min-w-0 flex-1 truncate" style={{ fontFamily: "monospace" }}>
        {row.name}
      </span>
      <span className="w-14 shrink-0 text-right tabular-nums" style={{ color: "var(--color-muted)" }}>
        {row.ms} ms
      </span>
      <span
        className="w-14 shrink-0 px-1.5 py-0.5 text-center text-[10px]"
        style={{ backgroundColor: s.color, color: "#fff" }}
      >
        {s.label}
      </span>
    </li>
  );
}
