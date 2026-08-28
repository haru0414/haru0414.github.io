import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { projects } from "../data/projects";
import { boardFromSlug, posts } from "../data/posts";
import { langFromPath, localizePath, stripLang, type Lang } from "../i18n";

// 與 entry-server.tsx 一致：指向自訂網域而非 github.io
const ORIGIN = "https://www.haruli.com";

// 依目前語言 + 路由更新 <title> 與社群分享 meta。
// SPA 的 HTML 靜態 meta 只是預設值，語言切換 / 換頁時由這裡覆寫。
function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}
function setLink(selector: string, href: string) {
  const el = document.head.querySelector<HTMLLinkElement>(selector);
  if (el) el.href = href;
}

/** 某語言版本的絕對網址，一律帶尾斜線（與 canonical / sitemap 一致） */
function urlFor(path: string, lang: Lang) {
  const p = localizePath(path, lang).replace(/\/+$/, "");
  return `${ORIGIN}${p}/`;
}

/**
 * hreflang 由 prerender 寫進靜態 HTML，但 client 換頁時網址變了、
 * 那幾個標籤還停在上一頁，所以這裡照樣要更新（dev 沒有 prerender，就補建）。
 */
function syncAlternate(hreflang: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${hreflang}"]`,
  );
  if (!el) {
    el = document.createElement("link");
    el.rel = "alternate";
    el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function SeoMeta() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    // 每一條路由都要有自己的 meta。先前只處理首頁與專案頁，其餘路由
    // 走 client-side 導航時會被套上首頁標題——prerender 的 HTML 是對的，
    // 但從首頁點進去看到的 document.title 是錯的
    const lang = langFromPath(pathname);
    const path = stripLang(pathname).replace(/\/+$/, "") || "/";
    const canonical = urlFor(path, lang);
    const suffix = t("pageSeo.suffix");

    const m = path.match(/^\/project\/([^/]+)/);
    const project = m ? projects.find((p) => p.id === m[1]) : undefined;
    const boardMatch = path.match(/^\/blog\/board\/(.+)$/);
    const b = boardMatch ? null : path.match(/^\/blog\/([^/]+)/);
    const post = b ? posts.find((x) => x.slug === b[1]) : undefined;

    let title = t("pageSeo.home.title");
    let description = t("pageSeo.home.description");
    // 沒有專屬封面就回到站台預設圖，不能留空
    let image = `${ORIGIN}/og-image.jpg`;

    const page = (key: string) => {
      title = t(`pageSeo.${key}.title`);
      description = t(`pageSeo.${key}.description`);
    };

    if (project) {
      title = `${project.title}${suffix}`;
      description = t(`projects.${project.id}.desc`);
    } else if (post) {
      title = `${post.title}${suffix}`;
      description = post.summary;
      if (post.cover) image = `${ORIGIN}${post.cover}`;
    } else if (boardMatch) {
      const tag = boardFromSlug(boardMatch[1]);
      if (tag) {
        title = t("pageSeo.board.title", { tag });
        description = t("pageSeo.board.description", { tag });
      }
    } else if (path === "/blog") page("blog");
    else if (path === "/work") page("work");
    else if (path === "/lab") page("lab");
    else if (path === "/certs") page("certs");
    else if (path === "/surf") page("surf");
    else if (path === "/500") page("e500");

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', t("seo.ogLocale"));
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[name="twitter:image"]', image);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setLink('link[rel="canonical"]', canonical);

    syncAlternate("zh-Hant-TW", urlFor(path, "zh"));
    syncAlternate("en", urlFor(path, "en"));
    syncAlternate("x-default", urlFor(path, "zh"));
  }, [t, i18n.language, pathname]);

  return null;
}
