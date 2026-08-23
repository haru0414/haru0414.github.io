---
title: 一條沒有前綴的 CSS，和只有 Safari 看得到的 bug
date: 2026-08-23
summary: 程式碼區塊的橫向捲軸在 Safari 上蓋住下一段文字，Chrome 完全正常。我第一次修錯了方向——真正的問題不是捲軸的尺寸，是它根本不該出現在那裡。
tags: CSS, Safari, 除錯
---

部落格上線後，我在 Safari 開自己的文章，發現程式碼區塊底下那條紅色捲軸**壓在下一段文字上**。同一頁在 Chrome 完全正常。

## 第一個判斷：尺寸寫錯了

站台的捲軸是自訂的，紅色滑塊配黑框，跟整體視覺一致：

```css
::-webkit-scrollbar {
  width: 12px;
  background: var(--color-paper);
  border-left: 2px solid var(--color-ink);
}
```

問題一眼可見：**`width` 只作用在直向捲軸**。橫向捲軸的粗細是 `height`，這裡沒設，所以它會落回瀏覽器預設尺寸。而 `border-left` 對一條橫躺的捲軸也沒有意義——分隔線應該畫在上緣。

於是我補上 `height`，再把分隔線按方向拆開：

```css
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar:vertical   { border-left: 2px solid var(--color-ink); }
::-webkit-scrollbar:horizontal { border-top:  2px solid var(--color-ink); }
```

在 Chrome 量，橫向捲軸剛好佔 12px、完整落在 `<pre>` 框內，跟下一段的距離是 0，沒有重疊。

推上線。Safari 上還是壞的。

## 真正的原因：作用範圍

我一直盯著捲軸「長什麼樣」，卻沒問一個更前面的問題——**它為什麼會出現在程式碼區塊上？**

那組紅色滑塊是為了**整頁的捲軸**設計的，是站台外框的裝飾。但這個選擇器前面沒有任何東西：

```css
::-webkit-scrollbar { ... }
```

沒有前綴的 pseudo-element 選擇器等同於 `*::-webkit-scrollbar`。頁面上**每一個** `overflow: auto` 的元素都會被套上——程式碼區塊、表格、任何內層捲動容器。

而一旦捲軸被自訂樣式接管，瀏覽器就不再用原生那套繪製邏輯。Chrome 和 Safari 在這件事上的算法不同，Safari 把它畫到了元素框外。

補 `height` 是必要的，但它只讓一條**不該存在的捲軸**變成正確粗細。

## 修法

把裝飾限縮回它原本的目標：

```css
html::-webkit-scrollbar {
  width: 12px;
  background: var(--color-paper);
  border-left: 2px solid var(--color-ink);
}
```

整頁捲軸維持原本的樣子，內層元素一律交還給原生捲軸——它知道自己該畫在哪。程式碼區塊的捲軸變成 Safari 那條細細半透明的，比紅色滑塊低調，反而更適合內文。

## 學到的

**一、無前綴的 pseudo-element 選擇器是全域的。** 寫 `::-webkit-scrollbar` 的當下我想的是「頁面的捲軸」，但寫出來的是「所有元素的捲軸」。裝飾性的樣式尤其危險：它不會報錯，只會在某個你沒看的角落長歪。

**二、修不好的時候，往前一步問。** 我連續兩次都在問「這條捲軸的尺寸對不對」，而該問的是「這裡為什麼有一條被自訂樣式的捲軸」。第一個問題有正確答案，但答對了也修不好。

**三、測不到的瀏覽器要當成測不到。** 這個 bug 我全程只能靠截圖判斷，Chrome 那邊怎麼量都是正常的。當手上只有一種瀏覽器時，「在 Chrome 驗過了」不能拿來當「修好了」的證據——只能證明沒改壞。
