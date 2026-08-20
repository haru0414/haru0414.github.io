import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CrayonDoodle from "./crayon/CrayonDoodle";
import sleepCat from "../assets/images/onigiri/sleep-cat.webp";

/**
 * 錯誤畫面本體。獨立匯出讓 /oops 能直接渲染它當 demo——
 * 否則這個畫面只有真的壞掉時才看得到，沒辦法給別人看也沒辦法檢查樣式。
 */
export function ErrorScreen({ detail }: { detail?: string }) {
  const { t } = useTranslation();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* zzz 而非星星：星星是 404 迷路貓在用的，兩頁要能一眼分辨 */}
      <CrayonDoodle
        type="zzz"
        color="var(--color-teal)"
        className="absolute left-[13%] top-[22%] h-10 w-10 -rotate-12"
        delay={300}
      />
      <CrayonDoodle
        type="zzz"
        color="var(--color-poster)"
        className="absolute bottom-[18%] right-[13%] h-12 w-12 rotate-6"
        delay={600}
      />

      {/* 一格漫畫分鏡，與 404 迷路貓同一視覺家族 */}
      <div
        className="relative w-full max-w-lg border-4 px-6 py-10 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-ink)",
          boxShadow: "var(--shadow-manga)",
        }}
      >
        <span
          className="inline-block px-3 py-1 text-xs tracking-[0.2em] text-white"
          style={{ fontFamily: "var(--font-heading)", backgroundColor: "var(--color-nekoma)" }}
        >
          {t("error.tag")}
        </span>

        {/* 大型 500 浮水印 */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-2 select-none text-8xl leading-none opacity-10 md:text-9xl"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          500
        </p>

        {/* 伺服器睡著了：沿用飯糰的睡姿 */}
        <img
          src={sleepCat}
          alt={t("error.catAlt")}
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
          className="mx-auto -mt-12 w-40 md:w-48"
        />

        <p
          className="mt-1 text-sm"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-nekoma)" }}
        >
          {t("error.bubble")}
        </p>

        <h1 className="mt-4 text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
          {t("error.title")}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
          {t("error.desc")}
        </p>

        {detail ? (
          <pre
            className="mt-4 max-h-32 overflow-auto border-2 px-3 py-2 text-left text-xs"
            style={{
              fontFamily: "monospace",
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-ink)",
              color: "var(--color-muted)",
            }}
          >
            {detail}
          </pre>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="interactive border-2 px-5 py-2.5 text-sm transition-transform hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-poster)",
              borderColor: "var(--color-ink)",
              color: "var(--color-panel)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("error.reload")}
          </button>

          <Link
            to="/"
            className="interactive border-2 px-5 py-2.5 text-sm transition-transform hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-ink)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("error.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 這站部署在 GitHub Pages，是純靜態網站，不存在伺服器端的 500。
 * 等價的線上故障是 render 期例外——沒有這層攔截，使用者看到的是一片空白，
 * 連「出錯了」都不會顯示。
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      // 只在開發時顯示訊息細節，正式站不對使用者洩漏堆疊內容
      return <ErrorScreen detail={import.meta.env.DEV ? this.state.error.message : undefined} />;
    }
    return this.props.children;
  }
}
