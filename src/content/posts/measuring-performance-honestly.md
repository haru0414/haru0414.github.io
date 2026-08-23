---
title: 做十個效能 demo 之後，我對「值得展示」的標準變嚴格了
date: 2026-08-23
summary: 十個可以自己操作的前端效能實作做完之後的統整。量測方式換了三種、砍掉兩個教科書級的題目，最後歸納出一條判準與十篇各自的紀錄。
tags: 效能, React, 量測
cover:/blog/cat.jpg
coverAlt:貓貓封面圖
---

我想在作品集裡放一區「可以自己點的效能展示」——數字當場跑出來，不是截圖。做完十個之後，最大的收穫不是那些技法本身，而是**要讓一個效能差距誠實地被看見，比想像中難很多**。

這篇是統整。十個 demo 各自的來由、量測與原理寫在各自的文章裡，文末有完整清單。

## 量測本身最會騙人

想量 `useMemo` 有沒有省下重算，我換了三種寫法才拿到能信的數字。

**在 render 期間計時**——lint 直接擋下來。`performance.now()` 是不純的呼叫，用 `useRef` 記錄也一樣被擋。規則是對的：React 可能重複呼叫元件函式，這種寫法拿到的數字本來就不可信。

**用官方的 `<Profiler>`**——正式建置量到的永遠是 `0.0 ms`。React 在 production 會把 profiling 相關的程式碼移除。對一個要部署出去給人看的作品，這條路走不通。（另外還踩到一個：把 `<Profiler>` 包在元件的**回傳值**裡，只量得到子樹，量不到元件本體的運算。）

**用 `flushSync` 在事件處理函式裡計時**——這個可行。沒有 render 期間的不純呼叫，production 也有效。

需要「實際渲染次數」時則用另一招：在 `useEffect` 裡把數字直接寫進 DOM。effect 在 commit 之後執行，操作 DOM 合法；寫進 DOM 而非 state 則避免它自己觸發下一次渲染。

這件事後來反覆出現：**每次量到「沒有差別」，我都得先懷疑量測方式，而不是先下結論。**

## 砍掉的兩個題目

**`transform` vs `margin`。** 教科書級的對比，實測只差 10%（3.9 對 4.3 ms）。追下去發現那 3.9 ms 裡絕大部分是 JS 逐一寫入 1400 個元素樣式的成本，兩邊都要付；真正的版面差異只有 0.4 ms，被淹沒了。現代瀏覽器對這件事的最佳化比十年前好太多。

換成「[讀寫交錯 vs 批次寫入](/blog/layout-thrashing-read-write-order)」後，差距是 **142 倍**。而且這才是實務上真的會踩的坑——`transform` 大家都知道，「不要在迴圈裡邊量邊改」才是會出現在 code review 裡的問題。

**`useTransition`。** 開與關量起來都是 1–8 ms，完全沒差。它真正的價值是「輸入框不會頓」的體感，而那在自動化量測裡抓不到，在桌機上也感覺不出來。換成「[Map 查表對上陣列 find](/blog/map-vs-find-in-loops)」——5,000 筆差 168 倍，而且比對次數 2,001,000 對 4,000，數字本身就解釋了原因。

兩個都是同一種失敗：**題目本身是對的，但在可展示的規模下差距不夠大。**

## 一條判準

**差異必須在正式建置、真實機器上量得出來，而且大到不需要辯解。**

達不到這條的題目，不管它在教科書上多經典，都不該放進去——寫一個 10% 的差距然後配上「這很重要」的說明，說服力是負的。

還有一個推論：有些效能問題**不該用數字展示**。像 Web Worker 那題，我最後沒有主打耗時，而是放一個[會停住的轉圈](/blog/web-worker-off-main-thread)——因為「頁面凍住」這件事本來就不是用毫秒感受的。

## 十篇紀錄

| # | 題目 | 重點 |
|---|---|---|
| 01 | [useMemo 到底省下多少](/blog/usememo-caching-expensive-work) | 0.3 對 3.0 ms；以及量測換了三次 |
| 02 | [捲到才載入](/blog/lazy-loading-on-scroll) | 省的不只是資料，還有那個 JS 檔 |
| 03 | [Suspense 的底層契約](/blog/suspense-waiting-for-data) | 元件真的會 throw 一個 promise |
| 04 | [一萬筆只畫二十個節點](/blog/virtual-scrolling-ten-thousand-rows) | 少載資料與少畫 DOM 是兩件事 |
| 05 | [那個轉圈停住的瞬間](/blog/web-worker-off-main-thread) | 主執行緒被佔住＝使用者眼中的當機 |
| 06 | [在 map 裡呼叫 find](/blog/map-vs-find-in-loops) | 一行程式碼的四倍成長 |
| 07 | [React.memo 為什麼失效](/blog/react-memo-and-usecallback) | 因為你傳了一個函式下去 |
| 08 | [防抖與節流](/blog/debounce-vs-throttle) | 判準是「過程中需不需要反應」 |
| 09 | [換個順序慢 142 倍](/blog/layout-thrashing-read-write-order) | 強制同步版面計算 |
| 10 | [手機不該拿到 1920 那一檔](/blog/avif-webp-and-srcset) | 尺寸選錯比格式選錯更貴 |

全部可以在 [效能實驗室](/lab)自己操作，數字是當場跑出來的。
