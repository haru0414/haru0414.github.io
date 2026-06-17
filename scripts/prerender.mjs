// 建置後 prerender：用 build 期 SSR bundle（React renderToString）把首頁渲染成
// HTML 字串，塞回 dist/index.html 的 <div id="root">，讓首屏（含 LCP 大字）
// 不必等 JS 即可繪製；client 端再 hydrate 接手。
//
// 用 renderToString 而非 browser snapshot：React 自己產生 HTML，與 client
// hydration 逐字一致，避免 CSSOM 序列化落差造成的 hydration mismatch。
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const serverEntry = join(ROOT, "dist-server", "entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href);

const inner = render();
if (!inner || inner.trim().length < 1000) {
  console.error(`❌ prerender 失敗：SSR 輸出過少（${inner?.length ?? 0} 字元）`);
  process.exit(1);
}

const indexPath = join(ROOT, "dist", "index.html");
const html = readFileSync(indexPath, "utf8");
if (!html.includes('<div id="root"></div>')) {
  console.error('❌ prerender 失敗：dist/index.html 找不到空的 <div id="root"></div>');
  process.exit(1);
}

writeFileSync(
  indexPath,
  html.replace('<div id="root"></div>', `<div id="root">${inner}</div>`),
);
console.log(
  `✅ prerender 完成：注入 ${inner.length.toLocaleString()} 字元到 dist/index.html`,
);
