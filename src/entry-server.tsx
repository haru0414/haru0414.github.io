import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import "./i18n";
import { AppShell } from "./App";

// build 期 prerender 用：用 React 自己把首頁渲染成 HTML 字串，
// 與 client 端 hydrate 逐字一致（避免 browser-snapshot 的序列化落差）。
// 用 MemoryRouter 固定在 "/"（client 是 HashRouter，但首頁無 <Link>，
// 渲染出的 DOM 不含 router 相關屬性，兩者一致）。
export function render(): string {
  return renderToString(
    <StrictMode>
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>
    </StrictMode>,
  );
}
