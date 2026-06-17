import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { projects } from "../data/projects";

const ORIGIN = "https://haru0414.github.io";

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
    const m = pathname.match(/^\/project\/([^/]+)/);
    const project = m ? projects.find((p) => p.id === m[1]) : undefined;

    const title = project ? `${project.title}｜Haru Li` : t("seo.title");
    const description = project
      ? t(`projects.${project.id}.desc`)
      : t("seo.description");
    const canonical = project ? `${ORIGIN}/project/${project.id}/` : `${ORIGIN}/`;

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', t("seo.ogLocale"));
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setLink('link[rel="canonical"]', canonical);
  }, [t, i18n.language, pathname]);

  return null;
}
