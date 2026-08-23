import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import AnchorLink from "./AnchorLink";
import { Menu, X } from "lucide-react";

/**
 * 全站頁首。項目是「頁面」而不是首頁的區塊——區塊捲動已經拆到
 * HomeSectionRail，只在首頁出現。
 *
 * 顯示文字用拉丁字碼（WORK / LAB / BLOG），與站上其他標籤一致，
 * 也避開標題字型對中文的 fallback；本地化名稱走 aria-label。
 */
const ITEMS = [
  { to: "/work", code: "WORK", key: "work", match: "/work" },
  { to: "/lab", code: "LAB", key: "lab", match: "/lab" },
  { to: "/blog", code: "BLOG", key: "blog", match: "/blog" },
];

export default function SiteHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // 尾斜線正規化：GitHub Pages 對子路由會 301 加上尾斜線
  const path = pathname.replace(/\/+$/, "") || "/";
  const isActive = (match: string) =>
    path === match || path.startsWith(`${match}/`);

  const linkStyle = { fontFamily: "var(--font-heading)" };

  return (
    <header
      className="sticky top-0 z-40 border-b-2"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-ink)",
      }}
    >
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="text-lg tracking-wider no-underline"
          style={{ ...linkStyle, color: "var(--color-badge-red)" }}
        >
          H·L
        </Link>

        <nav
          aria-label={t("siteNav.label")}
          className="hidden items-center gap-7 md:flex"
        >
          {ITEMS.map((item) => {
            const active = isActive(item.match);
            return (
              <AnchorLink
                key={item.code}
                to={item.to}
                aria-label={t(`siteNav.${item.key}`)}
                aria-current={active ? "page" : undefined}
                className="relative text-xs tracking-[0.14em] no-underline transition-colors hover:text-(--color-nekoma)"
                style={{
                  ...linkStyle,
                  color: active ? "var(--color-nekoma)" : "var(--color-ink)",
                }}
              >
                {item.code}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "var(--color-nekoma)" }}
                  />
                )}
              </AnchorLink>
            );
          })}

          <AnchorLink
            to="/#next"
            className="border-2 px-3 py-1.5 text-xs tracking-[0.14em] no-underline transition-colors hover:bg-(--color-nekoma) hover:text-white"
            style={{
              ...linkStyle,
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              boxShadow: "var(--shadow-manga-sm)",
            }}
          >
            {t("siteNav.contact")}
          </AnchorLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("siteNav.close") : t("siteNav.open")}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-ink)",
            cursor: "pointer",
          }}
        >
          {open ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* 點擊面板內的連結就收合。改用事件處理而非監聽 pathname——
          後者是「effect 內 setState」，會多跑一次渲染 */}
      {open && (
        <nav
          aria-label={t("siteNav.label")}
          className="border-t-2 md:hidden"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-ink)",
          }}
        >
          <div className="container mx-auto flex max-w-6xl flex-col px-4 py-2">
            {ITEMS.map((item) => (
              <AnchorLink
                key={item.code}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.match) ? "page" : undefined}
                className="py-3 text-sm tracking-[0.14em] no-underline"
                style={{
                  ...linkStyle,
                  color: isActive(item.match)
                    ? "var(--color-nekoma)"
                    : "var(--color-ink)",
                }}
              >
                {item.code}
                <span
                  className="ml-2 text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  {t(`siteNav.${item.key}`)}
                </span>
              </AnchorLink>
            ))}
            <AnchorLink
              to="/#next"
              onClick={() => setOpen(false)}
              className="mt-2 mb-3 border-2 px-3 py-2 text-center text-sm tracking-[0.14em] no-underline"
              style={{
                ...linkStyle,
                borderColor: "var(--color-ink)",
                color: "var(--color-ink)",
              }}
            >
              {t("siteNav.contact")}
            </AnchorLink>
          </div>
        </nav>
      )}
    </header>
  );
}
