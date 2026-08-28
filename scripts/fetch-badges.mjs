// Claude Academy 徽章素材抓取（一次性，素材已在 repo 裡就不必再跑）。
//
// 為什麼是公開的 /verify/<code> 而不是 /badges/<uuid>：
// 後者要登入，headless 一律被導到登入頁；前者是給人查證用的公開頁，
// 拿得到一模一樣的封蠟外框與課程圖示。
//
// 產出：
//   public/badges/<slug>.svg   ← 各課程專屬的 pictogram（外框是 20 張共用的，寫死在元件裡）
//   scripts/.badges-meta.json  ← 標題與配色，用來核對 src/data/badges.ts 沒抄錯
//
// 用法：npm i -D playwright-core && node scripts/fetch-badges.mjs
// （playwright-core 沒列進 package.json——一次性腳本不值得讓每次 install 都多裝它）
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// 機器上快取的 Chrome for Testing（專案本身沒裝 playwright 的瀏覽器）
const EXECUTABLE =
  process.env.PLAYWRIGHT_CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const OUT_DIR = join(process.cwd(), "public/badges");

// slug → 公開驗證碼。順序即 src/data/badges.ts 的順序，方便對照。
const BADGES = [
  ["claude-101", "94ca3067bc8e6316e3e7174579285add"],
  ["claude-platform-101", "93878e3a742994dc38237859aa3c374b"],
  ["claude-code-101", "ba44287846d1dea05bf0e4d736a97542"],
  ["claude-code-in-action", "4509f670f44d3b9498781b0752d411fa"],
  ["claude-cowork-intro", "372a144b983b48e19efc263f16e2700b"],
  ["building-with-claude-api", "24c121b1f26db62a6ef81e20a04bdfed"],
  ["mcp-intro", "defab9d72760162fb8bda6621c0f1296"],
  ["mcp-advanced", "1d34dd7502fbc52d74282cd72aef9bed"],
  ["claude-bedrock", "87c7a3128628f5ef190519ef994f3f34"],
  ["claude-vertex-ai", "fa7568e5f89ee279fcf5d1ae23cfd629"],
  ["ai-fluency-foundations", "f8533490dcbff6e06d4c12c4afd0fa03"],
  ["ai-fluency-builders", "96bf11964b8dfeb61d39e6f261bbbd24"],
  ["ai-fluency-creative", "df2fbb72ffd3e810d21ef785100de00a"],
  ["ai-fluency-students", "9f601d8b44aaf045ee885ac078102817"],
  ["ai-fluency-educators", "4b13e17d08838c0eaaca353c00101e2e"],
  ["ai-fluency-pk12", "15ef1ee9d5ad07b30cc88d378c25184e"],
  ["teaching-ai-fluency", "b924ec27dd75bad0f7debfad6f8f46e7"],
  ["ai-fluency-nonprofits", "172bceb1be3757823aa224a0bbb7f204"],
  ["ai-fluency-small-business", "00c2bb092dd058d48fd0a92f09349e9e"],
  ["ai-capabilities-limitations", "d8414330af9a013c50e027be19c82542"],
];

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage();
const meta = [];

for (const [slug, code] of BADGES) {
  await page.goto(`https://academy.claude.com/verify/${code}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForSelector('svg[data-cds="Pictogram"]', { timeout: 30000 });

  const data = await page.evaluate(() => {
    const svg = document.querySelector('svg[data-cds="Pictogram"]');
    // 圖示掛在帶 --cds-pictogram-highlight-default 的容器上，強調色就是徽章配色
    const host = svg.closest("[style*='--cds-pictogram-highlight-default']");
    const accent = host
      ? host.style.getPropertyValue("--cds-pictogram-highlight-default").trim()
      : "";
    const lines = (document.body.innerText || "").split("\n").map((s) => s.trim());
    const i = lines.findIndex((l) => /COURSE COMPLETION BADGE/i.test(l));
    return { svg: svg.outerHTML, accent, title: i >= 0 ? lines[i + 1] : "" };
  });

  // currentColor 在 <img> 裡沒有繼承來源，會被當成黑色；換成徽章自己的墨色。
  // Tailwind 的 class 在獨立檔案裡沒有樣式表可套，換成實際的 fill。
  let svg = data.svg
    .replace(/currentColor/g, "#141413")
    .replace(/class="fill-pictogram-highlight-default"/g, `fill="${data.accent}"`)
    .replace(/ class="[^"]*"/g, "");

  // 獨立 .svg 走 XML 解析：重複的 xmlns 會直接解析失敗（整張圖不顯示），
  // 所以只在原本沒有的時候補。
  if (!/<svg[^>]*\sxmlns=/.test(svg)) {
    svg = svg.replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  await writeFile(join(OUT_DIR, `${slug}.svg`), svg);
  meta.push({ slug, title: data.title, accent: data.accent, bytes: svg.length });
  console.log(`${slug.padEnd(30)} ${data.accent}  ${data.title}`);
}

await writeFile(
  join(process.cwd(), "scripts/.badges-meta.json"),
  JSON.stringify(meta, null, 2),
);
await browser.close();
console.log(`\n${meta.length} 個圖示寫入 public/badges/`);
