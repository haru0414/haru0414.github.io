// /surf 頁素材：把 _source/ 的 2400px 原圖轉成 AVIF + WebP 三檔寬度（響應式 srcset 用）。
// 原圖不進 git（見 .gitignore），要重新取得時用下方 SOURCES 的 Unsplash ID 重抓。
// 用法：node scripts/optimize-surf-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(root, "src/assets/images/surf");
const SRC = join(DIR, "_source");

// name → Unsplash photo id（全數為免費授權，非 Unsplash+）
export const SOURCES = {
  "s0-hero": "1494879540385-bc170b0878a7",
  "s1-paddle-out": "1722573021678-78922ef03faa",
  "s2-lineup": "1655664333703-a32ba1fb2fb7",
  // 由 s3-take-off-1 裁成 2.4:1 寬幅（非另外下載）：S3 改單張橫向平移後，
  // 三格並排的分割感消失，畫面保持連續
  "s3-takeoff-wide": "1530870110042-98b2cb110834",
  "s3-take-off-1": "1530870110042-98b2cb110834",
  "s3-take-off-2": "1455264745730-cb3b76250ae8",
  "s3-take-off-3": "1696187489072-ff592ff9df17",
  "s4-barrel": "1688263638788-fa120d93bbc3",
  "s5-wipeout": "1560364897-91578ff41817",
  "s6-surface": "1581459641652-d1de50a79284",
  "s7-sunset": "1475706997440-9f2a24435b83",
};

// 帶 alpha 的去背前景層。與場景圖分開處理：必須保留透明通道，
// 且 AVIF/WebP 的 alpha 壓縮參數與不透明圖不同。
const ALPHA_SOURCES = {
  "s4-barrel-cut": "使用者自行去背，來源同 s4-barrel",
};

const WIDTHS = [768, 1280, 1920];
// 橫向平移那張是以「高度撐滿視口」呈現，實際渲染寬度可達視口高的 2.4 倍，
// 在高像素密度螢幕上 1920 不夠用，額外補一檔原生尺寸
const WIDE_EXTRA = { "s3-takeoff-wide": 2400 };
const kb = (p) => statSync(p).size / 1024;

mkdirSync(DIR, { recursive: true });
let total = 0;
// 供 <img width/height> 使用，避免 CLS；由最大尺寸推導原始比例
const manifest = {};

for (const name of Object.keys(SOURCES)) {
  const src = join(SRC, `${name}.jpg`);
  if (!existsSync(src)) {
    console.error(`✗ 缺少原圖 ${src}（用 SOURCES["${name}"] 的 id 重抓）`);
    process.exitCode = 1;
    continue;
  }
  const line = [];
  for (const w of WIDTHS) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    const avif = join(DIR, `${name}-${w}.avif`);
    const webp = join(DIR, `${name}-${w}.webp`);
    // AVIF 壓得更小但編碼慢；effort 4 是品質與時間的平衡點
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(avif);
    await base.clone().webp({ quality: 74 }).toFile(webp);
    total += kb(avif);
    line.push(`${w}:${kb(avif).toFixed(0)}/${kb(webp).toFixed(0)}KB`);
    if (w === WIDTHS.at(-1)) {
      const m = await sharp(avif).metadata();
      manifest[name] = { w: m.width, h: m.height };
    }
  }
  const extra = WIDE_EXTRA[name];
  if (extra) {
    const base = sharp(src).resize({ width: extra, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(join(DIR, `${name}-${extra}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(join(DIR, `${name}-${extra}.webp`));
    const m = await sharp(join(DIR, `${name}-${extra}.avif`)).metadata();
    manifest[name] = { w: m.width, h: m.height };
    line.push(`${extra}:${kb(join(DIR, `${name}-${extra}.avif`)).toFixed(0)}KB`);
  }
  console.log(`✓ ${name.padEnd(15)} ${line.join("  ")}`);
}
for (const name of Object.keys(ALPHA_SOURCES)) {
  const src = join(SRC, `${name}.png`);
  if (!existsSync(src)) {
    console.error(`✗ 缺少去背原圖 ${src}`);
    process.exitCode = 1;
    continue;
  }
  const line = [];
  for (const w of WIDTHS) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    const avif = join(DIR, `${name}-${w}.avif`);
    const webp = join(DIR, `${name}-${w}.webp`);
    await base.clone().avif({ quality: 50, effort: 4 }).toFile(avif);
    await base.clone().webp({ quality: 72, alphaQuality: 90 }).toFile(webp);
    line.push(`${w}:${kb(avif).toFixed(0)}/${kb(webp).toFixed(0)}KB`);
    if (w === WIDTHS.at(-1)) {
      const m = await sharp(avif).metadata();
      manifest[name] = { w: m.width, h: m.height };
    }
  }
  console.log(`✓ ${name.padEnd(15)} ${line.join("  ")}  (alpha)`);
}

writeFileSync(join(DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nAVIF 全尺寸合計 ${(total / 1024).toFixed(2)} MB（實際只載入 srcset 命中的那一檔）`);
