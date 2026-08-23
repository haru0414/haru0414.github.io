/**
 * 文章圖片最佳化。
 *
 * 用法：把原圖丟進 src/content/images/_source/，然後 `npm run images:blog`。
 *
 * 原圖刻意不放 public/——那整個資料夾會被原封不動複製進 dist，
 * 未壓縮的大檔就會跟著部署上線。
 * 每張圖會輸出 AVIF + WebP 各三種寬度到 public/blog/，
 * markdown 照常寫 ![說明](/blog/檔名.jpg)——建置期的 plugin 會偵測到
 * 這些變體並自動改用 <picture> + srcset。
 *
 * 與 surf 那支的差別：那邊是固定清單，這邊掃資料夾，
 * 因為文章圖片是隨時會增加的。
 */
import sharp from "sharp";
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, extname, basename } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src/content/images/_source");
const OUT = join(root, "public/blog");
// 160 / 400 這兩階是給列表縮圖與手機用的：縮圖只顯示 60px，
// 載 1280 寬的圖是純浪費
const WIDTHS = [160, 400, 768, 1280, 1920];
const INPUTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

if (!existsSync(SRC)) {
  mkdirSync(SRC, { recursive: true });
  console.log("已建立 src/content/images/_source/，把原圖放進去再執行一次。");
  process.exit(0);
}

const files = readdirSync(SRC).filter((f) => INPUTS.has(extname(f).toLowerCase()));
if (!files.length) {
  console.log("src/content/images/_source/ 裡沒有圖片。支援 jpg / png / webp。");
  process.exit(0);
}

const kb = (p) => statSync(p).size / 1024;
let total = 0;

/**
 * 產出清單。plugin 靠它知道每張圖有哪些寬度，不必猜檔名去試探檔案系統——
 * 原圖若比最小階還窄，輸出的寬度不會落在 WIDTHS 上，猜是猜不到的。
 * 同時記錄原圖尺寸，width/height 才是真正的長寬比。
 */
const manifest = {};

for (const file of files) {
  const name = basename(file, extname(file));
  const src = join(SRC, file);
  const meta = await sharp(src).metadata();
  const line = [];

  // 只輸出不超過原圖寬度的階；原圖比最小階還窄就照原寬輸出一張，
  // 這樣 srcset 的 w 描述值永遠等於檔案實際寬度，不會騙瀏覽器
  const targets = WIDTHS.filter((w) => !meta.width || w <= meta.width);
  if (!targets.length) targets.push(meta.width);

  for (const w of targets) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    const avif = join(OUT, `${name}-${w}.avif`);
    const webp = join(OUT, `${name}-${w}.webp`);
    // AVIF 壓得更小但編碼慢；effort 4 是品質與時間的平衡點
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(avif);
    await base.clone().webp({ quality: 74 }).toFile(webp);
    total += kb(avif);
    line.push(`${w}:${kb(avif).toFixed(0)}/${kb(webp).toFixed(0)}KB`);
  }

  manifest[`/blog/${file}`] = { width: meta.width, height: meta.height, widths: targets };
  console.log(`✓ ${name.padEnd(24)} ${meta.width}x${meta.height}  ${line.join("  ")}`);
}

// 清單放 src/ 而不是 public/：它只在建置期被讀取，沒必要跟著部署出去。
// 它會進版控，所以就算原圖不在手邊也能重現建置結果。
writeFileSync(join(SRC, "..", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`\n共 ${files.length} 張。AVIF 全尺寸合計 ${(total / 1024).toFixed(2)} MB（實際只載入 srcset 命中的那一檔）`);
