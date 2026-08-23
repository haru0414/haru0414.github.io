# 部落格寫作指南

`/blog` 的文章來源是 `src/content/posts/*.md`。**新增一篇文章 = 新增一個 `.md` 檔**，
不用改任何程式碼——路由、列表、目錄、sitemap、社群分享卡都會自動生出來。

---

## 快速開始

```bash
# 1. 建檔。檔名就是網址，用英文小寫加連字號
vim src/content/posts/why-safari-hates-me.md

# 2. 寫 frontmatter + 內文（格式見下一節）

# 3. 看效果
npx vite --port 5173
```

網址會是 `https://www.haruli.com/blog/why-safari-hates-me/`。

> **檔名請用英文。** 中文檔名會被編碼成 `%E4%B8%AD%E6%96%87`，難讀也難分享。
> 真的想另外指定，可在 frontmatter 加 `slug:`。

---

## Frontmatter

寫在檔案最上方，用 `---` 包起來：

```markdown
---
title: 一個不存在的 bug，和一個真的 bug
date: 2026-08-20
summary: GitHub Pages 對子路由會 301 加上尾斜線。這件事同時讓我漏掉一個真的 bug，又追了一個假的效能問題。
tags: GitHub Pages, 除錯, 效能
---

正文從這裡開始。
```

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `title` | ✅ | 文章標題。也會用在 `<title>`、og:title |
| `date` | ✅ | `YYYY-MM-DD`。列表依此排序，新的在前 |
| `summary` | ✅ | 列表摘要 + meta description + og:description。一到兩句 |
| `tags` | ✅ | 逗號分隔。每個標籤就是一個看板，見下節 |
| `slug` | | 覆寫網址。不填就用檔名 |
| `cover` | | 封面圖路徑，例如 `/blog/why-safari.jpg`。同時當列表縮圖與社群分享圖 |
| `coverAlt` | | 封面的替代文字。不填會退回 `title` |

**格式限制：** 解析器只吃 `英文欄位名: 值` 的單行寫法，不支援 YAML 的巢狀結構、
陣列語法或跨行字串。`tags` 就寫成 `效能, React`，不要寫 `[效能, React]`。

---

## 標籤就是看板

每個標籤會自動變成一個看板頁 `/blog/board/{slug}`。中文標籤直接放進網址會變成
一串 `%E6%95%88%E8%83%BD`，所以**每個標籤都要在 `src/data/posts.ts` 的
`BOARD_SLUGS` 登記一個英文 slug**：

```ts
const BOARD_SLUGS: Record<string, string> = {
  效能: "performance",
  React: "react",
  量測: "measurement",
  "GitHub Pages": "github-pages",
  除錯: "debugging",
};
```

沿用既有標籤就不用動它。用了沒登記的中文標籤時，dev 模式的 console 會出現
`[posts] 標籤「X」缺少 slug，請在 BOARD_SLUGS 登記`。

---

## 圖片

### 流程

原圖丟進 `src/content/images/_source/`，跑一次產圖，markdown 引用**原始檔名**：

```bash
cp ~/Desktop/safari-devtools.png src/content/images/_source/
npm run images:blog
```

```markdown
![Safari 開發者工具的 network 面板](/blog/safari-devtools.png)
```

產圖腳本會輸出 AVIF + WebP 各五種寬度（160 / 400 / 768 / 1280 / 1920，超過原圖
寬度的階會跳過），建置時自動組成 `<picture>` + `srcset`，瀏覽器只會下載它需要的
那一張。

**沒跑產圖也不會壞**——只是退回普通 `<img>`，之後補跑就會自動升級。

### 兩種圖的行為不一樣

```markdown
自成一段的圖 → 插圖，撐滿欄寬並加外框

![這是插圖](/blog/screenshot.png)

夾在文字裡的圖 → 圖示，維持原始尺寸

點右上角的 ![設定圖示](/blog/gear.png) 就會展開。
```

差別由建置期判斷後標上 `prose-figure`，不用手動處理。

### 封面與縮圖

`cover` 指定後，同一張圖會用在三個地方，各自載入合適的尺寸：

- 文章頁頂端封面（欄寬約 520px）
- 列表縮圖（1:1 裁切，只有 52–60px，會載 160w 那階）
- 社群分享卡的 og:image（指向最大張的 WebP，因為爬蟲對 AVIF 支援參差）

沒設 `cover` 的文章，列表縮圖用飯糰預設圖 `/blog/default-cover.webp`。

---

## 這些不用你管

| 項目 | 怎麼來的 |
| --- | --- |
| 路由與 prerender | 掃 `src/content/posts/*.md` 自動產生 |
| 目錄（TOC） | 從 `##` 標題抓，自動編號、捲動時自動高亮。`###` 以下不進目錄 |
| 閱讀時間 | 字數 ÷ 450。程式碼區塊不計入 |
| `<img>` 的 width / height | 建置期量出來寫進標籤，避免圖片載入時把版面往下推 |
| sitemap.xml | 建置時重新產生 |
| SEO meta / JSON-LD | 全部從 frontmatter 推導，新文章不必另外登記 |

---

## 容易踩到的坑

**產圖後要重啟 dev server。** plugin 在每次轉換 `.md` 時重讀圖片清單，但 Vite 不會
因為清單變動就重跑轉換。`npm run images:blog` 之後看不到新圖，重啟就好。

**原圖進版控，但不會被部署。** `src/content/images/_source/` 在 `src/` 底下，
沒有被任何程式 `import` 的檔案不會進 bundle，`public/` 那種整包複製也碰不到它——
所以換機器 clone 下來還原得出全部素材，訪客卻不會下載到任何一張原圖。
`src/content/images/manifest.json` 同樣要 commit，否則別台機器建置時圖片會退回
沒有 srcset 的版本。

**原圖不要直接放 `public/blog/`。** 那個資料夾會被整包複製進 `dist` 部署出去，
未壓縮的大檔會跟著上線。放 `_source/` 就不會。

**沒有草稿機制。** 只要 `.md` 檔在 `src/content/posts/` 裡就會被發佈。還沒寫完的
先放在資料夾外面。

---

## 指令速查

```bash
npm run images:blog   # 產圖（讀 _source/，輸出到 public/blog/ 並更新 manifest）
npx vite              # dev server
npm run build         # 正式建置 + prerender + sitemap
npx eslint .          # 檢查
```
