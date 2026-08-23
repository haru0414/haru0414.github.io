import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { projects } from "../data/projects";
import { boardFromSlug, posts } from "../data/posts";

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

export default function SeoMeta() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    // 每一條路由都要有自己的 meta。先前只處理首頁與專案頁，其餘路由
    // 走 client-side 導航時會被套上首頁標題——prerender 的 HTML 是對的，
    // 但從首頁點進去看到的 document.title 是錯的
    const path = pathname.replace(/\/+$/, "") || "/";
    const m = path.match(/^\/project\/([^/]+)/);
    const project = m ? projects.find((p) => p.id === m[1]) : undefined;
    const boardMatch = path.match(/^\/blog\/board\/(.+)$/);
    const b = boardMatch ? null : path.match(/^\/blog\/([^/]+)/);
    const post = b ? posts.find((x) => x.slug === b[1]) : undefined;

    let title = t("seo.title");
    let description = t("seo.description");
    let canonical = `${ORIGIN}/`;
    // 沒有專屬封面就回到站台預設圖，不能留空
    let image = `${ORIGIN}/og-image.jpg`;

    if (project) {
      title = `${project.title}｜Haru Li`;
      description = t(`projects.${project.id}.desc`);
      canonical = `${ORIGIN}/project/${project.id}/`;
    } else if (post) {
      title = `${post.title}｜Haru Li`;
      description = post.summary;
      canonical = `${ORIGIN}/blog/${post.slug}/`;
      if (post.cover) image = `${ORIGIN}${post.cover}`;
    } else if (boardMatch) {
      const tag = boardFromSlug(boardMatch[1]);
      if (tag) {
        title = `${tag}｜部落格 Haru Li`;
        description = `標籤「${tag}」底下的文章。`;
        canonical = `${ORIGIN}/blog/board/${boardMatch[1]}/`;
      }
    } else if (path === "/blog") {
      title = "BLOG｜部落格 Haru Li";
      description = "前端開發過程中的紀錄：踩過的坑、量測的結果，以及那些教科書寫得對但實際上沒那麼簡單的事。";
      canonical = `${ORIGIN}/blog/`;
    } else if (path === "/lab") {
      title = "PERF LAB｜可操作的前端效能實作 Haru Li";
      description = "十個可以自己操作的前端效能實作，數字當場量出來。";
      canonical = `${ORIGIN}/lab/`;
    } else if (path === "/surf") {
      title = "SURF｜GSAP 捲動敘事實驗 Haru Li";
      description = "以 GSAP ScrollTrigger 編排的單頁捲動敘事，七幕分鏡走完一次出海。";
      canonical = `${ORIGIN}/surf/`;
    }

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
  }, [t, i18n.language, pathname]);

  return null;
}
