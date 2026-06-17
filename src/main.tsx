import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";

const rootEl = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// 正式版的 index.html 已在建置時 prerender，#root 內有靜態 HTML → hydrate；
// dev 時 #root 為空 → 一般 createRoot 渲染
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
