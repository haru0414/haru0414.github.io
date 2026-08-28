// 校準徽章課名的字級（src/data/badges.ts 的 fit 欄位）。
//
// 官方徽章是在瀏覽器裡量測後把縮放值寫進 --fit-scale。本站的 heading 字型
// 比官方寬，直接沿用官方數值會多折一行、撐破封蠟框並壓到年份那行。
// 這支做同一件事：逐張由大往小試字級，取第一個不溢出的值，寫回資料檔。
// 量測結果烘進資料檔，執行期就不必再算。
//
// 什麼時候要重跑：換 heading 字型、改課名、或動到 AcademyBadge 的版面比例。
//
// 用法：
//   npm run build
//   (cd dist && python3 -m http.server 4177)
//   npm i -D playwright-core && node scripts/calibrate-badge-fit.mjs
import { chromium } from "playwright-core";
import { readFile, writeFile } from "node:fs/promises";

const EXECUTABLE =
  process.env.PLAYWRIGHT_CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const PAGE = process.env.CERTS_URL || "http://localhost:4177/certs/";
const DATA = "src/data/badges.ts";

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(PAGE, { waitUntil: "networkidle" });

// 圖示是 lazy load，捲完整頁才會全部就位；字級量測也要等字型下載完
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

const fits = await page.evaluate(() => {
  const out = {};
  for (const box of document.querySelectorAll("[data-badge]")) {
    const inner = box.querySelector("[data-badge-title]");
    const wrap = inner.parentElement;
    let best = 0.5;
    for (let f = 1.4; f >= 0.5; f -= 0.01) {
      box.style.setProperty("--badge-fit", f.toFixed(2));
      inner.getBoundingClientRect(); // 強制重新排版再量
      // 高度留 2% 餘裕吸收次像素捨入；寬度只擋真正的橫向溢出
      const fitsH = inner.scrollHeight <= wrap.clientHeight * 0.98;
      const fitsW = inner.scrollWidth <= wrap.clientWidth * 1.005;
      if (fitsH && fitsW) {
        best = Number(f.toFixed(2));
        break;
      }
    }
    box.style.setProperty("--badge-fit", String(best));
    out[box.getAttribute("data-badge")] = best;
  }
  return out;
});
await browser.close();

let src = await readFile(DATA, "utf8");
let patched = 0;
for (const [slug, fit] of Object.entries(fits)) {
  const re = new RegExp(`(\\{ slug: "${slug}".*?fit: )[0-9.]+`);
  src = src.replace(re, (_, head) => {
    patched += 1;
    return head + fit;
  });
  console.log(`${slug.padEnd(30)} fit: ${fit}`);
}
await writeFile(DATA, src);
console.log(`\n${patched} / ${Object.keys(fits).length} 筆寫回 ${DATA}`);
