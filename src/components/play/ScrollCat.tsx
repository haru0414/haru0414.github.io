import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import OnigiriEgg from "../OnigiriEgg";
import run1 from "../../assets/images/onigiri/run-cat-1.webp";
import run2 from "../../assets/images/onigiri/run-cat-2.webp";
import run3 from "../../assets/images/onigiri/run-cat-3.webp";
import run4 from "../../assets/images/onigiri/run-cat-4.webp";
import run5 from "../../assets/images/onigiri/run-cat-5.webp";
import run6 from "../../assets/images/onigiri/run-cat-6.webp";
import run7 from "../../assets/images/onigiri/run-cat-7.webp";
import sleepCat from "../../assets/images/onigiri/sleep-cat.webp";
import waitCat from "../../assets/images/onigiri/wait-cat.webp";

// 捲動陪跑 mascot：Onigiri 沿著視窗底線走動，位置對應頁面捲動進度
// （捲到頂 → 最左、捲到底 → 最右）。三種姿態：
//   頂部靜止 → 睡覺（sleep-cat）、捲動中 → 走路七幀循環（run 1→…→7→1）、
//   底部靜止 → 坐在碗邊等（wait-cat）。走路圖原稿面向右，往左走時水平翻轉。
// 純裝飾（aria-hidden）、pointer-events:none、prefers-reduced-motion 時不跑動畫。

const RUN_FRAMES = 7; // 走路循環幀數。改這裡就要同步 index.css 的 data-frame 規則
const CAT_W = 100; // 貓框寬高（px，圖為正方形）
const RIGHT_GAP = 24; // 右側保留給飼料碗：捲到底時坐等貓湊到碗邊
const LEFT_PAD = 8;
// 整趟（最左↔最右）大約換幾次幀。手機可走範圍短，固定 px 步幅會換不了幾幀
// 看起來像滑行；改成依範圍除以這個次數動態算步幅，窄螢幕自動變快。
const STRIDE_STEPS = 52;
const SEAT = 14; // 把貓往下坐進地面的垂直補償（圖在 500 框內偏上）

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

export default function ScrollCat() {
  const { t } = useTranslation();
  const [showEgg, setShowEgg] = useState(false);
  const [spritesReady, setSpritesReady] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<HTMLButtonElement>(null);

  // 首屏只會用到睡覺姿態。其餘四張若也出現在 SSR HTML，React 19 會替它們
  // 全部產生 high-priority image preload，反而讓真正可見的睡覺貓被分掉頻寬。
  // 等初始頁面載入完成、瀏覽器有空時再掛上動畫幀；使用者開始捲動（interaction）
  // 前它們通常已進快取，也不會延後初始 LCP。
  useEffect(() => {
    let cancel = () => {};
    const schedule = () => {
      // Safari 17.3 以下沒有 requestIdleCallback，退回 setTimeout。
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(() => setSpritesReady(true), {
          timeout: 3000,
        });
        cancel = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(() => setSpritesReady(true), 300);
        cancel = () => window.clearTimeout(id);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      cancel();
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const pose = poseRef.current;
    if (!outer || !pose) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const range = () =>
      Math.max(0, window.innerWidth - CAT_W - RIGHT_GAP - LEFT_PAD);
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };

    let curX = LEFT_PAD + progress() * range();
    let targetX = curX;
    let facing = 1; // 1 = 原圖朝向（面向右）、-1 = 水平翻轉（面向左）
    let frameIdx = 0; // 0..RUN_FRAMES-1，對應 run-cat-1..7
    let stride = 0;
    let bob = 0;

    const render = () => {
      outer.style.transform = `translate3d(${curX}px, ${SEAT + bob}px, 0) scaleX(${facing})`;
    };

    // 依捲動進度決定靜止姿態：頂=睡、底=坐等、中間=站著
    const restPose = () => {
      const p = progress();
      if (p <= 0.01) {
        pose.dataset.pose = "sleep";
      } else if (p >= 0.99) {
        facing = 1; // 坐等貓（wait-cat）用原圖朝向，不翻轉
        pose.dataset.pose = "wait";
      } else {
        pose.dataset.pose = "idle";
      }
    };

    // 靜止模式：不跑動畫，捲動時直接定位 + 換姿態
    if (reduce) {
      const place = () => {
        curX = LEFT_PAD + progress() * range();
        bob = 0;
        restPose();
        render();
      };
      place();
      window.addEventListener("scroll", place, { passive: true });
      window.addEventListener("resize", place);
      return () => {
        window.removeEventListener("scroll", place);
        window.removeEventListener("resize", place);
      };
    }

    let raf = 0;
    let last = performance.now();
    let alive = false;

    const step = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;

      const dx = targetX - curX;
      const adx = Math.abs(dx);
      const move = dx * Math.min(1, dt * 6);
      curX += move;
      const speed = Math.abs(move) / Math.max(dt, 0.001);

      // 走路圖原稿面向右，所以往右走用原圖、往左走才翻面
      if (dx > 1) facing = 1;
      else if (dx < -1) facing = -1;

      // 抵達目標 → 收尾擺出靜止姿態，停 loop 省電
      if (adx < 0.5) {
        curX = targetX;
        stride = 0;
        bob = 0;
        restPose();
        render();
        alive = false;
        return;
      }

      // 走動中：依走過距離換幀，加一點上下起伏
      if (speed > 20) {
        // 步幅 = 可走範圍 / 目標換幀次數，並夾在合理範圍（窄螢幕更密、寬螢幕不過密）
        const strideLen = clamp(range() / STRIDE_STEPS, 6, 17);
        stride += Math.abs(move);
        if (stride >= strideLen) {
          frameIdx = (frameIdx + 1) % RUN_FRAMES;
          stride = 0;
        }
        bob = -Math.abs(Math.sin(performance.now() / 90)) * 2;
      }
      pose.dataset.pose = "run";
      pose.dataset.frame = String(frameIdx + 1);
      render();
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (!alive && !document.hidden) {
        alive = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const onScroll = () => {
      targetX = LEFT_PAD + progress() * range();
      kick();
    };
    const onResize = () => {
      targetX = LEFT_PAD + progress() * range();
      curX = clamp(curX, LEFT_PAD, LEFT_PAD + range());
      kick();
    };
    const onVis = () => {
      if (document.hidden) {
        alive = false;
        cancelAnimationFrame(raf);
      } else kick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    restPose();
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed bottom-1 left-0 z-30 will-change-transform"
        style={{
          width: CAT_W,
          height: CAT_W,
          transformOrigin: "center bottom",
        }}
      >
        {/* 點貓 → 跳出飯糰角色介紹（pointer-events:auto 蓋過外層 none） */}
        <button
          ref={poseRef}
          type="button"
          data-pose="sleep"
          data-sprites-ready={spritesReady ? "" : undefined}
          onClick={() => setShowEgg(true)}
          aria-label={t("a11y.meetCat")}
          className="cat-sprites pointer-events-auto cursor-pointer"
        >
          <img
            src={sleepCat}
            alt=""
            width={512}
            height={512}
            fetchPriority="high"
            draggable={false}
            className="cat-sprite cat-sleep"
          />
          {spritesReady && (
            <>
              <img
                src={run1}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-1"
              />
              <img
                src={run2}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-2"
              />
              <img
                src={run3}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-3"
              />
              <img
                src={run4}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-4"
              />
              <img
                src={run5}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-5"
              />
              <img
                src={run6}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-6"
              />
              <img
                src={run7}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-run-7"
              />
              <img
                src={waitCat}
                alt=""
                width={512}
                height={512}
                draggable={false}
                className="cat-sprite cat-wait"
              />
            </>
          )}
        </button>
      </div>

      {showEgg && <OnigiriEgg onClose={() => setShowEgg(false)} />}
    </>
  );
}
