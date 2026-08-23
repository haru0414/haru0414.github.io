import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import i18n from "./i18n";
import { AppShell } from "./App";
import { projects } from "./data/projects";
import { allBoards, boardFromSlug, boardSlug, posts } from "./data/posts";

const SITE_TITLE = "Haru Li｜Frontend Engineer Portfolio";
// 站台實際跑在自訂網域（見 public/CNAME）。canonical 必須指向最終網址，
// 指到 github.io 等於告訴搜尋引擎「正版在那邊」，自訂網域反而變次要
const ORIGIN = "https://www.haruli.com";

// build 期要 prerender 的所有路由（首頁 + 每個專案頁 + /surf 實驗頁）
export const routes: string[] = [
  "/",
  "/work",
  ...projects.map((p) => `/project/${p.id}`),
  "/surf",
  "/500",
  "/lab",
  "/blog",
  ...allBoards().map(([tag]) => `/blog/board/${boardSlug(tag)}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];

const AUTHOR = {
  "@type": "Person",
  name: "Haru Li",
  alternateName: "李哲瑋",
  url: `${ORIGIN}/`,
};

// 結構化資料。文章用 BlogPosting（帶發表日期與作者），
// 其餘頁面用 WebSite + Person，讓搜尋結果能顯示站名與作者
function jsonLdFor(url: string) {
  // 看板是彙整頁不是文章，不該掛 BlogPosting
  if (url.startsWith("/blog/board/")) return null;
  const b = url.match(/^\/blog\/([^/]+)/);
  const post = b ? posts.find((x) => x.slug === b[1]) : undefined;
  if (post) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      dateModified: post.date,
      keywords: post.tags.join(", "),
      ...(post.cover ? { image: `${ORIGIN}${post.cover}` } : {}),
      author: AUTHOR,
      mainEntityOfPage: `${ORIGIN}/blog/${post.slug}/`,
    };
  }
  if (url === "/") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Haru Li",
      url: `${ORIGIN}/`,
      author: AUTHOR,
    };
  }
  return null;
}

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
  const board = url.match(/^\/blog\/board\/(.+)$/);
  if (board) {
    const tag = boardFromSlug(board[1]);
    if (tag) {
      return {
        title: `${tag}｜部落格 Haru Li`,
        description: `標籤「${tag}」底下的文章。`,
        canonical: `${ORIGIN}/blog/board/${board[1]}/`,
      };
    }
  }
  const b = url.match(/^\/blog\/([^/]+)/);
  if (b) {
    const post = posts.find((x) => x.slug === b[1]);
    if (post) {
      return {
        title: `${post.title}｜Haru Li`,
        description: post.summary,
        canonical: `${ORIGIN}/blog/${post.slug}/`,
        image: post.cover ? `${ORIGIN}${post.cover}` : undefined,
      };
    }
  }
  if (url === "/blog") {
    return {
      title: "BLOG｜部落格 Haru Li",
      description: "前端開發過程中的紀錄：踩過的坑、量測的結果、以及那些「教科書寫得對但實際上沒那麼簡單」的事。",
      canonical: `${ORIGIN}/blog/`,
    };
  }
  if (url === "/work") {
    return {
      title: "WORK｜商業專案作品集 Haru Li",
      description:
        "電商平台、官網架構遷移、後台系統、金流整合與即時通訊——八件商業專案的完整索引，可依技術棧篩選。",
      canonical: `${ORIGIN}/work/`,
    };
  }
  if (url === "/lab") {
    return {
      title: "PERF LAB｜可操作的前端效能實作 Haru Li",
      description:
        "useMemo 快取、捲動延遲載入、Suspense 等待資料——三個可以自己操作的前端效能實作，數字當場量出來。",
      canonical: `${ORIGIN}/lab/`,
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
  return { html, path: url, jsonLd: jsonLdFor(url), ...metaFor(url) };
}
