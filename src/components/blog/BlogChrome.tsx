import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { posts } from "../../data/posts";

/**
 * 部落格的門面：頁首列與頁尾。兩個頁面共用，讓 /blog 底下有一致的
 * 「站中站」感，而不是各自獨立的頁面。
 */
export default function BlogChrome({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <main className="blog-bg min-h-screen">
      <header className="blog-topbar">
        <div className="container mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/blog"
            className="text-lg no-underline"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            NOTES
          </Link>
          <nav
            aria-label={t("blog.navSite")}
            className="flex items-center gap-4 text-[11px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="tabular-nums" style={{ color: "var(--color-muted)" }}>
              {t("blog.count", { n: posts.length })}
            </span>
            <Link
              to="/"
              className="tracking-[0.12em] no-underline underline-offset-4 hover:underline"
              style={{ color: "var(--color-ink)" }}
            >
              ← {t("lab.back")}
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer
        className="mt-16 border-t-2 py-10"
        style={{ borderColor: "var(--color-ink)" }}
      >
        <div className="container mx-auto flex max-w-5xl flex-col gap-2 px-4 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <p className="m-0">{t("blog.footerNote")}</p>
          <p className="m-0">© 2026 HARU LI</p>
        </div>
      </footer>
    </main>
  );
}
