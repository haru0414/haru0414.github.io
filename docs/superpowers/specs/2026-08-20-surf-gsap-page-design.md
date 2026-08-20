# `/surf` GSAP 捲動敘事頁 — 設計文件

> 2026-08-20。獨立於履歷主站的 GSAP 技術 demo 頁，以衝浪攝影做捲動敘事。
> 三個設計優先級由高至低：**敘事 > 流暢 > 不卡頓**，三者衝突時以「不卡頓」為否決權。

## 目標與非目標

**目標**
- 展示 GSAP ScrollTrigger 的捲動敘事能力，作為履歷站的技術佐證
- 電影感深色滿版視覺，證明不只會單一風格
- 在中低階行動裝置上仍維持順暢捲動

**非目標**
- 不是履歷內容的一部分，不參與 SEO 主動線
- 不追求 Lighthouse 高分（見〈驗收標準〉的量測說明）
- 不做可配置 / 可重用的模板抽象（YAGNI，這是單次 demo）

## 技術選型

**Lenis 平滑捲動 + GSAP ScrollTrigger，Lenis 僅在桌機啟用。**

| 方案 | 取捨 | 結論 |
| --- | --- | --- |
| Lenis + ScrollTrigger（全裝置） | 電影感最好，但 Lenis 把整頁包進被 `transform` 的容器，配滿版大圖在中低階 Android 會形成巨大 composite layer，記憶體吃緊時掉幀 | 部分採用 |
| 純原生捲動 + ScrollTrigger scrub | 最可預測、最省電，但無慣性阻尼，iOS 原生捲動慣性會讓 scrub 有滯後感 | 手機採用 |
| CSS scroll-driven animations | 跑在 compositor thread 最不卡，但 Safari 不支援，需整套 GSAP fallback＝同樣動畫做兩遍 | 不採用 |

**分流條件**：`window.matchMedia("(pointer: coarse)").matches` 為真時不初始化 Lenis，ScrollTrigger 直接綁原生捲動。此判斷與 `App.tsx:28` 的 `CustomCursor` 用同一套機制，行為一致。

**新增依賴**：`gsap`（含 ScrollTrigger，約 70KB gzip）、`lenis`（約 3KB gzip）。兩者皆走動態 `import()`，不進首頁 bundle。

## 敘事結構

衝浪的一次出海，7 幕。每幕綁一個 ScrollTrigger，動畫技法刻意不重複。

| 幕 | 內容 | GSAP 技法 | 節奏 |
| --- | --- | --- | --- |
| S0 Hero | 滿版海面，標題 `SURF` | 標題 mask reveal（以 `transform` 驅動遮罩位移，不逐幀改 `clip-path` 數值） | 靜 |
| S1 Paddle Out | 划水出海 | 縱向視差 3 層（天空／海面／人物異速 `translateY`） | 緩 |
| S2 Line-up | 海上等待 | `pin` + 極慢 scrub，文字逐句淡入 | 最靜 |
| S3 Take-off | 起乘 | 橫向捲動（`pin` + `x` 位移），3 張連拍並排 | 加速 |
| S4 Barrel | 管浪，最高潮 | 遮罩由小圓擴張至滿版，以 `scale` 驅動 | 爆點 |
| S5 Wipeout | 落水 | 快速切分鏡，`stagger` 碎片位移 | 亂 |
| S6 Sunset | 日落收尾 | 圖片淡出 + 文字上浮 + 返回連結 | 收 |

節奏設計為 靜→緩→最靜→加速→爆→亂→收。**S2 刻意做到近乎靜止**，用以拉開與 S4 爆點的對比；全程高強度等於沒有強度。

## 與現有站的隔離

深色電影感與全站漫畫風完全衝突，且現有全域樣式會直接破壞 ScrollTrigger。隔離採「進入時對 `<html>` 加 `.surf-mode` class，離開時移除」。

| 現況 | 衝突 | 處理 |
| --- | --- | --- |
| `index.css:97` `html { scroll-behavior: smooth }` | ScrollTrigger 官方不相容原生 smooth scroll，`pin` / `scrub` 會抖 | `.surf-mode` 內覆寫為 `scroll-behavior: auto` |
| `index.css:150-152` `html, body, #root { overflow-x: hidden }` | 祖先有 `overflow: hidden` 時 `pin` 定位出錯 | `.surf-mode` 內改 `overflow-x: clip`（`clip` 不建立 scroll container） |
| `App.tsx:273-274` `CustomCursor` / `FloatingCat` 掛在 `<Routes>` 外層 | 會出現在 demo 頁上 | 以 `useLocation()` 判斷 pathname 後不渲染 |
| `ScrollCat.tsx:45` 用 `scrollY / (scrollHeight - innerHeight)` 算進度 | S2 / S3 的 `pin` 動態撐高 `scrollHeight`，步幅計算失準 | 此頁不掛載 |
| 全域色票（`index.css:30-50` `@theme`） | 淺色漫畫風 | 不動全域，`SurfPage` 自帶一組 scoped CSS 變數 |

**還原驗證**：離開 `/surf` 回到 `/` 後，`scroll-behavior` 與 `overflow-x` 必須回到原值。列為驗收項目。

## 路由與 prerender

- `App.tsx` 的 `AppShell` 加 `<Route path="/surf" element={<SurfPage />} />`
- `entry-server.tsx` 的 `routes` **加入 `/surf`**，讓 `dist/surf/index.html` 存在，直連與重新整理才不會落到 404 fallback
- GSAP 與 Lenis 僅在 `useEffect` 內初始化。`renderToString` 階段不得觸碰 `window` / `document`，否則 build 直接失敗
- SSR 只輸出靜態骨架（圖片 + 文字，無動畫狀態）。此頁不追求 SEO，prerender 的目的是直連可用與首屏不白畫面
- `SurfPage` 必須**同步 import**（不可 `React.lazy`）。理由同 `App.tsx:15-17` 的註解：lazy 會讓 SSR 只渲染 Suspense fallback，造成 hydration 邊界不一致（React #419）

## 素材規格

**張數：9 張** — S0×1、S1×1、S2×1、S3×3（連拍）、S4×1、S5×1、S6×1。

| 項目 | 規格 | 理由 |
| --- | --- | --- |
| 方向 | 橫式為主；S3 三張可直可橫 | 滿版視差與橫向捲動都吃寬幅 |
| 來源 | Unsplash / Pexels（CC0 等級，免費商用免署名） | 無版權風險 |
| 原圖下載 | 最長邊 ≥ 2400px | 後續要切三檔尺寸 |
| 輸出格式 | AVIF 優先 + WebP fallback，以 `<picture>` 切換 | AVIF 約比 WebP 再小 40% |
| 輸出寬度 | 768 / 1280 / 1920 三檔，`srcset` + `sizes` | 手機不下載 1920 |
| 單張預算 | 1920 寬 AVIF ≤ 180KB | 控制總量 |
| 總傳輸預算 | **首屏 ≤ 350KB，全頁 ≤ 1.6MB** | GitHub Pages 無圖片 CDN，此為硬上限 |
| 色調 | 挑同色系（藍綠／金橘為主） | 9 張色溫不一會像貼圖牆，不像一部片 |
| 存放 | `src/assets/images/surf/` | 與現有 `onigiri/` `website/` 同層 |
| 壓製 | 擴充 `scripts/optimize-images.mjs`（已用 sharp） | 專案已有，不加新依賴 |

**字型**：沿用現有自架的 `Dela Gothic One`（`--font-heading`），不新增任何字型檔。此決定守住 `docs/lighthouse-progress.md` 記載的字型優化成果（FCP 25s → 1.7s）。

**素材取得分工**：使用者負責到 Unsplash / Pexels 挑圖並存入 `src/assets/images/surf/`；實作方提供每一幕的搜尋關鍵字與構圖建議對照表，並負責壓縮與格式轉換腳本。

## 效能守則

「不卡頓」的具體條款，實作時逐條遵守：

1. 動畫**只碰 `transform` 與 `opacity`**。禁止逐幀改 `width` / `height` / `top` / `left` / `filter` / `box-shadow`
2. `will-change` 只在 ScrollTrigger `onEnter` 加、`onLeave` 移除。常駐 `will-change` 會把每個元素釘成獨立 layer，記憶體反而爆掉
3. GSAP 與 Lenis 走動態 `import()`，只在 `/surf` 載入
4. `vite.config.ts` 的 `manualChunks` 新增 `gsap` 分組，與 `react-vendor` 同樣獨立快取
5. Lenis 僅桌機啟用，手機退回原生捲動
6. `prefers-reduced-motion: reduce` 時關閉所有 scrub，只保留淡入。`index.css:119` 已有先例
7. S0 首圖 `<link rel="preload">`；其餘 `loading="lazy"` + `decoding="async"`
8. 每張圖給明確 `width` / `height`，避免 CLS
9. 不使用 SVG 濾鏡。`docs/lighthouse-progress.md` 已記載 `feTurbulence` 是既有的 layout 成本來源

## 入口

- `PortfolioSection` 專案卡片列表尾端加一張「實驗性作品」卡，連向 `/surf`
- 右下角飼料碗選單（`PetBowl`）加一個項目

**不放主導覽列**。那是履歷主動線，塞 demo 進去會稀釋求職訴求。

## 驗收標準

1. **捲動 FPS**：桌機與手機模擬各錄一段 Chrome DevTools Performance，捲完全頁。判準為：**平均 ≥ 55 FPS，且低於 50 FPS 的幀數不超過總幀數的 5%**（避免用平均值掩蓋掉集中在某一幕的掉幀）
2. **Lighthouse**：以 **devtools 真實節流模式** 量測 `/surf`，Performance **≥ 90**
   - 不使用 Lantern（模擬節流）當標準。依 `docs/lighthouse-progress.md`，此 codebase 的 Lantern LCP 在 10~22s 間跳動且與真實體驗脫節，首頁 Lantern 僅 74 而 devtools 為 94
   - 量測方式對齊既有流程：`npm run build` 後以 `vite preview --port 4173` 對 `dist/` 量測
3. **傳輸量**：以 DevTools Network 面板實測（停用快取）。
   - 首屏 ≤ 350KB：定義為頁面載入至 S0 完成繪製為止，所有資源的傳輸量總和（含 HTML、CSS、字型、S0 首圖；不含 GSAP chunk，其為動態載入）
   - 全頁 ≤ 1.6MB：定義為捲動至 S6 結束後的累計傳輸量
4. **版面**：320 / 390 / 768 / 1440 / 1920 五個寬度截圖檢查，無橫向溢出
5. **無障礙**：開啟 `prefers-reduced-motion` 後，頁面所有文字內容仍可完整讀取
6. **隔離無洩漏**：由 `/surf` 導航回 `/` 後，`scroll-behavior` 與 `overflow-x` 回到原值，且捲動貓行為正常
7. **build 不破**：`npm run build`（含 SSR build 與 prerender）通過，`dist/surf/index.html` 產出且內容長度 > 1000（`scripts/prerender.mjs:58` 的既有檢查）

## 已知風險

- **ScrollTrigger `pin` 與 prerender 的互動未經驗證**。`pin` 會在 client 端插入 spacer 元素改變 DOM 結構；若在 hydration 前後不一致可能觸發 mismatch。緩解：所有 GSAP 初始化延後到 `useEffect`，hydration 完成後才動 DOM
- **9 張大圖的總量逼近預算上限**。若壓縮後超標，優先砍 S3 的連拍（3 張降為 2 張），敘事損失最小
- **Lenis 與 ScrollTrigger 的版本相容性**需在實作首步驗證，兩者整合方式在 Lenis v1 前後有變動
