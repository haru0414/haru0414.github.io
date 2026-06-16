import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import zh from "./locales/zh";

// 預設中文：初始只內建 zh，英文語系包採動態載入（見 ensureLanguage）
const resources = { zh };

i18n
  // 偵測初始語言：只看 localStorage，沒有就用 fallback（中文），不跟瀏覽器走
  .use(LanguageDetector)
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

// 回訪者若上次選英文，啟動時補載入英文包（首屏可能短暫顯示中文後切換）
if (i18n.language?.startsWith("en")) {
  void changeLanguage("en");
}

// 讓 <html lang> 跟著目前語言走（SEO / 螢幕閱讀器會讀這個）
const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng === "en" ? "en" : "zh-TW";
};
syncHtmlLang(i18n.language);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
