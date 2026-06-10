請扮演一位精通日系美學與敘事設計的資深前端架構師。請基於上傳的《排球少年》復古海報風格，為一位創意工作者打造一個具有強烈「敘事感（Storytelling）」的個人作品集網站。

**1. 設計靈魂 (The Vibe):**
「熱血復古漫畫風 (Retro-Manga Pop) 遇見 懷舊質感敘事 (Nostalgic Lo-fi Storytelling)」。網站應像是一本正在翻閱的動漫設定集，充滿紙張紋理、鮮明的青春色彩與動態的分鏡感。

**2. 顏色調色板 (Tailwind Mapping):**

- **背景 (Canvas):** 使用帶有暖色調的米黃色紙張質感 `bg-[#F2EAD3]` (Warm Paper) 或 `bg-stone-100`，並必須疊加一層 CSS Noise 噪點紋理。
- **主要文字 (Ink):** 深墨藍色 `text-[#1A2332]` (Slate-900)，模仿漫畫墨水。
- **強調色 (Accent A - Nekoma Red):** 復古朱紅色 `bg-[#C83E34]` (Red-700)，用於按鈕、標籤與強調重點。
- **強調色 (Accent B - Title Yellow):** 活力黃色 `text-[#FFC845]` (Amber-400)，用於大標題或裝飾性圖形。
- **輔助色 (Deep Teal):** 復古青綠 `bg-[#2F5C68]` (Cyan-900)，用於深色區塊或 Footer。

**3. 排版系統 (Typography):**

- **標題:** 使用厚重的無襯線字體 (如 `Oswald`, `Anton` 或 `Dela Gothic One`)，字距緊湊 (tracking-tight)，模擬海報上的粗體字。
- **內文:** 易讀的日系黑體或襯線體 (如 `Noto Sans JP` 或 `Shippori Mincho`)，行高設定寬鬆 (`leading-loose`) 以增加呼吸感。

**4. UI 元素與原子設計:**

- **卡片 (Cards):** 採用「漫畫格 (Manga Panel)」設計。純色背景，2px-3px 的粗黑邊框 (`border-2 border-slate-900`)，並帶有堅硬的陰影 (`box-shadow: 6px 6px 0px #1A2332`)。Hover 時卡片輕微上浮，陰影變深。
- **按鈕 (Buttons):** 藥丸形 (`rounded-full`) 或剛硬矩形，高對比色 (紅底白字)，點擊時有明顯的「下壓」微動畫 (`active:translate-y-1`)。
- **裝飾:** 加入網點 (Halftone patterns)、對話框氣泡 (Speech bubbles) 作為 UI 提示。

**5. 佈局與架構 (Storytelling Layout):**

- **導航列 (Sticky Navbar):** 設計成類似「公車站牌」或「地鐵路線圖」的樣式，標示當前所在的「章節」。
- **Hero Section:** 分割畫面 (Split-screen)。左側為巨大的動態標題 (類似海報頂部)，右側為個人形象插畫或 3D 角色展示，背景有緩慢移動的雲朵動畫。
- **關於我 (About):** 「角色卡 (Character Sheet)」設計。包含雷達圖 (技能分析)、關鍵屬性 (Experience/Tools) 以及像漫畫介紹般的文字佈局。
- **作品集 (Projects):** 「選集 (Episode List)」佈局。使用橫向捲動 (Horizontal Scroll) 或 Bento Grid，每個專案像是一本漫畫單行本封面。
- **頁尾 (Footer):** 下集預告風格，包含大字體的「TO BE CONTINUED」與聯絡方式。

**6. 互動與動效 (Constraints):**

- **視差滾動 (Parallax):** 背景的網點、文字與前景元素必須有不同速度的滾動位移，營造 2.5D 的深度感。
- **轉場:** 頁面切換使用「翻頁」或「墨水暈染」效果。
- **敘事性:** 隨著使用者向下滾動，透過 ScrollTrigger 觸發元素依序滑入 (如漫畫分鏡一格格出現)，引導視線。
