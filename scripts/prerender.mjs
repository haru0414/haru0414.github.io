// 建置後 prerender：用 SSR bundle（React renderToString）把首頁與每個專案頁
// 各自渲染成靜態 HTML，讓 GitHub Pages 直接服務（直連 / 重新整理皆可），
// 首屏不必等 JS，client 端再 hydrate 接手。
//
// 用 renderToString 而非 browser snapshot：React 自己產生 HTML，與 client
// hydration 逐字一致，避免 CSSOM 序列化落差造成的 hydration mismatch。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const serverEntry = join(ROOT, "dist-server", "entry-server.js");
const { renderRoute, routes } = await import(pathToFileURL(serverEntry).href);

const template = readFileSync(join(DIST, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  console.error('❌ prerender 失敗：dist/index.html 找不到空的 <div id="root"></div>');
  process.exit(1);
}

const escAttr = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml({ html, title, description, canonical, jsonLd, image }) {
  let out = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`);
  const setAttr = (re, value) =>
    (out = out.replace(re, (_m, a, _old, b) => `${a}${escAttr(value)}${b}`));
  // content="..." 形式的 meta
  for (const name of [
    'meta name="description"',
    'meta property="og:title"',
    'meta property="og:description"',
    'meta property="og:url"',
    'meta name="twitter:title"',
    'meta name="twitter:description"',
  ]) {
    const isTitle = /title/.test(name);
    const isUrl = /og:url/.test(name);
    const val = isUrl ? canonical : isTitle ? title : description;
    setAttr(new RegExp(`(<${name} content=")([^"]*)(")`), val);
  }
  // canonical link
  setAttr(/(<link rel="canonical" href=")([^"]*)(")/, canonical);

  // 每篇文章可以有自己的分享圖。沒設就沿用站台預設圖，
  // 社群平台一律要絕對網址，相對路徑抓不到
  if (image) {
    setAttr(/(<meta\s+property="og:image"\s+content=")([^"]*)(")/, image);
    setAttr(/(<meta\s+name="twitter:image"\s+content=")([^"]*)(")/, image);
  }

  // 結構化資料：讓搜尋引擎知道這是誰寫的、是什麼類型的內容。
  // 注入靜態 HTML 而非由 React 渲染——爬蟲讀的是這份檔案
  if (jsonLd) {
    out = out.replace(
      "</head>",
      `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
    );
  }
  return out;
}

let count = 0;
for (const route of routes) {
  const page = renderRoute(route);
  if (!page.html || page.html.trim().length < 1000) {
    console.error(`❌ prerender 失敗：${route} 輸出過少（${page.html?.length ?? 0}）`);
    process.exit(1);
  }
  const out = buildHtml(page);
  const file =
    route === "/"
      ? join(DIST, "index.html")
      : join(DIST, route.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  count++;
}

// sitemap.xml：路由清單由 entry-server 匯出，不必另外維護一份，
// 新增頁面或文章時不會忘記更新
const ORIGIN = "https://www.haruli.com";
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((r) => {
    const loc = r === "/" ? `${ORIGIN}/` : `${ORIGIN}${r}/`;
    // 首頁最常變動，文章次之，狀態頁最低
    const priority = r === "/" ? "1.0" : r.startsWith("/blog") ? "0.8" : "0.6";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`✅ sitemap.xml：${routes.length} 個網址`);

// GitHub Pages 對未知路徑的 fallback：用「空 root」模板（非 prerender 版），
// 載入時走 client createRoot 乾淨渲染當前路由，避免與首頁 SSR 內容 hydration
// 不一致；App 內 catch-all 會把無對應路由導回 /。
writeFileSync(join(DIST, "404.html"), template);

console.log(`✅ prerender 完成：${count} 個路由 + 404.html`);
