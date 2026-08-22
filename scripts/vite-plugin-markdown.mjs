import { marked } from "marked";
import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

/**
 * 建置期把 .md 轉成 JS 模組，匯出 { meta, html, headings }。
 *
 * 這樣 marked 只在建置時執行，完全不會進客戶端 bundle——
 * 先前直接在 posts.ts 裡呼叫 marked，等於每個訪客都要下載一份
 * markdown 解析器，即使他們只是來看首頁。
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

// 幫 h2 補 id 並收集目錄。用序號而非中文轉拼音：後者不好讀也容易碰撞
function withHeadingIds(html) {
  const headings = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner) => {
    const id = `h-${headings.length + 1}`;
    headings.push({ id, text: inner.replace(/<[^>]+>/g, "").trim() });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, headings };
}

/**
 * 內文欄寬。桌機實測是 496px（容器 max-w-5xl 扣掉側欄、作者欄與 padding），
 * 取 520px 留一點餘裕。寫 100vw 會讓瀏覽器高估、白白多下載一階尺寸。
 */
const PROSE_SIZES = "(min-width: 1024px) 520px, calc(100vw - 2rem)";

/**
 * scripts/optimize-blog-images.mjs 的產出清單：哪張圖有哪些寬度、原圖多大。
 *
 * 用清單而不是拿檔名去試探檔案系統——原圖若比最小階還窄，輸出的寬度就不會
 * 落在預設的階梯上，猜不到；而且原圖本身放在 _source/ 不會被部署，
 * 尺寸也只有清單裡才有。
 */
const MANIFEST = join(
  resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  "src/content/images/manifest.json",
);

function loadManifest() {
  const file = MANIFEST;
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

async function measure(file) {
  if (!existsSync(file)) return null;
  try {
    const m = await sharp(file).metadata();
    return m.width && m.height ? { width: m.width, height: m.height } : null;
  } catch {
    // 量不到就當作沒有，總比寫錯尺寸好
    return null;
  }
}

/**
 * 解析一張 public/ 底下的圖，回傳能直接餵給 <picture> 的資料。
 *
 * 沒跑過 `npm run images:blog` 的圖不在清單裡，avif / webp 會是空字串，
 * 呼叫端就退回單純的 <img>——所以作者永遠只要寫原始檔名，
 * 跑不跑最佳化都不會壞。
 */
async function resolveImage(src, publicDir, manifest) {
  const entry = manifest[src];
  if (!entry) {
    const size = await measure(join(publicDir, src));
    return { src, avif: "", webp: "", width: size?.width ?? null, height: size?.height ?? null, og: src };
  }

  const stem = src.replace(/\.[^.]+$/, "");
  const set = (ext) => entry.widths.map((w) => `${stem}-${w}.${ext} ${w}w`).join(", ");

  // 不支援 srcset 的瀏覽器會直接用 <img src>，給它一張夠用的：
  // 取第一個不小於內文欄寬的階，沒有就用最大的那階
  const fallback = entry.widths.find((w) => w >= 768) ?? entry.widths[entry.widths.length - 1];

  return {
    src: `${stem}-${fallback}.webp`,
    avif: set("avif"),
    webp: set("webp"),
    width: entry.width,
    height: entry.height,
    // 社群分享卡用。原圖沒被部署（在 _source/），所以指向確定存在的最大張；
    // 爬蟲對 AVIF 支援參差，一律給 WebP
    og: `${stem}-${entry.widths[entry.widths.length - 1]}.webp`,
  };
}

/**
 * 幫內文圖片補上 width / height / loading / decoding，
 * 有最佳化變體時再升級成 <picture> + srcset。
 *
 * 尺寸在建置期就寫進標籤，不必手寫——沒有 width/height 的圖會在載入完成
 * 那一刻把後面的內容往下推（CLS），這是文章頁最常見的版面跳動來源。
 *
 * 自成一段的圖標上 prose-figure，樣式才知道哪張要撐滿欄寬。這件事不能
 * 交給 CSS 的 :only-child 判斷——它只數元素節點，夾在文字裡的圖同樣會
 * 被當成唯一子元素。
 */
async function enhanceImages(html, publicDir, manifest) {
  const pattern = /<img\s+src="([^"]+)"([^>]*)>/g;

  // 先把尺寸查完（要讀檔），再一次同步改寫，避免同一張圖出現兩次時
  // 逐一 replace 會重複命中第一個位置
  const sources = [...new Set([...html.matchAll(pattern)].map((m) => m[1]).filter((src) => src.startsWith("/")))];
  const resolved = new Map();
  for (const src of sources) resolved.set(src, await resolveImage(src, publicDir, manifest));

  return html.replace(pattern, (full, src, rest, offset) => {
    const img = resolved.get(src);
    if (!img) return full;

    const standalone =
      html.slice(offset - 3, offset) === "<p>" &&
      html.slice(offset + full.length, offset + full.length + 4) === "</p>";
    const dims = img.width ? ` width="${img.width}" height="${img.height}"` : "";
    const figure = standalone ? ' class="prose-figure"' : "";

    if (!img.avif && !img.webp) {
      return `<img src="${img.src}"${dims}${figure} loading="lazy" decoding="async"${rest}>`;
    }

    // sizes 必須反映實際排版寬度：插圖佔滿欄寬，行內小圖維持自己的尺寸。
    // 兩者共用一個值的話，48px 的圖示也會被排成一整欄寬
    const sizes = standalone ? PROSE_SIZES : `${img.width}px`;
    return (
      `<picture${figure}>` +
      `<source type="image/avif" srcset="${img.avif}" sizes="${sizes}">` +
      `<source type="image/webp" srcset="${img.webp}" sizes="${sizes}">` +
      `<img src="${img.src}"${dims} loading="lazy" decoding="async"${rest}>` +
      `</picture>`
    );
  });
}

export default function markdownPlugin({ publicDir = "public" } = {}) {
  marked.setOptions({ gfm: true, breaks: false });
  return {
    name: "markdown-loader",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null;
      // 每次 transform 都重讀清單，不在 plugin 建立時讀一次就好：
      // dev server 常常比 `npm run images:blog` 早啟動。
      // （Vite 不會因為清單變動而重跑這裡，所以產完圖仍要重啟 dev server）
      const manifest = loadManifest();
      const { meta, body } = parseFrontmatter(code);
      const { html: raw, headings } = withHeadingIds(marked.parse(body));
      const html = await enhanceImages(raw, publicDir, manifest);
      // 封面與列表縮圖走同一套解析，只是套用時的 sizes 不同
      const cover = meta.cover ? await resolveImage(meta.cover, publicDir, manifest) : null;
      // 去掉程式碼區塊再算字數：範例程式不該計入閱讀量
      const chars = body.replace(/```[\s\S]*?```/g, "").replace(/\s/g, "").length;
      return {
        code: `export default ${JSON.stringify({ meta, html, headings, chars, cover })};`,
        map: null,
      };
    },
  };
}
