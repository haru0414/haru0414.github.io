import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import zh from "./locales/zh";

// 預設中文：初始只內建 zh，英文語系包採動態載入（見 ensureLanguage）
const resources = { zh };

// build 期 SSR 在 Node 執行：沒有 window/localStorage，跳過語言偵測（直接用
// fallback zh），確保 prerender 的 HTML 與 client 初次 render 一致
const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  // 偵測初始語言：只看 localStorage，沒有就用 fallback（中文），不跟瀏覽器走
  i18n.use(LanguageDetector);
}

i18n
  // 把 i18next 接到 React（提供 useTranslation / 語言變更自動 re-render）
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh", // 找不到對應語言時退回中文
    supportedLngs: ["zh", "en"],
    detection: {
      order: ["localStorage"], // 偵測來源：只用 localStorage
      caches: ["localStorage"], // 切換語言時寫回 localStorage
      lookupLocalStorage: "lang", // localStorage 的 key 名稱
    },
    interpolation: {
      escapeValue: false, // React 本身會防 XSS，不需 i18next 再跳脫
    },
  });

// 確保某語言的翻譯已載入：英文採動態 import，Vite 會切成獨立 chunk，
// 使用者切到英文時才下載。
async function ensureLanguage(lng: string) {
  if (lng === "en" && !i18n.hasResourceBundle("en", "translation")) {
    const { default: en } = await import("./locales/en");
    i18n.addResourceBundle("en", "translation", en.translation, true, true);
  }
}

// 給元件用的語言切換：先確保語系包載入，再切換
export async function changeLanguage(lng: string) {
  await ensureLanguage(lng);
  await i18n.changeLanguage(lng);
}

// 讓 <html lang> 跟著目前語言走（SEO / 螢幕閱讀器會讀這個）；SSR 無 document
const syncHtmlLang = (lng: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng === "en" ? "en" : "zh-TW";
};
if (isBrowser) {
  syncHtmlLang(i18n.language);
  i18n.on("languageChanged", syncHtmlLang);
}

// 支援的語言與網址前綴。中文是預設語言，網址不帶前綴；英文一律掛在 /en 底下。
// 語言由網址決定而非 localStorage——搜尋引擎每個語言版本要有各自的網址才收得到。
export const LANGS = ["zh", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** 從網址判斷語言。/en 或 /en/... 為英文，其餘為中文 */
export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

/** 去掉語言前綴，回傳中文版的對應路徑（永遠以 / 開頭） */
export function stripLang(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

/** 把任一路徑轉成指定語言的網址 */
export function localizePath(pathname: string, lang: Lang): string {
  const base = stripLang(pathname);
  if (lang === "zh") return base;
  return base === "/" ? "/en/" : `/en${base}`;
}

export default i18n;
