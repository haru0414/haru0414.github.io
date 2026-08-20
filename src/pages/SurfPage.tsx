import { useRef } from "react";
import { Link } from "react-router-dom";
import SurfImage from "../components/surf/SurfImage";
import { useSurfScroll, type SurfSetup } from "../components/surf/useSurfScroll";
import "./surf.css";

// 動畫編排。放在模組層級是刻意的：內容不隨 render 變動，也讓 useSurfScroll
// 的 effect 能安全地只跑一次。
// 全程只碰 transform / opacity——filter、box-shadow、width/height 都會觸發
// 重繪或重排，在滿版大圖上是掉幀主因。
const SCENES = [
  [".surf-s0", "SURF"],
  [".surf-s1", "EP.01 PADDLE OUT"],
  [".surf-s2", "EP.02 LINE-UP"],
  [".surf-s3", "EP.03 TAKE-OFF"],
  [".surf-s4", "EP.04 BARREL"],
  [".surf-s5", "EP.05 WIPEOUT"],
  [".surf-s6", "EP.06 SURFACE"],
  [".surf-s7", "EP.07 SUNSET"],
] as const;

// 動畫編排。放在模組層級是刻意的：內容不隨 render 變動，也讓 useSurfScroll
// 的 effect 能安全地只跑一次。
// 全程只碰 transform / opacity——filter、box-shadow、width/height 都會觸發
// 重繪或重排，在滿版大圖上是掉幀主因。
//
// 編排原則：一幕一招，技法不重複。八幕都用同一種視差的話，再多特效也只是吵。
const setup: SurfSetup = (gsap, ScrollTrigger) => {
  // ── 跨幕 HUD ─────────────────────────────────────────────
  // 跨越八個獨立 ScrollTrigger 維持單一狀態，是純 CSS scroll-driven
  // animation 做不到的事，也是這頁最能說明 ScrollTrigger 價值的一段
  const epEl = document.querySelector<HTMLElement>(".surf-hud-ep");
  // start:0 + end:"max" 涵蓋整個可捲動範圍。不能用 trigger + "bottom bottom"：
  // HUD 建立在各幕 pin 之前，範圍算完後 pin 才把頁面撐長，作用區間會提早結束
  gsap.to(".surf-hud-fill", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
  // 用單一 onUpdate 主動判斷「目前哪一幕佔住視口中線」，而不是逐幕掛
  // onEnter/onEnterBack。跳躍式捲動時所有被跨過的 trigger 都會觸發，
  // 最後執行的那個會覆蓋掉正確值——標籤就會卡在最後一幕
  const sceneEls: { el: HTMLElement; label: string }[] = [];
  for (const [sel, label] of SCENES) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) sceneEls.push({ el, label });
  }

  let lastLabel = "";
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: () => {
      if (!epEl) return;
      const mid = window.innerHeight / 2;
      // 由後往前找第一個已越過中線的幕，pin 造成的位移也能正確反映
      let current = sceneEls[0]?.label ?? "";
      for (const { el, label } of sceneEls) {
        if (el.getBoundingClientRect().top <= mid) current = label;
      }
      if (current !== lastLabel) {
        lastLabel = current;
        epEl.textContent = current;
      }
    },
  });

  // ── S0 Hero：標題揭露，捲離時四個字母以不同速度散開 ──────
  gsap.from(".surf-mask > span", { yPercent: 110, duration: 1.1, ease: "power3.out" });
  gsap.from(".surf-s0 .surf-line", { opacity: 0, y: 18, duration: 0.9, delay: 0.5, ease: "power2.out" });
  gsap.to(".surf-s0 .surf-title", {
    yPercent: -60,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: ".surf-s0", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".surf-s0 .surf-bg", {
    scale: 1.25,
    ease: "none",
    scrollTrigger: { trigger: ".surf-s0", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".surf-hint", {
    opacity: 0,
    scrollTrigger: { trigger: ".surf-s0", start: "top top", end: "+=240", scrub: true },
  });

  // ── S1 Paddle Out：空拍俯視，緩慢旋轉 + 拉遠成全景 ────────
  gsap.fromTo(
    ".surf-s1 .surf-bg",
    { scale: 1.5, rotation: -4 },
    {
      scale: 1.05,
      rotation: 2,
      ease: "none",
      scrollTrigger: { trigger: ".surf-s1", start: "top bottom", end: "bottom top", scrub: true },
    },
  );
  gsap.from(".surf-s1 .surf-line", {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    scrollTrigger: { trigger: ".surf-s1", start: "top 62%", end: "center center", scrub: true },
  });

  // ── S2 Line-up：全片唯一零位移的一幕 ──────────────────────
  // 底圖完全靜止，文字逐句「替換」而非疊加。靜本身就是編排，
  // 有這一格的停頓，S4 的爆點才有對比
  const s2Lines = gsap.utils.toArray<HTMLElement>(".surf-s2 .surf-line");
  const s2tl = gsap.timeline();
  s2Lines.forEach((line, i) => {
    s2tl.fromTo(line, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, i * 1.1);
    if (i < s2Lines.length - 1) s2tl.to(line, { opacity: 0, duration: 0.5, ease: "none" }, i * 1.1 + 0.85);
  });
  ScrollTrigger.create({
    trigger: ".surf-s2",
    start: "top top",
    end: "+=180%",
    pin: true,
    scrub: true,
    animation: s2tl,
  });

  // ── S3 Take-off：單張寬幅橫向平移 ────────────────────────
  // 距離依實際圖寬計算，任何螢幕寬度都不會提早跑完或留白
  const track = document.querySelector<HTMLElement>(".surf-s3-track");
  if (track) {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".surf-s3",
        start: "top top",
        end: () => `+=${distance()}`,
        pin: ".surf-s3-viewport",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    // 文字反向移動，與圖形成速度差
    gsap.fromTo(
      ".surf-s3-copy",
      { xPercent: 7, opacity: 0 },
      {
        xPercent: -7,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".surf-s3",
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  // ── S4 Barrel：前景浪唇壓過底圖 ──────────────────────────
  // 時序分三段：前 30% 只有乾淨的衝浪照，浪唇才從畫面外升起並淡入，
  // 最後才是文字。位移與透明度同時走，交錯處才有「被蓋過去」的層次
  ScrollTrigger.create({
    trigger: ".surf-s4",
    start: "top top",
    end: "+=170%",
    pin: true,
    scrub: true,
    animation: gsap
      .timeline()
      .fromTo(".surf-s4 .surf-bg", { scale: 1.14, yPercent: -3 }, { scale: 1, yPercent: 3, ease: "none" }, 0)
      .fromTo(
        ".surf-s4-lip",
        { yPercent: 108, opacity: 0, scale: 1.18 },
        { yPercent: -6, opacity: 1, scale: 1.02, ease: "none", duration: 0.72 },
        0.3,
      )
      .fromTo(".surf-s4 .surf-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "none", duration: 0.3 }, 0.62),
  });

  // ── S5 Wipeout：持續下沉 ─────────────────────────────────
  // 釘住並拉長行程，底圖一路放大下沉、暗幕漸深；文字以更快的速度往上跑出
  // 畫面。速度差就是「你在下沉、水面在遠離」的來源
  ScrollTrigger.create({
    trigger: ".surf-s5",
    start: "top top",
    end: "+=210%",
    pin: true,
    scrub: true,
    animation: gsap
      .timeline()
      .fromTo(
        ".surf-s5 .surf-bg",
        { yPercent: -12, scale: 1.04, rotation: 3 },
        { yPercent: 16, scale: 1.42, rotation: -2, ease: "none" },
        0,
      )
      .fromTo(".surf-s5-veil", { opacity: 0 }, { opacity: 0.78, ease: "none" }, 0)
      // 文字比底圖快一倍以上地往上離場，讀完就沉下去了
      .fromTo(
        ".surf-s5 .surf-copy",
        { yPercent: 45 },
        { yPercent: -110, ease: "none" },
        0,
      )
      .fromTo(".surf-s5 .surf-line", { opacity: 0 }, { opacity: 1, stagger: 0.12, duration: 0.25 }, 0.05)
      .to(".surf-s5 .surf-line", { opacity: 0, duration: 0.2 }, 0.72),
  });

  // ── S6 Surface：破水而出，鏡頭仰角轉正 ────────────────────
  // 全頁唯一的 3D 變換：rotationX 由正值收到 0，配合 .surf-s6 的
  // perspective 與底部 origin，讀起來就是抬頭破出水面那一下。
  // 釘住是為了給仰起這個動作足夠的行程，沒有 pin 的話一個視窗就跑完了
  ScrollTrigger.create({
    trigger: ".surf-s6",
    start: "top top",
    end: "+=150%",
    pin: true,
    scrub: true,
    animation: gsap
      .timeline()
      .fromTo(
        ".surf-s6 .surf-bg",
        { yPercent: 16, scale: 1.26, rotationX: 18, opacity: 0.3, transformOrigin: "50% 100%" },
        { yPercent: -4, scale: 1.06, rotationX: 0, opacity: 1, ease: "none", duration: 0.62 },
        0,
      )
      .fromTo(
        ".surf-s6 .surf-line",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.18, ease: "none", duration: 0.3 },
        0.5,
      ),
  });

  // ── S7 Sunset：收尾，最平靜 ──────────────────────────────
  // 同樣釘住：這是結尾，需要停留的時間，掃過去就沒有收束感
  ScrollTrigger.create({
    trigger: ".surf-s7",
    start: "top top",
    end: "+=140%",
    pin: true,
    scrub: true,
    animation: gsap
      .timeline()
      .fromTo(
        ".surf-s7 .surf-bg",
        { yPercent: -8, scale: 1.16 },
        { yPercent: 6, scale: 1.04, ease: "none", duration: 1 },
        0,
      )
      .fromTo(
        ".surf-s7 .surf-copy > *",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, stagger: 0.16, ease: "none", duration: 0.35 },
        0.25,
      ),
  });
};


export default function SurfPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSurfScroll(rootRef, setup);

  return (
    <div className="surf-root" ref={rootRef}>
      <Link to="/" className="surf-exit">
        ← 返回作品集
      </Link>

      <div className="surf-hud" aria-hidden="true">
        <span className="surf-hud-ep">EP.01 PADDLE OUT</span>
        <span className="surf-hud-rail">
          <span className="surf-hud-fill" />
        </span>
      </div>

      <section className="surf-scene surf-s0">
        <SurfImage className="surf-bg" name="s0-hero" alt="從空中俯瞰的海面，浪紋層層推向岸邊" priority />
        <div className="surf-copy">
          <h1 className="surf-title surf-mask">
            <span>SURF</span>
          </h1>
          <p className="surf-line surf-line--dim">一次出海，七個瞬間</p>
        </div>
        <span className="surf-hint">SCROLL</span>
      </section>

      <section className="surf-scene surf-s1">
        <SurfImage className="surf-bg" name="s1-paddle-out" alt="從空中俯瞰，三名衝浪者趴在長板上於深青色海面划水出海" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.01 PADDLE OUT</p>
          <p className="surf-line">出海這段路沒有捷徑。</p>
          <p className="surf-line surf-line--dim">每一次划水都在把岸推遠一點。</p>
        </div>
      </section>

      <section className="surf-scene surf-s2">
        <SurfImage className="surf-bg" name="s2-lineup" alt="兩名衝浪者坐在板上，於平坦無浪的灰色海面遠遠等待" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.02 LINE-UP</p>
          <p className="surf-line">然後就是等。</p>
          <p className="surf-line">海不會因為你準備好了就給你浪。</p>
          <p className="surf-line surf-line--dim">這一段最安靜，也最久。</p>
        </div>
      </section>

      <section className="surf-s3">
        <div className="surf-s3-viewport">
          <div className="surf-s3-track">
            <SurfImage
              name="s3-takeoff-wide"
              alt="衝浪者在浪面上做出轉向，身後濺起大片浪花"
              /* 高度撐滿視口、比例 2.4:1，實際渲染寬度約為視口高的 2.4 倍 */
              sizes="(max-width: 640px) 156vh, 240vh"
            />
          </div>
          {/* 必須放在被 pin 的 viewport 內：放外面的話它會以整個含 pin spacer
              的區塊置中，而不是以視口置中，文字就會跑到畫面頂端 */}
          <div className="surf-copy surf-s3-copy">
            <p className="surf-eyebrow">EP.03 TAKE-OFF</p>
            <p className="surf-line">站起來的那一下，沒有時間考慮。</p>
          </div>
        </div>
      </section>

      <section className="surf-scene surf-s4">
        <SurfImage className="surf-bg" name="s4-barrel" alt="衝浪者正乘在一道乾淨的藍色浪面上" />
        {/* 去背的浪唇疊在文字前面，捲動時壓下來把畫面蓋住 */}
        <SurfImage className="surf-s4-lip" name="s4-barrel-cut" alt="" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.04 BARREL</p>
          <p className="surf-line">浪把你關進去的那幾秒，外面沒有聲音。</p>
        </div>
      </section>

      <section className="surf-scene surf-s5">
        <SurfImage className="surf-bg" name="s5-wipeout" alt="從水面下往上看的視角，光線穿過翻攪的海水" />
        <div className="surf-s5-veil" aria-hidden="true" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.05 WIPEOUT</p>
          <p className="surf-line">然後就下去了。</p>
          <p className="surf-line surf-line--dim">分不清上下，只能等浮力把你帶回去。</p>
        </div>
      </section>

      {/* 新增的過渡幕：S5 沉下去與 S7 日落之間，少了「回到水面」這一拍，
          情緒會從溺水直接跳到收尾。這幕也是全片唯一主動選擇的時刻 */}
      <section className="surf-scene surf-s6">
        <SurfImage className="surf-bg" name="s6-surface" alt="人剛破水而出，只有頭浮在暗色水面上，水紋反著低角度的暖光" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.06 SURFACE</p>
          <p className="surf-line">然後海把你推回水面。</p>
          <p className="surf-line surf-line--dim">你把板拉回來，決定再划一次。</p>
        </div>
      </section>

      <section className="surf-scene surf-s7">
        <SurfImage className="surf-bg" name="s7-sunset" alt="日落時分，衝浪者的剪影映在金橘色的海面上" />
        <div className="surf-copy">
          <p className="surf-eyebrow">EP.07 SUNSET</p>
          <p className="surf-line">天黑之前，還有最後一道。</p>
          <Link to="/" className="surf-back">
            回到作品集
          </Link>
        </div>
      </section>

      <p className="surf-credit">
        攝影素材來自 Unsplash 免費授權。以 GSAP ScrollTrigger 編排，桌機另接 Lenis 平滑捲動。
      </p>
    </div>
  );
}
