---
title: 做十個效能 demo，發現量測本身也會騙人
date: 2026-08-22
summary: 為作品集做了十個可以自己操作的前端效能展示。過程中換了三種量測方式才拿到能用的數字，也砍掉兩個做出來但差距不夠說服人的題目。
tags: 效能, React, 量測
cover:/blog/cat.jpg
coverAlt:貓貓封面圖
---

我想在作品集裡放一區「可以自己點的效能展示」——數字當場跑出來，不是截圖。做完十個之後，最大的收穫不是那些技法，而是**量測本身有多容易出錯**。

## 第一次：在 render 期間計時

想量 `useMemo` 有沒有省下重算，最直覺的寫法是包住渲染過程：

```tsx
const t0 = performance.now();
const result = useMemo(() => heavyWork(n), [n]);
const ms = performance.now() - t0;
```

lint 直接擋下來：`performance.now()` 是不純的呼叫，不該出現在 render 期間。用 `useRef` 記錄也一樣被擋——render 期間讀寫 ref 違反 React 的規則。

規則是對的。React 可能重複呼叫元件函式，這種寫法拿到的數字本來就不可信。

## 第二次：官方的 Profiler

React 有專門做這件事的 API：

```tsx
<Profiler id="memo" onRender={(id, phase, actualDuration, baseDuration) => ...}>
```

`actualDuration` 是本次實際渲染耗時，`baseDuration` 是假設完全沒有 memo 化的估計值。看起來完美。

實測結果：**production build 量到的永遠是 0.0 ms**。

React 在正式建置會把 profiling 相關的程式碼移除。對一個要部署出去給人看的作品來說，這條路走不通。

（另外還踩到一個：我一開始把 `<Profiler>` 包在元件的**回傳值**裡，那只量得到子樹的渲染，量不到元件本體的運算。）

## 第三次：flushSync

最後可行的做法是逼 React 同步跑完，然後在**事件處理函式裡**計時：

```tsx
const measure = () => {
  const t0 = performance.now();
  flushSync(() => setTick((v) => v + 1));
  const ms = performance.now() - t0;
  setLast(ms);
};
```

沒有 render 期間的不純呼叫，production 也有效。實測 `useMemo` 開啟 0.3 ms、關閉 3.0 ms。

需要「實際渲染次數」時則用另一招：在 `useEffect` 裡把數字直接寫進 DOM。effect 在 commit 之後執行，操作 DOM 合法；寫進 DOM 而非 state 則避免它自己觸發下一次渲染。

## 砍掉的兩個題目

**`transform` vs `margin`**：教科書級的對比，實測只差 10%（3.9 vs 4.3 ms）。追下去發現那 3.9 ms 裡絕大部分是 JS 逐一寫入 1400 個元素樣式的成本，兩邊都要付；真正的版面差異只有 0.4 ms，被淹沒了。現代瀏覽器對這件事的最佳化比十年前好太多。

換成「讀寫交錯 vs 批次寫入」後，差距是 **142 倍**：

```js
// 慢：每寫一次就讀一次，逼瀏覽器當場算完版面
els.forEach((el) => {
  el.style.marginLeft = x + "px";
  void el.offsetHeight;
});

// 快：全部寫完才讀一次
els.forEach((el) => {
  el.style.marginLeft = x + "px";
});
void root.offsetHeight;
```

而且這才是實務上真的會踩的坑——`transform` 大家都知道，「不要在迴圈裡邊量邊改」才是會出現在 code review 裡的問題。

**`useTransition`**：開與關量起來都是 1–8 ms，完全沒差。它真正的價值是「輸入框不會頓」的體感，而那在自動化量測裡抓不到，在桌機上也感覺不出來。換成 `Map` 查表對上陣列 `find`——2,000 筆差 38 倍、5,000 筆差 168 倍，而且比對次數 2,001,000 對 4,000，數字本身就解釋了原因。

## 一個判準

做完之後，我對「什麼是好的效能展示」有了比較明確的標準：

**差異必須在正式建置、真實機器上量得出來，而且大到不需要辯解。**

達不到這條的題目，不管它在教科書上多經典，都不該放進去——寫一個 10% 的差距然後配上「這很重要」的說明，說服力是負的。
