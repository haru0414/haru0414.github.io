import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";
import HomeSectionRail from "./components/layout/HomeSectionRail";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import SkillsSection from "./components/sections/SkillsSection";
import LabSection from "./components/sections/LabSection";
import ContactSection from "./components/sections/ContactSection";
import ScrollCat from "./components/play/ScrollCat";
import NotFoundPage from "./pages/NotFoundPage";
import SeoMeta from "./components/SeoMeta";
import CrayonDefs from "./components/crayon/CrayonDefs";
// 詳情頁同步 import（非 lazy）：專案頁已在建置時 prerender，renderToString
// 必須能渲染出完整內容；lazy 會在 SSR 只渲染 Suspense fallback、導致 hydration
// 邊界不一致（React #419）。
import ProjectDetailPage from "./pages/ProjectDetailPage";
import WorkPage from "./pages/WorkPage";
// 同步 import 的理由同上：/surf 也要進 prerender
import SurfPage from "./pages/SurfPage";
import LabPage from "./pages/LabPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ErrorBoundary, { ErrorScreen } from "./components/ErrorBoundary";

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

      {/* 首頁專用的區塊指示器。站台導覽在 SiteHeader */}
      <HomeSectionRail />

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
  const { pathname, hash } = useLocation();
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

  // 帶錨點的連結（頁首的「聊聊」、頁尾的「作品」都是 /#區塊）。
  // 必須跟下面的歸零邏輯分開處理，否則兩邊會互相打架——歸零那段連捲四幀，
  // 單純呼叫 scrollIntoView 會被它蓋掉。目標區塊可能還沒掛載，所以要重試。
  //
  // 用 instant 而非 smooth：跨頁的錨點動輒要捲幾千 px，動畫既慢又讓人失去
  // 方向感；這也跟下面「換頁就直接在正確位置」的處理一致。
  useEffect(() => {
    if (!hash) return;
    let attempt = 0;
    let timer = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "instant" });
      } else if (++attempt < 20) {
        timer = window.setTimeout(tryScroll, 50);
      }
    };
    // 讓歸零那四幀先跑完再開始找，不然會捲到一半被拉回頂端
    timer = window.setTimeout(tryScroll, 120);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  useIsomorphicLayoutEffect(() => {
    // 有錨點時交給上面那段處理，這裡不要歸零
    if (hash) {
      prevPath.current = pathname.replace(/\/+$/, "") || "/";
      return;
    }
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
  }, [pathname, hash]);
  return null;
}

export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <CrayonDefs />
      <SeoMeta />
      {/* 攔住 render 期例外。這站是靜態站沒有伺服器 500，等價的線上故障
          就是元件拋錯導致整頁空白——沒有這層就連「出錯了」都不會顯示 */}
      <ErrorBoundary>
        <Routes>
          {/* 站台外框（頁首、頁尾、漫畫風掛件）由 SiteLayout 提供。
              /surf 刻意排在外面：它是全螢幕的沉浸式敘事頁，不該有外框 */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/blog" element={<BlogPage />} />
            {/* 看板路由必須排在文章路由之前，否則 /blog/board/x 會被
                當成 slug 為 "board" 的文章 */}
            <Route path="/blog/board/:board" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            {/* 500 畫面的 demo 路由：它平常只有真的壞掉才看得到，
                開一個入口才能當作品給人看，也才檢查得到樣式 */}
            <Route path="/500" element={<ErrorScreen />} />
            {/* 未知路徑顯示 404 迷路貓（搭配 GitHub Pages 的 404.html fallback） */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/surf" element={<SurfPage />} />
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
