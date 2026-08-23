---
title: useMemo 到底省下多少？我量了三次才拿到能信的數字
date: 2026-08-19
summary: 想證明 useMemo 有用，卻發現最直覺的量法會被 lint 擋、官方的 Profiler 在正式建置回傳 0。第三種寫法才拿到 0.3 ms 對 3.0 ms。
tags: 效能, React, 量測
---

「`useMemo` 可以避免重複運算」這句話大家都會講，但我想在作品集裡放一個**當場跑給你看**的版本——按下按鈕，數字自己出來。

做這個 demo 花掉的時間，八成不在 `useMemo`，在**怎麼量**。

## 發想：要量的到底是什麼

`useMemo` 的作用是：依賴沒變時，跳過那段運算，直接回傳上次的結果。

所以要量的不是「函式跑多久」，而是**同一次重新渲染，走快取和不走快取差多少**。運算本身必須夠重才看得出來——我用「計算某個範圍內有幾個質數」，範圍可以調，重到足以蓋過渲染本身的雜訊。

## 測試：三次才對

**第一次，在 render 期間計時。** 最直覺的寫法：

```tsx
const t0 = performance.now();
const result = useMemo(() => heavyWork(n), [n]);
const ms = performance.now() - t0;
```

lint 直接擋下來。`performance.now()` 是不純的呼叫，不該出現在 render 期間；改用 `useRef` 記錄也一樣被擋，render 期間讀寫 ref 同樣違反規則。

規則是對的。React 可能重複呼叫元件函式（Strict Mode 下就會），這種寫法拿到的數字本來就不可信。

**第二次，官方的 Profiler。** React 有專門做這件事的 API：

```tsx
<Profiler id="memo" onRender={(id, phase, actualDuration, baseDuration) => ...}>
```

`actualDuration` 是本次實際渲染耗時。看起來完美——實測 production build 量到的永遠是 **0.0 ms**。React 在正式建置會把 profiling 相關的程式碼移除。對一個要部署出去給人看的東西，這條路走不通。

（順帶踩到另一個：我一開始把 `<Profiler>` 包在元件的**回傳值**裡，那只量得到子樹，量不到元件本體的運算。）

**第三次，flushSync。** 逼 React 同步跑完，然後在**事件處理函式裡**計時：

```tsx
const measure = () => {
  const t0 = performance.now();
  flushSync(() => setTick((v) => v + 1));
  const ms = performance.now() - t0;
  setLast(ms);
};
```

沒有 render 期間的不純呼叫，production 也有效。

## 理解：0.3 對 3.0

開啟快取 0.3 ms、關閉 3.0 ms，差一個數量級。

關鍵在於這 0.3 ms 不是「運算變快了」——**是那段運算根本沒跑**。`useMemo` 做的只是比對依賴陣列，然後把上次的結果原封不動交出來。它不會讓任何東西變快，只會讓東西**不發生**。

這也是為什麼依賴陣列寫錯的代價那麼大：多寫一個每次都變的值進去，快取每次都失效，你付了比對的成本卻什麼都沒省到。

## 講解：什麼時候該用

`useMemo` 不是免費的。它要記住上次的依賴與結果，還要每次比對。運算便宜的時候，這些成本可能比運算本身還貴。

判準很簡單：**那段運算重到你量得出來嗎？** 量不出來就別包。

真正值得包的通常是：迴圈跑過大量資料、產生新陣列或新物件（尤其是要當成 props 傳下去的）、以及任何你會下意識覺得「這個好像有點重」的東西。剩下的，讓它每次重算，程式反而好讀。

---

這個 demo 可以在 [效能實驗室](/lab#use-memo) 自己操作。量測方式的完整比較寫在[做十個效能 demo 的心得](/blog/measuring-performance-honestly)。
