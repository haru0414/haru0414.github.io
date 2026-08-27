---
title: 把 GitHub Pages 換成 Cloudflare 買的自訂網域
date: 2026-08-27
summary: 從 Cloudflare DNS、GitHub Pages 到專案裡的 CNAME 與 SEO 網址，完整記錄我把 haru0414.github.io 換成 www.haruli.com 的設定流程。
tags: GitHub Pages, Cloudflare, DNS
---

我的作品集原本放在 `haru0414.github.io`，後來在 Cloudflare Registrar 買了 `haruli.com`，想把正式網址換成：

```
https://www.haruli.com
```

最後採用的規則是：

- `www.haruli.com` 是正式網址
- `haruli.com` 自動轉去 `www.haruli.com`
- `haru0414.github.io` 也自動轉去 `www.haruli.com`

買下網域不代表它會自動連到網站。這件事其實有三層：Cloudflare 負責 DNS、GitHub Pages 負責託管網站，專案本身則要停止輸出舊網址。只設其中一層，網站可能打得開，搜尋引擎和分享預覽卻還是舊的。

這篇以目前這個 Vite + React 專案為例，但 DNS 的部分也適用於一般 GitHub Pages 網站。

## 開始前先決定正式網址

先在裸網域和 `www` 之間選一個當唯一的正式網址：

```
haruli.com
www.haruli.com
```

我選 `www.haruli.com`。只要裸網域和 `www` 的 DNS 都設好，GitHub Pages 會依照 Pages 裡填的 Custom domain，自動把另一個版本重新導向正式網址。

以下範例中的值可以這樣替換：

| 這個專案 | 你的值 |
| --- | --- |
| `haru0414` | GitHub 使用者名稱或組織名稱 |
| `haruli.com` | 在 Cloudflare 購買的網域 |
| `www.haruli.com` | 想公開使用的正式網址 |
| `haru0414.github.io` | GitHub Pages 原本的預設網域 |

這個專案的 repository 剛好叫 `haru0414.github.io`，屬於使用者網站，所以 CNAME 的目標就是 `haru0414.github.io`，**不用加 repository 名稱，也不要加 `https://` 或路徑**。

## 先在 GitHub 驗證網域

這一步不是讓網站上線，而是證明這個網域屬於我，避免日後 repository 被刪除、Pages 暫時停用時，別人接管仍指向 GitHub Pages 的網域。

1. 點 GitHub 右上角頭像，進入 **Settings**。
2. 左側選 **Pages**，在 Verified domains 按 **Add a domain**。
3. 輸入裸網域 `haruli.com`。
4. GitHub 會提供一筆 TXT record 的名稱和值。
5. 先不要關閉 GitHub 頁面，另開 Cloudflare Dashboard。
6. 選擇 `haruli.com`，進入 **DNS → Records → Add record**。
7. Type 選 `TXT`，Name 和 Content 貼上 GitHub 提供的內容，儲存後回 GitHub 按 **Verify**。

驗證 `haruli.com` 也會保護它的第一層子網域，例如 `www.haruli.com`。TXT record 驗證成功後不要刪掉，GitHub 才能持續確認網域所有權。

GitHub 也提供指令檢查 TXT 是否已經傳播；把使用者名稱和網域換成自己的：

```bash
dig _github-pages-challenge-haru0414.haruli.com TXT +short
```

## 在 GitHub Pages 填入自訂網域

接著到網站 repository 的 **Settings → Pages**，在 Custom domain 輸入：

```
www.haruli.com
```

按下 **Save**。GitHub 官方建議先在 Pages 加入自訂網域，再設定指向 GitHub 的 DNS，避免留下可被接管的空窗。

這裡只填一個正式網域，不要同時塞入裸網域，也不要填 `https://www.haruli.com`。

## 在 Cloudflare 建立 DNS records

回到 Cloudflare Dashboard 的 **DNS → Records**。如果剛買完網域時已經有停放頁用的 `A`、`AAAA` 或 `CNAME` record，先確認同名 record 不會衝突。

我的設定如下：

| Type | Name | Content | Proxy status | TTL |
| --- | --- | --- | --- | --- |
| `A` | `@` | `185.199.108.153` | DNS only | Auto |
| `A` | `@` | `185.199.109.153` | DNS only | Auto |
| `A` | `@` | `185.199.110.153` | DNS only | Auto |
| `A` | `@` | `185.199.111.153` | DNS only | Auto |
| `CNAME` | `www` | `haru0414.github.io` | DNS only | Auto |

`@` 代表裸網域 `haruli.com`；`www` 代表 `www.haruli.com`。四個 IP 都是 GitHub Pages 官方提供的 IPv4 位址，不是任選一個填上去。

Cloudflare 新增可代理的 record 時可能預設開啟橘色雲朵。第一次設定我先全部切成灰色的 **DNS only**，讓 GitHub 可以直接檢查 DNS 並簽發憑證。這樣 HTTPS、快取和重新導向的責任也比較單純，都由 GitHub Pages 處理。

Cloudflare Proxy 不是自訂網域上線的必要條件。若網站正常後真的要開橘色雲朵，等於在訪客和 GitHub 之間再加入一層反向代理，還要另外確認 Cloudflare 的 SSL/TLS mode、快取與 Redirect Rules；設定互相衝突時可能造成重新導向迴圈。這篇先維持 DNS only。

## 讓部署保留 CNAME

這個專案用 `peaceiris/actions-gh-pages` 把 `dist` 發佈到 `gh-pages` branch：

```yaml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

因此我在 `public/CNAME` 放入正式網域：

```
www.haruli.com
```

Vite build 時會把 `public` 裡的檔案原樣複製到 `dist`，部署後 `gh-pages` branch 根目錄就會保留 `CNAME`。如果只在 GitHub 網頁介面產生檔案，下次部署剛好覆寫整個 branch，自訂網域設定可能跟著消失。

`CNAME` 有三個限制：

- 檔名必須是大寫的 `CNAME`
- 只能有一行、一個網域
- 只寫 hostname，不加 `https://`、結尾斜線或其他路徑

如果專案採用 GitHub 官方的 Actions Pages deployment，而不是發佈一個 Pages branch，GitHub 官方文件說 `CNAME` 會被忽略且不是必要檔案；是否需要它要看自己的 publishing source。這個專案是 branch publishing，所以我選擇把它留在建置產物裡。

## 把專案裡的舊網址一起換掉

能開啟新網域還不算完成。canonical、Open Graph 和 sitemap 如果仍指向 `github.io`，搜尋引擎會收到互相矛盾的訊號。

我先搜尋所有寫死的網址：

```bash
rg -n "haru0414.github.io|www.haruli.com|CNAME|canonical|sitemap" \
  README.md index.html public src scripts .github
```

這個專案需要確認的地方有：

| 檔案 | 用途 |
| --- | --- |
| `public/CNAME` | GitHub Pages 的自訂網域 |
| `index.html` | 首頁的 canonical、`og:url`、分享圖片網址 |
| `src/entry-server.tsx` | prerender 時產生各頁的絕對網址 |
| `src/components/SeoMeta.tsx` | 前端換頁時更新 canonical 與社群 meta |
| `scripts/prerender.mjs` | sitemap 的網域來源 |
| `public/robots.txt` | sitemap 的完整網址 |
| `scripts/make-og.mjs` | 分享圖片上顯示的網址文字 |
| `README.md` | 專案文件裡的 Live URL |

目前核心程式都把 origin 統一成：

```ts
const ORIGIN = "https://www.haruli.com";
```

更大型的專案可以再把它抽成單一設定或環境變數，避免下次換網域時要改很多份。

另外，這是 `haru0414.github.io` 使用者網站，Vite 預設的 `base: "/"` 就能正常運作。若原本是 `username.github.io/repository/` 形式的 project site，而且 `vite.config.ts` 曾設成 `base: "/repository/"`，換到獨立網域根目錄後也要檢查是否應改成 `/`，否則 CSS 和 JavaScript 可能仍從錯誤路徑載入。

## 等 DNS 生效，再開啟 HTTPS

DNS 更新不一定馬上傳到每個地方。GitHub 提醒最長可能需要 24 小時，所以剛設定後看到 DNS check pending，不用立刻把 record 刪掉重做。

我用這幾個指令分層確認：

```bash
# www 是否指向原本的 GitHub Pages 網域
dig www.haruli.com CNAME +short

# 裸網域是否得到 GitHub Pages 的四個 IPv4
dig haruli.com A +short

# github.io 是否轉向正式網址
curl -I https://haru0414.github.io

# 裸網域是否轉向 www
curl -I https://haruli.com

# 正式網址是否正常回應
curl -I https://www.haruli.com
```

這個專案最後得到的關係是：

```
haru0414.github.io ──301──┐
                          ├──> https://www.haruli.com
haruli.com ─────────301───┘
```

等 GitHub Pages 的 DNS check 成功、憑證簽發完成後，在 **Settings → Pages** 勾選 **Enforce HTTPS**。最後再用無痕視窗測試三個網址，避免瀏覽器快取讓結果看起來和實際設定不同。

## 我會特別檢查的坑

### DNS 顯示正常，GitHub 卻一直檢查失敗

先檢查同一個 Name 是否還有舊的 `A`、`AAAA` 或 `CNAME`。尤其是多出來、卻沒有指向 GitHub Pages 的 `AAAA`，可能妨礙 DNS 檢查和 HTTPS 憑證簽發。

### CNAME 填成完整網址

Cloudflare 的 CNAME Content 應該是 `haru0414.github.io`，不是 `https://haru0414.github.io/`，也不是 `haru0414.github.io/Resume`。

### 部署一次後 Custom domain 消失

檢查正式 build 裡是否真的有檔案：

```bash
npm run build
cat dist/CNAME
```

結果應該只有 `www.haruli.com`。

### 網站正常，但 Google 還留著舊網址

先確認每一頁的 canonical、sitemap、`og:url` 都已改成新網域。舊的 `github.io` 會由 GitHub 重新導向，但搜尋引擎重新整理索引仍需要時間；有使用 Google Search Console 的話，也要新增並驗證新網域資源，再提交新的 sitemap。

## 完成後的檢查清單

- GitHub 帳號的 Pages 設定已驗證裸網域，TXT record 沒有刪除
- Repository Pages 的 Custom domain 只填正式網址
- Cloudflare 的 `@` 有四筆 GitHub Pages A records
- Cloudflare 的 `www` CNAME 指向 `<username>.github.io`
- 第一次設定先使用 DNS only
- `public/CNAME` 會出現在實際發佈的 branch 根目錄
- GitHub Pages 已開啟 Enforce HTTPS
- 裸網域、`www`、舊 `github.io` 都會收斂到同一個 HTTPS 網址
- canonical、sitemap、Open Graph 和 README 都不再指向舊網域

網域替換真正麻煩的不是某一筆 DNS，而是要讓 DNS、GitHub Pages 和網站輸出的網址三者一致。一旦先選定唯一正式網址，再照這三層逐一驗證，整個流程就會清楚很多。

延伸閱讀：[GitHub Pages 自訂網域設定](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)、[GitHub Pages 網域驗證](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)、[Cloudflare DNS records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)、[Cloudflare Proxy status](https://developers.cloudflare.com/dns/proxy-status/)。
