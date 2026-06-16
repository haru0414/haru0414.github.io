// 產生漫畫風 OG 分享卡（1200×630）：左側放完整照片、右側放姓名/職稱/技術。
// 用法：node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(root, p);

const W = 1200;
const H = 630;
const INK = "#1A2332";
const PAPER = "#F2EAD3";
const RED = "#C83E34";
const YELLOW = "#FFC845";
const TEAL = "#2F5C68";

// 照片框（左側）。照片為直式 3933×5244（比例 0.75）
const photoW = 360;
const photoH = 480;
const border = 7;
const frameX = 70;
const frameY = (H - (photoH + border * 2)) / 2;

const photo = await sharp(r("src/assets/images/photo_1.jpeg"))
  .resize({ width: photoW, height: photoH, fit: "cover", position: sharp.strategy.attention })
  .toBuffer();

const tx = 510; // 右側文字起始 x

const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2.4" fill="${INK}"/>
    </pattern>
  </defs>

  <!-- 底色 + 外框 -->
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" fill="none" stroke="${INK}" stroke-width="5"/>

  <!-- 右下角網點 -->
  <rect x="${W - 220}" y="${H - 150}" width="200" height="130" fill="url(#dots)" opacity="0.18"/>

  <!-- 照片框：陰影 + 邊框（照片之後再合成上去，留出邊框） -->
  <rect x="${frameX + 12}" y="${frameY + 12}" width="${photoW + border * 2}" height="${photoH + border * 2}" fill="${INK}"/>
  <rect x="${frameX}" y="${frameY}" width="${photoW + border * 2}" height="${photoH + border * 2}" fill="${INK}"/>

  <!-- 紅星裝飾 -->
  <g transform="translate(${frameX + photoW - 10}, ${frameY - 6}) rotate(12)">
    <path d="M0,-26 L7,-8 L26,-8 L11,4 L17,23 L0,11 L-17,23 L-11,4 L-26,-8 L-7,-8 Z" fill="${YELLOW}" stroke="${INK}" stroke-width="3"/>
  </g>

  <!-- 右側標籤 -->
  <g transform="translate(${tx}, 72)">
    <rect x="3" y="3" width="206" height="46" fill="${INK}"/>
    <rect width="206" height="46" fill="${YELLOW}" stroke="${INK}" stroke-width="3"/>
    <text x="103" y="32" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="24" fill="${INK}" letter-spacing="2">PORTFOLIO</text>
  </g>

  <!-- 姓名（描邊字） -->
  <text x="${tx - 4}" y="220" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="118" fill="${YELLOW}" stroke="${INK}" stroke-width="5" paint-order="stroke" letter-spacing="2">HARU</text>
  <text x="${tx - 4}" y="330" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="118" fill="${RED}" stroke="${INK}" stroke-width="5" paint-order="stroke" letter-spacing="2">LI</text>

  <!-- 職稱 + 紅底線 -->
  <text x="${tx}" y="400" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="34" fill="${INK}">Frontend Developer</text>
  <rect x="${tx}" y="412" width="360" height="8" fill="${RED}"/>

  <!-- 技術 -->
  <text x="${tx}" y="470" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="24" fill="${TEAL}">React · Next.js · TypeScript · Tailwind</text>

  <!-- 網址 -->
  <text x="${tx}" y="545" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="22" fill="${INK}" opacity="0.8">www.haruli.com</text>
</svg>`;

await sharp(Buffer.from(bg))
  .composite([{ input: photo, left: frameX + border, top: Math.round(frameY) + border }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(r("public/og-image.jpg"));

console.log("✓ public/og-image.jpg (manga OG card)");
