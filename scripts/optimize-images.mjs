// 一次性圖片最佳化：把過大的來源圖轉成尺寸合理的 WebP，
// public/ 的 og-image、favicon 直接重生成正確尺寸。
// 用法：node scripts/optimize-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { statSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(root, p);

const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;

// 來源圖 → WebP（保留原檔，輸出同名 .webp）
const webpJobs = [
  { in: "src/assets/images/photo_1.jpeg", out: "src/assets/images/photo_1.webp", width: 800, q: 80 },
  { in: "src/assets/images/photo_2.jpeg", out: "src/assets/images/photo_2.webp", width: 800, q: 80 },
  { in: "src/assets/images/onigiri/cover.jpeg", out: "src/assets/images/onigiri/cover.webp", width: 500, q: 80 },
  { in: "src/assets/images/onigiri/stickers/1.png", out: "src/assets/images/onigiri/stickers/1.webp", width: 256, q: 85, alpha: true },
  { in: "src/assets/images/onigiri/stickers/3.png", out: "src/assets/images/onigiri/stickers/3.webp", width: 256, q: 85, alpha: true },
  { in: "src/assets/images/website/www.nday.com.tw_.png", out: "src/assets/images/website/www.nday.com.tw_.webp", width: 1400, q: 78 },
  { in: "src/assets/images/website/www.jiahe.net.tw_.png", out: "src/assets/images/website/www.jiahe.net.tw_.webp", width: 1400, q: 78 },
  { in: "src/assets/images/website/www.asterisk-tech.com_.png", out: "src/assets/images/website/www.asterisk-tech.com_.webp", width: 1400, q: 78 },
];

for (const j of webpJobs) {
  await sharp(r(j.in))
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: j.q, alphaQuality: j.alpha ? 90 : undefined })
    .toFile(r(j.out));
  console.log(`✓ ${j.out}  ${kb(r(j.in))} → ${kb(r(j.out))}`);
}

// public/og-image：社群分享圖標準 1200×630，由原圖智慧裁切（對焦最顯著區域 / 人臉）
await sharp(r("public/og-image.jpg"))
  .resize({ width: 1200, height: 630, fit: "cover", position: sharp.strategy.attention })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(r("public/og-image.opt.jpg"));
console.log(`✓ public/og-image.opt.jpg  → ${kb(r("public/og-image.opt.jpg"))}`);

// favicon：縮成 64×64 PNG
await sharp(r("public/favicon.jpg"))
  .resize(64, 64, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toFile(r("public/favicon.png"));
console.log(`✓ public/favicon.png  → ${kb(r("public/favicon.png"))}`);
