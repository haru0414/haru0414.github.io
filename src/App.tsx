import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import SkillsSection from "./components/sections/SkillsSection";
import LabSection from "./components/sections/LabSection";
import ContactSection from "./components/sections/ContactSection";
import ScrollCat from "./components/play/ScrollCat";
import NotFoundPage from "./pages/NotFoundPage";
import FloatingCat from "./components/FloatingCat";
import SeoMeta from "./components/SeoMeta";
import CrayonDefs from "./components/crayon/CrayonDefs";
// 詳情頁同步 import（非 lazy）：專案頁已在建置時 prerender，renderToString
// 必須能渲染出完整內容；lazy 會在 SSR 只渲染 Suspense fallback、導致 hydration
// 邊界不一致（React #419）。
import ProjectDetailPage from "./pages/ProjectDetailPage";
// 同步 import 的理由同上：/surf 也要進 prerender
import SurfPage from "./pages/SurfPage";
import LabPage from "./pages/LabPage";
import ErrorBoundary, { ErrorScreen } from "./components/ErrorBoundary";

// Custom Cursor Component - Using refs for smooth performance
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check if device supports hover (desktop)
    setIsDesktop(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous animation frame for smooth updates
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          const size = isHovering ? 40 : 20;
          cursorRef.current.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`;
          cursorRef.current.style.opacity = "1";
        }
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDesktop, isHovering]);

  if (!isDesktop) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
      style={{
        width: isHovering ? 40 : 20,
        height: isHovering ? 40 : 20,
        backgroundColor: isHovering
          ? "var(--color-poster)"
          : "var(--color-nekoma)",
        borderColor: "var(--color-ink)",
        opacity: 0,
        willChange: "transform",
        transition: "width 0.15s, height 0.15s, background-color 0.15s",
        mixBlendMode: "difference",
      }}
    />
  );
}

// Parallax Background Elements
function ParallaxElements({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large decorative circles */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-5"
        style={{
          backgroundColor: "var(--color-nekoma)",
          top: "10%",
          right: "-10%",
          transform: `translateY(${scrollProgress * -100}px)`,
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-5"
        style={{
          backgroundColor: "var(--color-poster)",
          top: "60%",
          left: "-5%",
          transform: `translateY(${scrollProgress * -150}px)`,
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-5"
        style={{
          backgroundColor: "var(--color-teal)",
          top: "120%",
          right: "20%",
          transform: `translateY(${scrollProgress * -200}px)`,
        }}
      />

      {/* Floating dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            backgroundColor:
              i % 3 === 0
                ? "var(--color-nekoma)"
                : i % 3 === 1
                  ? "var(--color-poster)"
                  : "var(--color-teal)",
            opacity: 0.15,
            left: `${8 + ((i * 8) % 85)}%`,
            top: `${10 + ((i * 13) % 80)}%`,
            transform: `translateY(${Math.sin(scrollProgress * 5 + i) * 20}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 從專案詳情頁「← BACK」返回時，直接捲回 project list 區，免得又從頭滑下來
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    // 清掉 history state，避免重新整理時又自動捲動
    window.history.replaceState({}, "");
    // 冷啟動時上方版面（圖片）仍在 reflow，連續幾幀重新校正、把位置釘在目標區
    let frame = 0;
    let raf = 0;
    const pin = () => {
      document.getElementById(target)?.scrollIntoView();
      if (++frame < 6) raf = requestAnimationFrame(pin);
    };
    raf = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(raf);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide default cursor on desktop
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches
    ) {
      document.body.style.cursor = "none";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >
      {/* Skip link：鍵盤第一個 Tab 即可跳過裝飾直達主內容 */}
      <a href="#main" className="skip-link">
        {t("a11y.skip")}
      </a>

      {/* Noise Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Parallax Background */}
      <ParallaxElements scrollProgress={scrollProgress} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <LabSection />
        <SkillsSection />
        <ContactSection />
      </main>

      {/* 捲動陪跑貓：沿底線跟著捲動走 */}
      <ScrollCat />
    </div>
  );
}

function HomePage() {
  return <App />;
}

// router 內的整棵樹，抽出來讓 client(HashRouter)與 build 期 SSR(MemoryRouter)
// 共用，確保 prerender 的 HTML 與 client hydration 完全一致
// SSR 期間沒有 layout 可量，退回 useEffect 避免 React 警告
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 換頁時把捲動位置歸零。React Router 不會自動做這件事，先前只有 /surf 與
 * 專案詳情頁各自處理，/lab、/500、404 都會繼承前一頁的位置。
 *
 * 用 layout effect 而非一般 effect：後者在繪製之後才跑，使用者會看到畫面
 * 先停在舊位置再跳上去。
 *
 * /surf 例外——它要記住來源位置好在離開時還原，自己在 useSurfScroll 內處理。
 * 由它返回時，其 cleanup 的 rAF 會在這個 layout effect 之後才執行，
 * 所以還原不會被這裡蓋掉。
 */
// 記住首頁被離開時的捲動位置，返回時回到原處。只記首頁：其他頁都是
// 「點進去就從頭看」，記住位置反而奇怪
let homeScrollY = 0;

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef<string | null>(null);

  // 在首頁時持續記錄位置。不能等到換頁當下才讀——目標頁若比首頁矮（例如
  // 500 頁只有一個視窗高），瀏覽器會先把 scrollY 裁切掉，讀到的就是 0
  useEffect(() => {
    if (pathname.replace(/\/+$/, "") !== "") return;
    const save = () => {
      // 換頁時 layout effect 會先把畫面歸零，而這個監聽器要到 passive effect
      // 的 cleanup 才移除——那一下的 scroll 事件會把記住的位置蓋成 0。
      // 以當下的網址再確認一次，離開首頁後就不再寫入
      if (window.location.pathname.replace(/\/+$/, "") !== "") return;
      homeScrollY = window.scrollY;
    };
    save();
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [pathname]);

  useIsomorphicLayoutEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const from = prevPath.current;
    prevPath.current = path;


    // 回到首頁：還原到當初點進去的地方，而不是跳回最上面
    if (path === "/" && from !== null && homeScrollY > 0) {
      const y = homeScrollY;
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      // 等版面高度定案再定位——首頁尚未渲染完時直接設會被裁切
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, left: 0, behavior: "instant" });
          html.style.scrollBehavior = prev;
        }),
      );
      return () => cancelAnimationFrame(raf);
    }

    if (path === "/surf") return;
    // index.css 對 html 設了 scroll-behavior: smooth，window.scrollTo 會遵守它，
    // 變成「平滑捲動上去」而不是「開啟就在最上面」。改用 instant 明確要求瞬間定位。
    const jump = () => {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      html.style.scrollBehavior = prev;
    };

    jump();
    // 內容較多的頁面（/lab 有十個 demo）在掛載期間高度持續變動，期間可能被
    // 其他機制帶著捲動。接下來幾幀再定位一次——新的 scrollTo 會中斷任何
    // 進行中的平滑捲動，這也是這裡不只呼叫一次的原因
    let n = 0;
    let raf = requestAnimationFrame(function again() {
      jump();
      if (++n < 4) raf = requestAnimationFrame(again);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return null;
}

export function AppShell() {
  // /surf 是獨立的深色電影感 demo 頁，全站的漫畫風掛件都不該出現在上面。
  // FloatingCat 內含右下角飼料碗選單（PetBowl），一併關掉。
  // 用 useLocation 而非 CSS 隱藏：這些元件都有捲動 / 滑鼠監聽，
  // 只是視覺藏起來仍會跟 ScrollTrigger 搶主執行緒。
  const { pathname } = useLocation();
  // 必須去掉尾斜線再比對：GitHub Pages 對 /surf 會 301 導向 /surf/，
  // 線上的 pathname 帶尾斜線，用完全相等判斷會漏掉，飼料碗就跑出來了
  const isSurf = pathname.replace(/\/+$/, "") === "/surf";

  return (
    <>
      <ScrollToTop />
      <CrayonDefs />
      <SeoMeta />
      {!isSurf && <CustomCursor />}
      {!isSurf && <FloatingCat />}
      {/* 攔住 render 期例外。這站是靜態站沒有伺服器 500，等價的線上故障
          就是元件拋錯導致整頁空白——沒有這層就連「出錯了」都不會顯示 */}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/surf" element={<SurfPage />} />
          <Route path="/lab" element={<LabPage />} />
          {/* 500 畫面的 demo 路由：它平常只有真的壞掉才看得到，
              開一個入口才能當作品給人看，也才檢查得到樣式 */}
          <Route path="/500" element={<ErrorScreen />} />
          {/* 未知路徑顯示 404 迷路貓（搭配 GitHub Pages 的 404.html fallback） */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
