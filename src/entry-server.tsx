import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import i18n from "./i18n";
import { AppShell } from "./App";
import { projects } from "./data/projects";

const SITE_TITLE = "Haru Li｜Frontend Engineer Portfolio";
const ORIGIN = "https://haru0414.github.io";

// build 期要 prerender 的所有路由（首頁 + 每個專案頁 + /surf 實驗頁）
export const routes: string[] = [
  "/",
  ...projects.map((p) => `/project/${p.id}`),
  "/surf",
  "/500",
];

function metaFor(url: string) {
  const m = url.match(/^\/project\/([^/]+)/);
  if (m) {
    const p = projects.find((x) => x.id === m[1]);
    if (p) {
      return {
        title: `${p.title}｜Haru Li`,
        description: i18n.t(`projects.${p.id}.desc`),
        canonical: `${ORIGIN}/project/${p.id}/`,
      };
    }
  }
  if (url === "/surf") {
    return {
      title: "SURF｜GSAP 捲動敘事實驗 Haru Li",
      description:
        "以 GSAP ScrollTrigger 編排的單頁捲動敘事：七幕分鏡走完一次出海，桌機另接 Lenis 平滑捲動。攝影素材採 Unsplash 免費授權。",
      canonical: `${ORIGIN}/surf/`,
    };
  }
  if (url === "/500") {
    return {
      title: "500 伺服器打瞌睡了｜Haru Li",
      description: "500 錯誤頁的畫面設計，與 404 迷路貓為同一視覺家族。此頁開放瀏覽以便檢視設計。",
      canonical: `${ORIGIN}/500/`,
    };
  }
  return {
    title: SITE_TITLE,
    description: i18n.t("seo.description"),
    canonical: `${ORIGIN}/`,
  };
}

// build 期 prerender 用：用 React 自己把指定路由渲染成 HTML 字串，與 client 端
// hydrate 逐字一致。client 是 BrowserRouter，這裡用 MemoryRouter 指到同一路徑，
// 渲染出的 DOM 一致。
export function renderRoute(url: string) {
  const html = renderToString(
    <StrictMode>
      <MemoryRouter initialEntries={[url]}>
        <AppShell />
      </MemoryRouter>
    </StrictMode>,
  );
  return { html, path: url, ...metaFor(url) };
}
