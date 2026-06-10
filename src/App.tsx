import { useEffect, useState, useRef } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import SkillsSection from "./components/sections/SkillsSection";
import ContactSection from "./components/sections/ContactSection";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
        backgroundColor: "var(--color-paper)",
        color: "var(--color-ink)",
      }}
    >
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Parallax Background */}
      <ParallaxElements scrollProgress={scrollProgress} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  );
}

function HomePage() {
  return <App />;
}

export default function Root() {
  return (
    <HashRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
    </HashRouter>
  );
}
