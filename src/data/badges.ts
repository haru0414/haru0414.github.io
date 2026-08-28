// 課程／平台徽章。
//
// 目前只有 Claude Academy 一家，但發證單位是資料欄位而不是寫死的前提：
// 之後要加 AWS、Google Cloud 之類的，就多一個 issuer、多一組 group、
// 再配一個畫那家美術樣式的元件——版面結構不用改。
//
// Claude Academy 的細節：官方 /badges/<id> 要登入才看得到，所以對外連結
// 一律用公開的 /verify/<code>，任何人點進去都能查證。圖示是
// public/badges/<slug>.svg，用 scripts/fetch-badges.mjs 從官方頁面抓下來的。
// title 保留英文原名：這是官方核發的名稱，翻譯過去反而查不到。

/** 發證單位。新增一家就在這裡加一個值，並補上對應的徽章元件。 */
export type BadgeIssuer = "claude-academy";

export type BadgeTone = "orange" | "purple" | "green";
/** 分組是各發證單位自己的分類，不同單位不共用 */
export type BadgeGroup = "core" | "dev" | "fluency";

export type Badge = {
  slug: string;
  title: string;
  issuer: BadgeIssuer;
  /** 官方公開驗證碼，組成 https://academy.claude.com/verify/<code> */
  code: string;
  tone: BadgeTone;
  group: BadgeGroup;
  /**
   * 課名的字級縮放（--badge-fit）。
   *
   * 官方是在瀏覽器裡量測後寫進 --fit-scale；本站的 heading 字型比官方寬，
   * 直接抄官方數值會多折行、撐破封蠟框並壓到年份，所以改成自己量：
   * scripts/calibrate-badge-fit.mjs 會逐張找出不溢出的最大字級，把結果寫回這裡。
   * 量測結果烘進資料檔，執行期就不必再算。
   */
  fit: number;
  featured?: true;
};

/** Claude Academy 這批的核發日（同一天完成，不必每筆重複存） */
export const ISSUED_AT = "2026-08-28";

export const badges: Badge[] = [
  // ── Claude 基礎 ────────────────────────────────────────────────
  { slug: "claude-101", issuer: "claude-academy", title: "Claude 101", code: "94ca3067bc8e6316e3e7174579285add", tone: "orange", group: "core", fit: 1.09 },
  { slug: "claude-platform-101", issuer: "claude-academy", title: "Claude Platform 101", code: "93878e3a742994dc38237859aa3c374b", tone: "orange", group: "core", fit: 0.92, featured: true },
  { slug: "claude-code-101", issuer: "claude-academy", title: "Claude Code 101", code: "ba44287846d1dea05bf0e4d736a97542", tone: "orange", group: "core", fit: 1.08, featured: true },
  { slug: "claude-code-in-action", issuer: "claude-academy", title: "Claude Code in Action", code: "4509f670f44d3b9498781b0752d411fa", tone: "green", group: "core", fit: 0.93, featured: true },
  { slug: "claude-cowork-intro", issuer: "claude-academy", title: "Introduction to Claude Cowork", code: "372a144b983b48e19efc263f16e2700b", tone: "green", group: "core", fit: 0.77 },

  // ── 開發與整合 ─────────────────────────────────────────────────
  { slug: "building-with-claude-api", issuer: "claude-academy", title: "Building with the Claude API", code: "24c121b1f26db62a6ef81e20a04bdfed", tone: "orange", group: "dev", fit: 0.77, featured: true },
  { slug: "mcp-intro", issuer: "claude-academy", title: "Introduction to Model Context Protocol", code: "defab9d72760162fb8bda6621c0f1296", tone: "green", group: "dev", fit: 0.74, featured: true },
  { slug: "mcp-advanced", issuer: "claude-academy", title: "Model Context Protocol: Advanced Topics", code: "1d34dd7502fbc52d74282cd72aef9bed", tone: "green", group: "dev", fit: 0.68, featured: true },
  { slug: "claude-bedrock", issuer: "claude-academy", title: "Claude with Amazon Bedrock", code: "87c7a3128628f5ef190519ef994f3f34", tone: "purple", group: "dev", fit: 0.74 },
  { slug: "claude-vertex-ai", issuer: "claude-academy", title: "Claude with Google Cloud's Vertex AI", code: "fa7568e5f89ee279fcf5d1ae23cfd629", tone: "purple", group: "dev", fit: 0.74 },

  // ── AI Fluency ────────────────────────────────────────────────
  { slug: "ai-fluency-foundations", issuer: "claude-academy", title: "AI Fluency: Framework & Foundations", code: "f8533490dcbff6e06d4c12c4afd0fa03", tone: "orange", group: "fluency", fit: 0.74 },
  { slug: "ai-fluency-builders", issuer: "claude-academy", title: "AI Fluency for Builders", code: "96bf11964b8dfeb61d39e6f261bbbd24", tone: "orange", group: "fluency", fit: 1 },
  { slug: "ai-capabilities-limitations", issuer: "claude-academy", title: "AI Capabilities and Limitations", code: "d8414330af9a013c50e027be19c82542", tone: "orange", group: "fluency", fit: 0.75 },
  { slug: "ai-fluency-creative", issuer: "claude-academy", title: "AI Fluency for Creative Work", code: "df2fbb72ffd3e810d21ef785100de00a", tone: "purple", group: "fluency", fit: 0.82 },
  { slug: "ai-fluency-students", issuer: "claude-academy", title: "AI Fluency for students", code: "9f601d8b44aaf045ee885ac078102817", tone: "purple", group: "fluency", fit: 0.96 },
  { slug: "ai-fluency-educators", issuer: "claude-academy", title: "AI Fluency for educators", code: "4b13e17d08838c0eaaca353c00101e2e", tone: "green", group: "fluency", fit: 0.86 },
  { slug: "ai-fluency-pk12", issuer: "claude-academy", title: "AI Fluency for pK–12 Educators", code: "15ef1ee9d5ad07b30cc88d378c25184e", tone: "purple", group: "fluency", fit: 0.74 },
  { slug: "teaching-ai-fluency", issuer: "claude-academy", title: "Teaching AI Fluency", code: "b924ec27dd75bad0f7debfad6f8f46e7", tone: "purple", group: "fluency", fit: 1.08 },
  { slug: "ai-fluency-nonprofits", issuer: "claude-academy", title: "AI Fluency for nonprofits", code: "172bceb1be3757823aa224a0bbb7f204", tone: "green", group: "fluency", fit: 0.85 },
  { slug: "ai-fluency-small-business", issuer: "claude-academy", title: "AI Fluency for Small Businesses", code: "00c2bb092dd058d48fd0a92f09349e9e", tone: "orange", group: "fluency", fit: 0.74 },
];

export const featuredBadges = badges.filter((b) => b.featured);

/** 發證單位的顯示順序，以及各自的分組順序 */
export const issuerGroups: { issuer: BadgeIssuer; groups: BadgeGroup[] }[] = [
  { issuer: "claude-academy", groups: ["core", "dev", "fluency"] },
];

export const badgesIn = (issuer: BadgeIssuer, group: BadgeGroup) =>
  badges.filter((b) => b.issuer === issuer && b.group === group);

export const countBy = (issuer: BadgeIssuer) => badges.filter((b) => b.issuer === issuer).length;

export const verifyUrl = (b: Badge) => `https://academy.claude.com/verify/${b.code}`;
