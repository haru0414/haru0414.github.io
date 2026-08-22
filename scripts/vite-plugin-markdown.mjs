import { marked } from "marked";
import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

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
 * 幫內文圖片補上 width / height / loading / decoding。
 *
 * 尺寸在建置期直接量檔案，不必手寫——沒有 width/height 的圖會在載入完成
 * 那一刻把後面的內容往下推（CLS），這是文章頁最常見的版面跳動來源。
 */
async function enhanceImages(html, publicDir) {
  const tags = [...html.matchAll(/<img\s+src="([^"]+)"([^>]*)>/g)];
  let out = html;
  for (const [full, src, rest] of tags) {
    let dims = "";
    if (src.startsWith("/")) {
      const file = join(publicDir, src);
      if (existsSync(file)) {
        try {
          const m = await sharp(file).metadata();
          if (m.width && m.height) dims = ` width="${m.width}" height="${m.height}"`;
        } catch {
          // 量不到就不補，總比寫錯尺寸好
        }
      }
    }
    out = out.replace(full, `<img src="${src}"${dims} loading="lazy" decoding="async"${rest}>`);
  }
  return out;
}

export default function markdownPlugin({ publicDir = "public" } = {}) {
  marked.setOptions({ gfm: true, breaks: false });
  return {
    name: "markdown-loader",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null;
      const { meta, body } = parseFrontmatter(code);
      const { html: raw, headings } = withHeadingIds(marked.parse(body));
      const html = await enhanceImages(raw, publicDir);
      // 去掉程式碼區塊再算字數：範例程式不該計入閱讀量
      const chars = body.replace(/```[\s\S]*?```/g, "").replace(/\s/g, "").length;
      return {
        code: `export default ${JSON.stringify({ meta, html, headings, chars })};`,
        map: null,
      };
    },
  };
}
