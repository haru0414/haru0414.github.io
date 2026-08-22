---
title: 一個不存在的 bug，和一個真的 bug
date: 2026-08-20
summary: GitHub Pages 對子路由會 301 加上尾斜線。這件事同時讓我漏掉一個真的 bug，又追了一個假的效能問題——兩者是同一件事的一體兩面。
tags: GitHub Pages, 除錯, 效能
cover:/blog/cat.jpg
coverAlt:貓貓封面圖
---

替作品集加了一頁 GSAP 捲動敘事之後，我量到首屏傳輸量 767 KB，其中 **424 KB 是首頁才會用到的素材**——關於頁的人像照、貓咪動畫的 sprite。那些東西在衝浪頁上根本不會顯示。

## 追一個不存在的問題

我先確認它們不在該頁的 HTML 裡：

```
grep -c "photo_1" dist/surf/index.html
0
```

沒有。也沒有 `<link rel="preload">`。那是誰去抓的？Resource Timing 的 `initiatorType` 說貓咪是 `link`、照片是 `img`——代表有 `<img>` 元素短暫存在過又被移除。

一個沒被渲染的元件，怎麼會產生 `<img>`？

答案是它真的被渲染過。`vite preview` 對 `/surf`（沒有尾斜線）回傳的是**首頁的 HTML**：

```
curl -s localhost:4173/surf  | grep -o "<title>[^<]*</title>"
<title>Haru Li｜Frontend Engineer Portfolio</title>

curl -s localhost:4173/surf/ | grep -o "<title>[^<]*</title>"
<title>SURF｜GSAP 捲動敘事實驗</title>
```

瀏覽器先拿到首頁 HTML、畫出來、載入那些圖，React hydrate 發現對不上才重新渲染成正確的頁面。那些圖就成了白費的流量。

但**正式站不會這樣**。GitHub Pages 對 `/surf` 會先 301 導向 `/surf/`，再給正確的檔案：

```
curl -sSL -w "%{url_effective} %{num_redirects}\n" https://www.haruli.com/surf
https://www.haruli.com/surf/ 1
```

所以那 424 KB 是本機預覽伺服器的行為差異，不是線上問題。真實的首屏傳輸量是 343 KB，正好落在預算內。

## 同一件事的另一面

就在我確認這件事的時候，使用者回報：線上版的吉祥物選單又跑出來了。

那個選單應該在這一頁被隱藏。程式碼是這樣寫的：

```ts
const isSurf = pathname === "/surf";
```

而線上的網址因為那個 301，`pathname` 是 `/surf/`。**完全相等的比對，尾斜線一來就不成立。**

本機開發時網址沒有尾斜線，所以我從來沒重現過。

```ts
// 必須先正規化再比對
const isSurf = pathname.replace(/\/+$/, "") === "/surf";
```

## 學到的

我花時間追一個只存在於本機的效能問題，同時放掉一個只存在於線上的顯示問題——**而它們的成因是同一個**。當初如果把「`/xxx` 和 `/xxx/` 是兩個不同的字串」納入考量，兩件事會一起浮現。

現在我的檢查清單上多了一條：**任何路由相關的驗證，兩種網址都要測**；而**量效能一定要對正式站或帶尾斜線的網址**，本機預覽伺服器的路由行為跟部署環境未必一致。
