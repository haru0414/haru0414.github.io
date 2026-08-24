import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { changeLanguage, langFromPath } from "./i18n";
import App from "./App.tsx";

const rootEl = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// 語言必須在 hydrate 之前就位。/en 的頁面是用英文 prerender 的，
// 若 client 帶著中文接手，第一次 render 的文字會對不上靜態 HTML，
// React 會整棵重畫（hydration mismatch）。英文語系包是動態載入的，
// 所以這裡要等它到齊。
async function start() {
  await changeLanguage(langFromPath(window.location.pathname));

  // 正式版的 index.html 已在建置時 prerender，#root 內有靜態 HTML → hydrate；
  // dev 時 #root 為空 → 一般 createRoot 渲染
  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
}

void start();
