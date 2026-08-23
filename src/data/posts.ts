/**
 * 文章來源：src/content/posts/*.md。
 * markdown 由建置期的 Vite plugin（scripts/vite-plugin-markdown.mjs）轉成
 * HTML，所以解析器不會進客戶端 bundle——訪客只是來看首頁時，不該被迫
 * 下載一份 markdown 解析器。
 *
 * 新增一篇文章 = 新增一個 .md 檔，不必動程式碼。
 */
/**
 * 一張圖的所有輸出格式，由建置期的 markdown plugin 解析。
 *
 * avif / webp 是 srcset 字串；沒跑過 `npm run images:blog` 的圖會是空字串，
 * 這時 <ResponsiveImg> 就退回單純的 <img>。
 */
export type ResponsiveImage = {
  /** 不支援 srcset 時的 <img src> */
  src: string;
  avif: string;
  webp: string;
  width: number | null;
  height: number | null;
  /** 社群分享卡用的實體檔案（爬蟲對 AVIF 支援參差，一律給 WebP） */
  og: string;
};

/**
 * 沒有專屬封面時的預設縮圖。
 *
 * 變體清單寫死在這裡，因為它不屬於任何一篇文章、沒有 frontmatter 可解析。
 * 換圖時記得重跑 `npm run images:blog` 並對照這裡的寬度。
 */
const DEFAULT_COVER_WIDTHS = [160, 400, 768];
export const DEFAULT_COVER: ResponsiveImage = {
  src: "/blog/default-cover-768.webp",
  avif: DEFAULT_COVER_WIDTHS.map((w) => `/blog/default-cover-${w}.avif ${w}w`).join(", "),
  webp: DEFAULT_COVER_WIDTHS.map((w) => `/blog/default-cover-${w}.webp ${w}w`).join(", "),
  width: 800,
  height: 800,
  og: "/blog/default-cover-768.webp",
};

type Loaded = {
  meta: Record<string, string>;
  html: string;
  headings: { id: string; text: string }[];
  chars: number;
  cover: ResponsiveImage | null;
};

// eager：prerender 需要同步取得全部文章（產生列表頁與每篇的靜態 HTML）
const files = import.meta.glob("../content/posts/*.md", { eager: true, import: "default" }) as Record<
  string,
  Loaded
>;

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  html: string;
  minutes: number;
  headings: { id: string; text: string }[];
  chars: number;
  /** 社群分享卡用的封面路徑。沒設封面時為 null，改用站台預設 og 圖 */
  cover: string | null;
  /** 文章頁頂端的封面圖 */
  coverImage: ResponsiveImage | null;
  /** 列表縮圖。沒設封面時退回飯糰預設圖，列表才不會一格有圖一格空著 */
  thumbImage: ResponsiveImage;
  coverAlt: string;
};

export const posts: Post[] = Object.entries(files)
  .map(([path, mod]) => {
    const { meta, html, headings, chars, cover } = mod;
    return {
      slug: meta.slug || path.split("/").pop()!.replace(/\.md$/, ""),
      title: meta.title ?? "(未命名)",
      date: meta.date ?? "",
      summary: meta.summary ?? "",
      tags: meta.tags ? meta.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      html,
      headings,
      chars,
      // og:image 要指向確定被部署的檔案——原圖放在 _source/ 不會進 dist
      cover: cover?.og ?? null,
      coverImage: cover,
      thumbImage: cover ?? DEFAULT_COVER,
      coverAlt: meta.coverAlt ?? meta.title ?? "",
      // 中文沒有空格分詞，用字元數估算比 split(" ") 準得多
      minutes: Math.max(1, Math.round(chars / 450)),
    };
  })
  // 新的排前面
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/**
 * 標籤 → 網址 slug 的對照表。
 *
 * 中文標籤若直接放進網址會被編碼成 %E6%95%88%E8%83%BD，難讀也難分享；
 * 含空白的標籤會變成 %20。所以每個標籤都給一個固定的英文 slug。
 *
 * 新增標籤時要一併在這裡登記——沒登記的會退回自動轉換，中文標籤那樣
 * 會產生無效的 slug，dev 模式下會在 console 提醒。
 */
const BOARD_SLUGS: Record<string, string> = {
  效能: "performance",
  React: "react",
  量測: "measurement",
  "GitHub Pages": "github-pages",
  除錯: "debugging",
};

const autoSlug = (tag: string) =>
  tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export function boardSlug(tag: string) {
  const mapped = BOARD_SLUGS[tag];
  if (mapped) return mapped;
  const fallback = autoSlug(tag);
  if (import.meta.env.DEV && !fallback) {
    console.warn(`[posts] 標籤「${tag}」缺少 slug，請在 BOARD_SLUGS 登記`);
  }
  return fallback || encodeURIComponent(tag);
}

export function boardFromSlug(slug: string) {
  return allBoards().find(([tag]) => boardSlug(tag) === slug)?.[0] ?? null;
}

/** 所有標籤與其文章數，依出現次數排序 */
export function allBoards() {
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
