# Lighthouse / 效能優化進度交接

> 此檔為 session 交接紀錄。下方數據與診斷以 2026-06-17 為準（已推翻先前「rAF 動畫佔住 idle」的舊診斷）。

## 量測環境

- 對 `npm run build` 後的 `dist/`，用 `vite preview --port 4173`
- Chrome for Testing（playwright 快取版）

## 分數現況（2026-06-17）

| 量測方式                           | Performance | 備註                                                         |
| ---------------------------------- | ----------- | ------------------------------------------------------------ |
| **Lantern（PSI 預設 / 模擬節流）** | **74**      | FCP 1.7s、LCP 模擬值 10~22s 跳動                             |
| **devtools（真實節流）**           | **94**      | FCP 1.7s、LCP 3.0s、observed ~1s                             |
| Accessibility                      | 100 ✅      | color-contrast / heading-order / aria-required-children 全修 |
| Best Practices                     | 100 ✅      | hydration 乾淨、無 console error                             |
| SEO                                | 92          |                                                              |

## 已完成（真實有效，全部對使用者受益）

1. **字型 render-blocking 消除（最大一筆，FCP 25s→1.7s）**
   - 字型 CSS 改非阻塞（`media="print" onload`）。
   - 標題字 Dela Gothic One 自架 Latin 子集（`public/fonts/`），同源 + `<link rel=preload>`。
   - `font-display: swap`（曾試 optional，但慢速首載會永久用細 fallback、失去粗體感，已改回）。
2. **SVG 濾鏡收斂**：`crayon-boil` 的 `feTurbulence` octaves 3→1，並移除每 0.5s 重算的無限動畫，改靜態濾鏡（Style&Layout 2005ms→~1300ms）。
3. **prerender（SSR snapshot）**
   - `src/entry-server.tsx` 用 `renderToString`（MemoryRouter）產生首頁 HTML。
   - build：`vite build` → `vite build --ssr` → `node scripts/prerender.mjs` 把 #root 內容塞回 `dist/index.html`。
   - `src/main.tsx`：`#root` 有內容時 `hydrateRoot`，dev 空殼時 `createRoot`。
   - 為了 hydration 一致，把進場動畫從 JS state 改純 CSS（`rise-in`/`pop-in`/`draw-stroke`，見 index.css），`Math.random` 改決定性 `rand(i)`，FloatingCat 主題初次一律 light 再用 effect 校正，i18n SSR-safe。
   - **效果**：真實體驗大幅變好（devtools 87→94），但 **Lantern 分數沒變（仍 74）**——整頁進靜態 HTML，Lantern 4x CPU 模型把「首次繪製前 layout 整頁」估得很重。

## 真正的瓶頸（給想再優化的人）

- Lantern LCP 高且不穩（10~22s）是 **CSR/全頁 layout 在模擬 CPU 下的成本**，不是資源阻塞（render-blocking 已 0、observed LCP ~1s）。
- 要 Lantern 破 90：**減少裝飾 DOM 與 SVG 濾鏡的 layout 成本**（parallax 圓點、speed lines、多個 crayon-boil 濾鏡實例）。對 Lantern 與真實都有效，但會動到視覺裝飾。

## Accessibility 100（2026-06-17 修法）

- **color-contrast**：深色模式品牌色被調亮，當「色塊底＋白/淺字」時對比不足。新增**不隨主題切換**的 badge token（index.css `:root`）：`--color-badge-red #c0362c`、`--color-badge-teal #2f5c68`、`--color-on-poster #1a2332`，套到 Hero/About/ProjectDetail/Nav 的文字徽章。大字（如 Contact mailto 24px）門檻只 3:1 已通過，poster 徽章原本用 `--color-panel` 深字也 OK。
- **heading-order**：根因是 AboutSection 的 `<h2>CHARACTER` 包在 `hidden md:flex`，手機版（Lighthouse 預設視窗）`display:none` → 該 h2 消失 → h1 直接跳 h3。改用 `sr-only md:not-sr-only`（手機保留給 a11y、桌機顯示垂直裝飾標題）。另把 Hero 裝飾「卷號」由 `<h2>` 改 `<p>`（非章節標題）。
- **aria-required-children**：FloatingCat 的 `role="menu"` 內含 `<img>`（不允許）且未實作方向鍵導覽。移除 `role="menu"`/`menuitem`，改為一般 disclosure 按鈕群（原生 `<button>` 已無障礙，觸發鈕保留 `aria-expanded`）。

## 本 session 另修的互動 bug

- **Portfolio READ 按鈕點不到**：卡片 hover 的 3D `rotateY` 破壞小目標的 compositor hit-test。改成只用 2D `translateY` 抬升。
- **系統游標一直冒出來**：`cursor:none` 原只在 body，被按鈕/卡片各自游標蓋過。改桌機全域 `* { cursor: none !important }`（`@media (hover:hover) and (pointer:fine)`），Hero 蠟筆畫布以 `setProperty(..., "important")` 保留蠟筆游標。

## 重跑指令

```bash
npm run build          # tsc + client build + ssr build + prerender
npx vite preview --port 4173 --host 127.0.0.1   # 背景跑

CHROME_PATH="$HOME/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
  npx lighthouse@12 http://127.0.0.1:4173/ --output=json --output-path=/tmp/lh.json \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo --quiet
# 真實節流改加：--throttling-method=devtools

node -e 'const r=require("/tmp/lh.json");for(const k in r.categories){const c=r.categories[k];console.log(c.title,Math.round((c.score??0)*100))}'
```

## 待辦清單脈絡

① Lighthouse/axe ✅（效能真實 94／Lantern 74；a11y 100）→ ② BrowserRouter 遷移 ✅（已改 BrowserRouter + 各路由 prerender + 404 fallback）→ ✅③ PDF 履歷 → ④ mini demo / GitHub 儀表板。
