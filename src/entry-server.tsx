import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import i18n, { langFromPath, localizePath, stripLang, type Lang } from "./i18n";
import en from "./locales/en";
import { AppShell } from "./App";
import { projects } from "./data/projects";
import { allBoards, boardFromSlug, boardSlug, posts } from "./data/posts";

// 站台實際跑在自訂網域（見 public/CNAME）。canonical 必須指向最終網址，
// 指到 github.io 等於告訴搜尋引擎「正版在那邊」，自訂網域反而變次要
const ORIGIN = "https://www.haruli.com";

// 英文語系包在瀏覽器是動態載入的，SSR 沒有那個時機，這裡直接靜態掛上
i18n.addResourceBundle("en", "translation", en.translation, true, true);

// 語言中立的頁面清單（不含 /en 前綴）
const PAGES: string[] = [
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

// build 期要 prerender 的所有路由：每一頁都有中英兩個網址
export const routes: string[] = [
  ...PAGES,
  ...PAGES.map((p) => localizePath(p, "en").replace(/\/$/, "") || "/en"),
];

/** 某語言版本的絕對網址，一律帶尾斜線（與 canonical / sitemap 一致） */
function urlFor(path: string, lang: Lang) {
  const p = localizePath(path, lang).replace(/\/+$/, "");
  return `${ORIGIN}${p}/`;
}

/**
 * hreflang：告訴搜尋引擎同一頁有哪些語言版本。
 * 兩個版本都要互相指回對方，只單向宣告 Google 會忽略。
 * x-default 指向中文版——沒有匹配語言時的預設落點。
 */
function alternatesFor(path: string) {
  return [
    { hreflang: "zh-Hant-TW", href: urlFor(path, "zh") },
    { hreflang: "en", href: urlFor(path, "en") },
    { hreflang: "x-default", href: urlFor(path, "zh") },
  ];
}

// 對外的身分連結。寫進 sameAs 是為了讓搜尋引擎與 AI 把「Haru Li」
// 綁定到既有帳號，而不是每個站各自認一個同名的人
const PROFILES = [
  "https://github.com/haru0414",
  "https://linkedin.com/in/liiiharu/",
];

const AUTHOR = {
  "@type": "Person",
  name: "Haru Li",
  alternateName: "李哲瑋",
  url: `${ORIGIN}/`,
  sameAs: PROFILES,
};

// 麵包屑。/blog/board/* 與 /project/* 都有明確層級，標出來讓搜尋結果
// 顯示路徑而不是一長串網址
function crumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// 結構化資料。文章用 BlogPosting（帶發表日期與作者），
// 其餘頁面用 WebSite + Person，讓搜尋結果能顯示站名與作者
function jsonLdFor(path: string, lang: Lang) {
  const home = lang === "en" ? "Home" : "首頁";

  // 看板是彙整頁不是文章，不該掛 BlogPosting，但層級關係值得標出來
  const boardLd = path.match(/^\/blog\/board\/(.+)$/);
  if (boardLd) {
    const tag = boardFromSlug(boardLd[1]);
    return {
      "@context": "https://schema.org",
      "@graph": [
        crumbs([
          { name: home, url: urlFor("/", lang) },
          { name: "BLOG", url: urlFor("/blog", lang) },
          {
            name: tag ?? boardLd[1],
            url: urlFor(`/blog/board/${boardLd[1]}`, lang),
          },
        ]),
      ],
    };
  }

  const b = path.match(/^\/blog\/([^/]+)/);
  const post = b ? posts.find((x) => x.slug === b[1]) : undefined;
  if (post) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.date,
          keywords: post.tags.join(", "),
          // 文章正文只有中文版，語言照實宣告，不跟著網址前綴走
          inLanguage: "zh-Hant-TW",
          ...(post.cover ? { image: `${ORIGIN}${post.cover}` } : {}),
          author: AUTHOR,
          publisher: AUTHOR,
          mainEntityOfPage: urlFor(`/blog/${post.slug}`, lang),
        },
        crumbs([
          { name: home, url: urlFor("/", lang) },
          { name: "BLOG", url: urlFor("/blog", lang) },
          { name: post.title, url: urlFor(`/blog/${post.slug}`, lang) },
        ]),
      ],
    };
  }

  if (path === "/") {
    // 首頁同時宣告站台與人。Person 帶 sameAs，是讓 Google Knowledge Graph
    // 與 AI 搜尋把這個站對應到既有 GitHub / LinkedIn 帳號的關鍵
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${urlFor("/", lang)}#website`,
          name: "Haru Li",
          url: urlFor("/", lang),
          inLanguage: lang === "en" ? "en" : "zh-Hant-TW",
          publisher: { "@id": `${ORIGIN}/#person` },
        },
        {
          ...AUTHOR,
          "@id": `${ORIGIN}/#person`,
          jobTitle: "Frontend Engineer",
          knowsAbout: [
            "React",
            "TypeScript",
            "Next.js",
            "Web Performance",
            "Frontend Architecture",
          ],
        },
      ],
    };
  }

  const proj = path.match(/^\/project\/([^/]+)/);
  if (proj) {
    const p = projects.find((x) => x.id === proj[1]);
    if (p) {
      return {
        "@context": "https://schema.org",
        "@graph": [
          crumbs([
            { name: home, url: urlFor("/", lang) },
            { name: "WORK", url: urlFor("/work", lang) },
            { name: p.title, url: urlFor(`/project/${p.id}`, lang) },
          ]),
        ],
      };
    }
  }
  return null;
}

/**
 * 每條路由的 title / description / canonical。
 * 文案取自 i18n（呼叫前語言已經切好），中英各一份不必在這裡分岔。
 */
function metaFor(path: string, lang: Lang) {
  const canonical = urlFor(path, lang);
  const suffix = i18n.t("pageSeo.suffix");
  const page = (key: string) => ({
    title: i18n.t(`pageSeo.${key}.title`),
    description: i18n.t(`pageSeo.${key}.description`),
    canonical,
  });

  const m = path.match(/^\/project\/([^/]+)/);
  if (m) {
    const p = projects.find((x) => x.id === m[1]);
    if (p) {
      return {
        title: `${p.title}${suffix}`,
        description: i18n.t(`projects.${p.id}.desc`),
        canonical,
      };
    }
  }
  if (path === "/surf") return page("surf");

  const board = path.match(/^\/blog\/board\/(.+)$/);
  if (board) {
    const tag = boardFromSlug(board[1]);
    if (tag) {
      return {
        title: i18n.t("pageSeo.board.title", { tag }),
        description: i18n.t("pageSeo.board.description", { tag }),
        canonical,
      };
    }
  }

  const b = path.match(/^\/blog\/([^/]+)/);
  if (b) {
    const post = posts.find((x) => x.slug === b[1]);
    if (post) {
      return {
        title: `${post.title}${suffix}`,
        description: post.summary,
        canonical,
        image: post.cover ? `${ORIGIN}${post.cover}` : undefined,
        // 文章要標成 article，用 website 等於告訴社群平台「這是一個站」
        ogType: "article",
        publishedTime: post.date || undefined,
      };
    }
  }

  if (path === "/blog") return page("blog");
  if (path === "/work") return page("work");
  if (path === "/lab") return page("lab");
  if (path === "/500") {
    return {
      ...page("e500"),
      // 這是設計展示頁，開放瀏覽但不該出現在搜尋結果裡誤導人
      robots: "noindex, follow",
    };
  }
  return page("home");
}

// build 期 prerender 用：用 React 自己把指定路由渲染成 HTML 字串，與 client 端
// hydrate 逐字一致。client 是 BrowserRouter，這裡用 MemoryRouter 指到同一路徑，
// 渲染出的 DOM 一致。
export async function renderRoute(url: string) {
  const lang = langFromPath(url);
  const path = stripLang(url);
  // t() 讀的是當下語言，渲染前先切好；語系包已同步掛上，不會等網路
  await i18n.changeLanguage(lang);

  const html = renderToString(
    <StrictMode>
      <MemoryRouter initialEntries={[url]}>
        <AppShell />
      </MemoryRouter>
    </StrictMode>,
  );
  return {
    html,
    path: url,
    lang,
    // 文章正文是中文，即使掛在 /en 底下也不該宣告成英文
    htmlLang: lang === "en" ? "en" : "zh-TW",
    alternates: alternatesFor(path),
    jsonLd: jsonLdFor(path, lang),
    ...metaFor(path, lang),
  };
}
