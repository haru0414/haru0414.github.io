---
title: 同樣的事，換個順序就慢 142 倍
date: 2026-08-11
summary: 兩段程式碼做的事完全一樣，都改了 margin、也都讀了版面。差別只在讀跟寫的順序。這是我做的十個 demo 裡差距最大的一個。
tags: 效能, 瀏覽器, 量測
---

這一題是換來的。原本我要做「`transform` vs `margin`」——教科書級的對比，結果實測只差 10%（3.9 對 4.3 ms）。

追下去發現：那 3.9 ms 裡絕大部分是 JS 逐一寫入 1400 個元素樣式的成本，兩邊都要付。真正的版面差異只有 0.4 ms，被淹沒了。現代瀏覽器對這件事的最佳化比十年前好太多。

換成「讀寫交錯 vs 批次寫入」之後，差距是 **142 倍**。

## 發想：這才是會出現在 code review 裡的問題

`transform` 比 `margin` 好，大家都知道。但「不要在迴圈裡邊量邊改」——這個知道的人少很多，而且踩到的機會高很多。

它藏在那種「遍歷元素、量一下再調整」的程式碼裡，讀起來完全合理。

## 測試：兩種模式，做同一件事

demo 裡有一批方塊，兩種模式都會改每個方塊的 `marginLeft`，也都讀了版面。差別只在順序：

```js
// 讀寫交錯：每寫一次就讀一次
els.forEach((el) => {
  el.style.marginLeft = x + "px";
  void el.offsetHeight;          // ← 讀
});

// 批次寫入：全部寫完才讀一次
els.forEach((el) => {
  el.style.marginLeft = x + "px";
});
void root.offsetHeight;           // ← 只讀一次
```

切到「讀寫交錯」之後**整頁會明顯卡頓**，那是這個 demo 要讓你感受的東西，不是頁面壞了。停止鍵仍然有效，只是回應會慢半拍，多按一下就會停。

（想少卡一點可以先按停止再切換模式。）

## 理解：強制同步版面計算

瀏覽器很聰明：你連續改十次樣式，它不會算十次版面，會把這些變更累積起來，等到真的需要時才一次算完。

問題出在「真的需要」的時機。當你讀取這些屬性時：

- `offsetTop` / `offsetLeft` / `offsetWidth` / `offsetHeight`
- `getBoundingClientRect()`
- `scrollTop` / `scrollHeight`
- `getComputedStyle()` 的部分屬性

瀏覽器必須給你**正確的當下數值**，所以它得把累積的變更全部套用、把版面重算一遍才能回答。這叫**強制同步版面計算**（forced synchronous layout），也常被稱作 layout thrashing。

在迴圈裡做，就是每一輪都逼它重算一次整頁版面。

一幀的預算約 **16 ms**（60 fps），超過就撐不住流暢。demo 上顯示的「ms／幀」就是在量這個。

## 講解：改法只有一句話

**把讀和寫分成兩批。**

先把所有需要的量測值讀出來存成陣列，再統一寫入：

```js
// 先全部讀
const tops = els.map((el) => el.offsetTop);
// 再全部寫
els.forEach((el, i) => { el.style.transform = `translateY(${tops[i]}px)`; });
```

需要在動畫迴圈裡做的話，`requestAnimationFrame` 裡也維持同樣的原則：讀完再寫。

至於怎麼發現——Chrome DevTools 的 Performance 面板會把強制同步版面標成紫色的 `Layout` 區塊，並在旁邊出現警告三角形，滑上去會直接告訴你是哪一行程式碼觸發的。

---

這個 demo 可以在 [效能實驗室](/lab#layout-cost) 自己操作。
