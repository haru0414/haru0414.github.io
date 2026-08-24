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

function buildHtml({
  html,
  title,
  description,
  canonical,
  jsonLd,
  image,
  ogType,
  robots,
  publishedTime,
  htmlLang,
  alternates,
}) {
  let out = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );
  // <html lang> 要跟著該頁語言走，螢幕閱讀器與搜尋引擎都讀這個
  if (htmlLang) {
    out = out.replace(/<html lang="[^"]*"/, `<html lang="${escAttr(htmlLang)}"`);
  }
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`);

  // 模板裡的 meta 有些被排版成多行，樣式一律用 \s+ 跨行比對——寫死單一空格
  // 就會配不到多行標籤。String.replace 配不到時是靜默回傳原字串，不丟錯，
  // 所以逐項記下有沒有真的換掉，交給呼叫端讓 build 失敗。
  const missed = [];
  const setMeta = (attr, key, value) => {
    if (value === undefined) return;
    const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")([^"]*)(")`);
    if (!re.test(out)) {
      missed.push(key);
      return;
    }
    out = out.replace(re, (_m, a, _old, b) => `${a}${escAttr(value)}${b}`);
  };

  setMeta("name", "description", description);
  setMeta("name", "robots", robots);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:type", ogType);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  // 每篇文章可以有自己的分享圖。沒設就沿用站台預設圖，
  // 社群平台一律要絕對網址，相對路徑抓不到
  if (image) {
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:image", image);
  }

  const re = /(<link\s+rel="canonical"\s+href=")([^"]*)(")/;
  if (re.test(out)) {
    out = out.replace(re, (_m, a, _old, b) => `${a}${escAttr(canonical)}${b}`);
  } else {
    missed.push("link:canonical");
  }

  // 只有文章頁才補發表時間；模板沒有這個標籤，所以是注入而非取代。
  // 結構化資料同樣注入靜態 HTML 而非由 React 渲染——爬蟲讀的是這份檔案
  const injected = [];
  // hreflang：同一頁的各語言版本互相指認。模板沒有這些標籤，一律注入
  for (const alt of alternates ?? []) {
    injected.push(
      `<link rel="alternate" hreflang="${escAttr(alt.hreflang)}" href="${escAttr(alt.href)}" />`,
    );
  }
  if (publishedTime) {
    injected.push(
      `<meta property="article:published_time" content="${escAttr(publishedTime)}" />`,
    );
  }
  if (jsonLd) {
    injected.push(
      `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    );
  }
  if (injected.length) {
    out = out.replace("</head>", `    ${injected.join("\n    ")}\n  </head>`);
  }
  return { out, missed };
}

let count = 0;
for (const route of routes) {
  const page = await renderRoute(route);
  if (!page.html || page.html.trim().length < 1000) {
    console.error(`❌ prerender 失敗：${route} 輸出過少（${page.html?.length ?? 0}）`);
    process.exit(1);
  }
  const { out, missed } = buildHtml(page);
  // 模板排版一改就可能讓某個 meta 配不到。與其安靜地整站沿用預設值，
  // 不如當場讓 build 掛掉
  if (missed.length) {
    console.error(
      `❌ prerender 失敗：${route} 有 meta 沒被取代 → ${missed.join(", ")}（index.html 的標籤格式可能變了）`,
    );
    process.exit(1);
  }
  // 端到端再確認一次：描述真的寫進輸出，而不是留著模板預設值
  if (page.description && !out.includes(escAttr(page.description))) {
    console.error(`❌ prerender 失敗：${route} 的 description 沒有出現在輸出中`);
    process.exit(1);
  }
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
// /500 是設計展示頁，已標 noindex，就不該再出現在 sitemap 裡自相矛盾
const indexable = routes.filter((r) => r !== "/500" && r !== "/en/500");
const urls = indexable
  .map((r) => {
    const loc = r === "/" ? `${ORIGIN}/` : `${ORIGIN}${r}/`;
    // 語言前綴不影響權重判斷，先剝掉再看是哪一頁
    const base = r === "/en" ? "/" : r.replace(/^\/en/, "");
    // 首頁最常變動，文章次之，狀態頁最低
    const priority =
      base === "/" ? "1.0" : base.startsWith("/blog") ? "0.8" : "0.6";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`✅ sitemap.xml：${indexable.length} 個網址`);

// GitHub Pages 對未知路徑的 fallback：用「空 root」模板（非 prerender 版），
// 載入時走 client createRoot 乾淨渲染當前路由，避免與首頁 SSR 內容 hydration
// 不一致；App 內 catch-all 會把無對應路由導回 /。
writeFileSync(join(DIST, "404.html"), template);

console.log(`✅ prerender 完成：${count} 個路由 + 404.html`);
