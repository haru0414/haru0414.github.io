import { useEffect, useRef } from "react";

const COLORS = ["#C83E34", "#2F5C68", "#FFC845"];
const LIFE_MS = 180000; // 筆跡留存 3 分鐘
const FADE_MS = 6000; // 最後 6 秒淡出
const MAX_SEGMENTS = 6000;

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  born: number;
  seed: number;
}

// Deterministic pseudo-random so jitter stays stable across redraws (no flicker)
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface CrayonTrailProps {
  className?: string;
}

// Crayon drawing canvas: click-drag to scribble, one color per stroke.
// Desktop only, skipped when the user prefers reduced motion.
// New segments are drawn incrementally; a low-frequency sweep redraws the
// canvas to fade out expired strokes, so long persistence stays cheap.
export default function CrayonTrail({
  className = "absolute inset-0",
}: CrayonTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let segments: Segment[] = [];

    const drawSegment = (s: Segment, fade: number) => {
      // Layered jittered passes give the waxy crayon texture
      for (let p = 0; p < 3; p++) {
        const j = s.seed * 31 + p * 17;
        ctx.globalAlpha = (p === 0 ? 0.5 : 0.22) * fade;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = p === 0 ? 9 : 4;
        ctx.beginPath();
        ctx.moveTo(s.x1 + (rand(j) - 0.5) * 5, s.y1 + (rand(j + 1) - 0.5) * 5);
        ctx.lineTo(
          s.x2 + (rand(j + 2) - 0.5) * 5,
          s.y2 + (rand(j + 3) - 0.5) * 5,
        );
        ctx.stroke();
      }

      // Stray grain speck next to the stroke
      ctx.globalAlpha = 0.35 * fade;
      ctx.fillStyle = s.color;
      const sx = (s.x1 + s.x2) / 2;
      const sy = (s.y1 + s.y2) / 2;
      ctx.fillRect(
        sx + (rand(s.seed * 31 + 9) - 0.5) * 14,
        sy + (rand(s.seed * 31 + 10) - 0.5) * 14,
        2,
        2,
      );
      ctx.globalAlpha = 1;
    };

    const fadeOf = (s: Segment, now: number) => {
      const left = LIFE_MS - (now - s.born);
      return left >= FADE_MS ? 1 : Math.max(left / FADE_MS, 0);
    };

    const redrawAll = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);
      for (const s of segments) drawSegment(s, fadeOf(s, now));
    };

    const resize = () => {
      // offsetWidth 是排版尺寸，不受進場 scale transform 影響；
      // 尺寸沒變就跳過，避免 ResizeObserver 回饋迴圈
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if ((w === width && h === height) || w === 0 || h === 0) return;
      width = w;
      height = h;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      redrawAll();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // 低頻清掃：移除過期筆跡並重畫（含淡出中的筆跡）
    const sweep = window.setInterval(() => {
      if (segments.length === 0) return;
      const now = performance.now();
      const alive = segments.filter((s) => now - s.born < LIFE_MS);
      const fading = alive.some((s) => LIFE_MS - (now - s.born) < FADE_MS);
      const removed = alive.length !== segments.length;
      segments = alive;
      if (removed || fading) redrawAll();
    }, 500);

    let last: { x: number; y: number } | null = null;
    let drawing = false;
    let colorIndex = -1;
    let seedCounter = 0;

    // Container-relative coordinates so strokes land exactly under the cursor;
    // divide by the visual scale in case an entrance transform is active
    const toLocal = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: ((e.clientX - rect.left) / rect.width) * width,
        y: ((e.clientY - rect.top) / rect.height) * height,
      };
    };

    const handleDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault(); // 避免拖曳時選取到底下的文字
      const p = toLocal(e);
      if (!p) return;
      drawing = true;
      last = p;
      colorIndex = (colorIndex + 1) % COLORS.length; // 一筆一色
    };

    const handleMove = (e: MouseEvent) => {
      if (!drawing) return;
      const p = toLocal(e);
      if (!p) return;

      // Pause the stroke while the cursor is outside the canvas
      if (p.x < 0 || p.y < 0 || p.x > width || p.y > height) {
        last = null;
        return;
      }
      if (!last) {
        last = p;
        return;
      }

      if (Math.hypot(p.x - last.x, p.y - last.y) < 2) return;

      const segment: Segment = {
        x1: last.x,
        y1: last.y,
        x2: p.x,
        y2: p.y,
        color: COLORS[colorIndex],
        born: performance.now(),
        seed: seedCounter++,
      };
      segments.push(segment);
      if (segments.length > MAX_SEGMENTS) segments.shift();
      last = p;

      // 增量繪製：新筆畫直接疊上，不用每幀重畫整張
      drawSegment(segment, 1);
    };

    const handleUp = () => {
      drawing = false;
      last = null;
    };

    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      resizeObserver.disconnect();
      window.clearInterval(sweep);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full select-none ${className}`}
      aria-hidden="true"
    />
  );
}
