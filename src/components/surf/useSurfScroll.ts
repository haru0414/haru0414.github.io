import { useEffect } from "react";
import type { RefObject } from "react";

type Gsap = typeof import("gsap")["gsap"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
export type SurfSetup = (gsap: Gsap, ScrollTrigger: ScrollTriggerType) => void;

/**
 * /surf 專用的捲動引擎。負責三件事，其餘動畫編排交給 setup callback：
 *
 * 1. 隔離全站樣式：對 <html> 加 .surf-mode。index.css 的
 *    `scroll-behavior: smooth` 會讓 ScrollTrigger 的 pin/scrub 抖動，
 *    `overflow-x: hidden` 會讓 pin 定位失準（祖先建立了 scroll container）。
 * 2. 動態載入 gsap / lenis，讓首頁的 bundle 不必背這 70KB。
 * 3. Lenis 只在桌機啟用。Lenis 會把整頁包進被 transform 的容器，
 *    配滿版大圖在中低階行動裝置上會形成巨大的 composite layer，
 *    手機退回原生捲動反而更穩、更省電。
 *
 * prefers-reduced-motion 時完全不初始化，頁面維持 CSS 的靜態可讀狀態。
 */
export function useSurfScroll(
  rootRef: RefObject<HTMLElement | null>,
  setup: SurfSetup,
) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("surf-mode");

    // React Router 不會自動重置捲動位置，從首頁捲到一半點進來會直接落在
    // 頁面中段（ProjectDetailPage:19 也是自己處理）。必須在 ScrollTrigger
    // 初始化「之前」歸零，否則各 trigger 會以錯誤的起始位置計算。
    window.scrollTo(0, 0);
    // 瀏覽器的捲動還原機制會在 reload 後把位置搶回去，暫時關掉
    const prevRestoration = history.scrollRestoration;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let dispose = () => {};
    let cancelled = false;

    (async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 重新部署後舊分頁的 chunk 檔名會失效，動態 import 會 reject。
      // 接住之後頁面維持 CSS 的靜態可讀狀態，而不是半殘或空白。
      let mods;
      try {
        mods = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      } catch (err) {
        console.warn("[surf] 動畫模組載入失敗，改以靜態版本呈現", err);
        return;
      }
      const [{ gsap }, { ScrollTrigger }] = mods;
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // 桌機才接管捲動；coarse pointer 一律走原生
      const useLenis = !window.matchMedia("(pointer: coarse)").matches;
      let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
      let tick: ((t: number) => void) | null = null;

      if (useLenis) {
        let Lenis;
        try {
          ({ default: Lenis } = await import("lenis"));
        } catch (err) {
          console.warn("[surf] Lenis 載入失敗，改用原生捲動", err);
          Lenis = null;
        }
        if (cancelled) return;

        if (Lenis) {
          const instance = new Lenis({ duration: 1.05, smoothWheel: true });
          instance.on("scroll", ScrollTrigger.update);
          tick = (time: number) => instance.raf(time * 1000);
          gsap.ticker.add(tick);
          // lagSmoothing 會在掉幀時跳過補間，與 scrub 疊加會產生跳動
          gsap.ticker.lagSmoothing(0);
          lenis = instance;
        }
      }

      const ctx = gsap.context(() => setup(gsap, ScrollTrigger), rootRef.current ?? undefined);

      dispose = () => {
        ctx.revert();
        if (tick) gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      dispose();
      html.classList.remove("surf-mode");
      if ("scrollRestoration" in history) history.scrollRestoration = prevRestoration;
    };
    // setup 由呼叫端以模組層級常數傳入，不隨 render 變動
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
