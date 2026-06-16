import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// 依目前語言更新 <title> 與社群分享 meta。
// SPA 沒有 SSR，HTML 裡的靜態 meta 只是預設值，語言切換時由這裡覆寫。
function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

export default function SeoMeta() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const title = t("seo.title");
    const description = t("seo.description");

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', t("seo.ogLocale"));
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [t, i18n.language]);

  return null;
}
