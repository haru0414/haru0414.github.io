---
title: Suspense 的底層契約：元件真的會 throw 一個 promise
date: 2026-08-17
summary: 「資料還沒好就顯示骨架畫面」聽起來像框架的貼心設計。實際的機制比想像中原始——元件丟出一個 promise，React 接住它。
tags: 效能, React
---

`<Suspense fallback={...}>` 用起來很順：資料沒好顯示骨架，好了換成內容。順到讓人不會去想它**憑什麼知道**資料還沒好。

## 發想：想看見那個機制

我做這個 demo 不是為了展示「載入中的動畫很漂亮」，而是想讓那個契約現形——資料未就緒時，元件到底做了什麼。

答案有點反直覺：**它 throw 一個 promise。**

## 測試：可以調的延遲

demo 裡有一根延遲滑桿。拉大再按重播，骨架畫面停留的時間就跟著變長；拉到最小，幾乎一閃而過。

這不是動畫的時長設定，是模擬的網路延遲——骨架顯示多久，完全由那個 promise 什麼時候 resolve 決定。

## 理解：throw、接住、重試

流程是這樣的：

1. 元件渲染時去讀資料，發現還沒好
2. 它 `throw` 那個還在進行中的 promise（不是 Error，是 promise）
3. React 往上找最近的 `<Suspense>` 邊界，改成渲染 `fallback`
4. React 同時對那個 promise 掛上 `.then`
5. promise 完成後，React **重新渲染**那個元件——這次資料在了，正常回傳

```tsx
function read() {
  if (status === "pending") throw promise;  // ← 就是這一行
  if (status === "error") throw error;
  return result;
}
```

`throw` 在這裡不是「出錯了」，是「我還不能給你答案，等這個東西好了再叫我」。用同一個機制傳遞兩種狀態（錯誤往 ErrorBoundary、promise 往 Suspense），是這套設計最巧的地方。

也因為是「重新渲染」而不是「繼續執行」，元件必須能被重複呼叫而結果一致——這就是為什麼 React 一直強調元件要是純函式。

## 講解：實務上你不會自己寫

上面那段 `read()` 是為了 demo 才手寫的。實際專案裡幾乎不會這樣寫——TanStack Query、Relay、或框架的資料層都已經幫你實作好這個契約了。

知道機制的價值在於**看懂錯誤訊息**。當你遇到「元件無限重新渲染」或「fallback 一直不消失」，理解「promise 完成 → 重新渲染 → 再讀一次」這個循環，就知道要去檢查什麼：那個 promise 是不是每次渲染都建立一個新的？狀態有沒有真的被寫回去？

順帶一提，這一頁本身也用了預先渲染，首屏 HTML 在建置時就產生好了——所以你看到的骨架畫面，是 hydrate 之後才開始跑的。

---

這個 demo 可以在 [效能實驗室](/lab#suspense) 自己操作。
