import { useEffect, useRef } from "react";
import CrayonCat from "./CrayonCat";

// 捲動陪跑 mascot：Onigiri 沿著視窗底線走動，位置對應頁面捲動進度
// （捲到頂 → 最左、捲到底 → 最右）。複用走路姿 + waddle 搖擺步態。
// 純裝飾（aria-hidden）、pointer-events:none、prefers-reduced-motion 時靜止。

const CAT_W = 84; // 貓寬（px）
const RIGHT_GAP = 92; // 右側保留給 FloatingCat 監工鈕，避免重疊
const LEFT_PAD = 8;

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

export default function ScrollCat() {
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = catRef.current;
    if (!cat) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const range = () => Math.max(0, window.innerWidth - CAT_W - RIGHT_GAP - LEFT_PAD);
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };

    let curX = LEFT_PAD + progress() * range();
    let targetX = curX;
    let facing = 1; // 1 面向左（原圖）、-1 翻面向右
    let phase = 0;
    let tilt = 0;
    let bob = 0;

    const render = () => {
      cat.style.transform =
        `translate3d(${curX}px, ${bob}px, 0) ` +
        `rotate(${tilt}deg) scaleX(${facing})`;
    };

    // 靜止模式：擺左側坐好
    if (reduce) {
      curX = LEFT_PAD;
      cat.dataset.state = "idle";
      render();
      return;
    }

    let raf = 0;
    let last = performance.now();
    let alive = false; // loop 是否在跑（settle 後停、捲動再喚醒）

    const step = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;

      const dx = targetX - curX;
      const adx = Math.abs(dx);
      // 朝目標 ease，速度換算成 px/s 供 waddle 使用
      const move = dx * Math.min(1, dt * 6);
      curX += move;
      const speed = Math.abs(move) / Math.max(dt, 0.001);

      if (dx > 1) facing = -1; // 往右走 → 翻面
      else if (dx < -1) facing = 1;

      const gait = clamp(speed / 220, 0, 1);
      if (speed > 30) phase += dt * (7 + speed * 0.05);
      const targetTilt = Math.sin(phase) * 6 * gait;
      tilt += (targetTilt - tilt) * 0.35;
      bob = -Math.abs(Math.sin(phase)) * 3 * gait;

      cat.dataset.state = speed > 50 ? "run" : "idle";
      render();

      // 抵達目標且擺角歸零後停 loop 省電
      if (adx < 0.5 && Math.abs(tilt) < 0.2) {
        tilt = 0;
        bob = 0;
        cat.dataset.state = "idle";
        render();
        alive = false;
        return;
      }
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

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={catRef}
      data-state="idle"
      aria-hidden="true"
      className="pointer-events-none fixed bottom-1 left-0 z-30 will-change-transform"
      style={{ width: CAT_W, height: CAT_W * 0.73, transformOrigin: "center bottom" }}
    >
      <CrayonCat className="h-full w-full" />
    </div>
  );
}
