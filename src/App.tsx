import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import SkillsSection from "./components/sections/SkillsSection";
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
export function AppShell() {
  return (
    <>
      <CrayonDefs />
      <SeoMeta />
      <CustomCursor />
      <FloatingCat />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        {/* 未知路徑顯示 404 迷路貓（搭配 GitHub Pages 的 404.html fallback） */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
